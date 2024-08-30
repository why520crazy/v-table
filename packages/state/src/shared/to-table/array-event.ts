import { ActionName, AIFieldIdPath, AIFieldPath, AIFieldValueIdPath, AIRecordPath, AITableField, AITableQueries } from '@ai-table/grid';
import * as Y from 'yjs';
import { isArray } from 'ngx-tethys/util';
import {
    AITableSharedAction,
    AITableView,
    AITableViewFields,
    AITableViewRecords,
    AIViewTable,
    SharedType,
    SyncArrayElement,
    SyncMapElement,
    ViewActionName
} from '../../types';
import { translatePositionToPath, getShareTypeNumberPath } from '../utils';
import { getSharedMapValueId, getSharedRecordId, translateToRecordValues } from '../utils/translate';

export default function translateArrayEvent(aiTable: AIViewTable, activeViewId: string, sharedType: SharedType, event: Y.YEvent<any>): AITableSharedAction[] {
    let offset = 0;
    let targetPath = getShareTypeNumberPath(event.path);
    const isRecordsTranslate = event.path.includes('records');
    const isFieldsTranslate = event.path.includes('fields');
    const isViewsTranslate = event.path.includes('views');
    const actions: AITableSharedAction[] = [];

    event.changes.delta.forEach((delta) => {
        if ('retain' in delta) {
            offset += delta.retain ?? 0;
        }

        if ('delete' in delta) {
            if (isAddOrRemove(targetPath)) {
                if (isViewsTranslate) {
                    const removeView = aiTable.views()[offset];
                    if (removeView) {
                        actions.push({
                            type: ViewActionName.RemoveView,
                            path: [removeView._id]
                        });
                    }
                } else {
                    const type = isRecordsTranslate ? ActionName.RemoveRecord : ActionName.RemoveField;
                    const removeIds = getRemoveIds(event, type);
                    if (removeIds.length) {
                        removeIds.forEach((path) => {
                            actions.push({
                                type,
                                path
                            });
                        });
                    }
                }
            }
        }

        if ('insert' in delta) {
            if (isArray(delta.insert)) {
                if (isRecordsTranslate) {
                    if (isAddOrRemove(targetPath)) {
                        delta.insert?.map((item: Y.Array<any>) => {
                            const data = item.toJSON();
                            const [fixedField, customField] = data;
                            const position = customField[customField.length - 1][activeViewId];
                            const path = translatePositionToPath(
                                aiTable.records() as AITableViewRecords,
                                position,
                                activeViewId
                            ) as AIRecordPath;

                            actions.push({
                                type: ActionName.AddRecord,
                                path: path,
                                record: {
                                    _id: fixedField[0]['_id'],
                                    values: translateToRecordValues(customField, aiTable.fields() as AITableViewFields)
                                }
                            });
                        });
                    } else {
                        try {
                            delta.insert?.map((item: any) => {
                                const recordIndex = targetPath[0] as number;
                                const fieldIndex = offset;
                                const recordId = getSharedRecordId(sharedType.get('records')! as Y.Array<SyncArrayElement>, recordIndex);
                                const fieldId = getSharedMapValueId(sharedType.get('fields')! as Y.Array<SyncMapElement>, fieldIndex);
                                const path = [recordId, fieldId] as AIFieldValueIdPath;
                                const fieldValue = AITableQueries.getFieldValue(aiTable, path);

                                // To exclude insert triggered by field inserts.
                                if (fieldValue !== item) {
                                    actions.push({
                                        type: ActionName.UpdateFieldValue,
                                        path,
                                        fieldValue,
                                        newFieldValue: item
                                    });
                                }
                            });
                        } catch (error) {}
                    }
                }
                if (isFieldsTranslate) {
                    delta.insert?.map((item: Y.Map<any>) => {
                        const data = item.toJSON();
                        const path = translatePositionToPath(
                            aiTable.fields() as AITableViewFields,
                            data['positions'][activeViewId],
                            activeViewId
                        ) as AIFieldPath;
                        actions.push({
                            type: ActionName.AddField,
                            path,
                            field: data as AITableField
                        });
                    });
                }
                if (isViewsTranslate) {
                    delta.insert?.map((item: Y.Map<any>, index) => {
                        const data = item.toJSON();
                        actions.push({
                            type: ViewActionName.AddView,
                            path: [offset + index],
                            view: data as AITableView
                        });
                    });
                }
            }
        }
    });
    return actions;
}

export function isAddOrRemove(targetPath: number[]): boolean {
    return targetPath.length === 0;
}

export function getRemoveIds(event: Y.YEvent<any>, type: ActionName.RemoveField | ActionName.RemoveRecord) {
    const ids: [string][] = [];
    if (!type) {
        return ids;
    }

    Y.iterateDeletedStructs(
        event.transaction,
        event.transaction.deleteSet,
        // @param {Item|GC} item
        (item) => {
            if (item instanceof Y.Item && item.deleted) {
                if (type === ActionName.RemoveField && item.parentSub === '_id') {
                    ids.push(item.content.getContent() as AIFieldIdPath);
                }
                if (type === ActionName.RemoveRecord) {
                    const content = item.content.getContent();
                    if (content[0] && content[0]['_id']) {
                        ids.push([content[0]['_id']]);
                    }
                }
            }
        }
    );
    return ids;
}