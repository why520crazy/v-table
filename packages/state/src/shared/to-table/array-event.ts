import { isArray } from 'ngx-tethys/util';
import * as Y from 'yjs';
import {
    ActionName,
    AITableAction,
    AITableView,
    AITableViewFields,
    AITableViewRecords,
    AIViewTable,
    Positions,
    SharedType,
    SyncArrayElement,
    SyncMapElement
} from '../../types';
import { getIdBySystemFieldValues, getShareTypeNumberPath, getTrackableEntityBySystemFieldValues, translatePositionToPath } from '../utils';
import {
    getPositionsBySystemFieldValues,
    getSharedMapValueId,
    getSharedRecord,
    getSharedRecordId,
    getValuesByCustomFieldValues,
    POSITIONS_INDEX,
    UPDATED_BY_INDEX
} from '../utils/translate';
import { AIFieldValueIdPath, AITableField, AITableQueries, IdPath, NumberPath } from '@ai-table/grid';

export default function translateArrayEvent(aiTable: AIViewTable, sharedType: SharedType, event: Y.YEvent<any>): AITableAction[] {
    let offset = 0;
    let targetPath = getShareTypeNumberPath(event.path);
    const isRecordsTranslate = event.path.includes('records');
    const isFieldsTranslate = event.path.includes('fields');
    const isViewsTranslate = event.path.includes('views');
    const actions: AITableAction[] = [];
    const activeViewId = aiTable.activeViewId();

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
                            type: ActionName.RemoveView,
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
                            const [systemFieldValues, customFieldValues] = data;
                            const positions = getPositionsBySystemFieldValues(customFieldValues);
                            const position = positions[activeViewId];
                            const path = translatePositionToPath(
                                aiTable.records() as AITableViewRecords,
                                position,
                                activeViewId
                            ) as NumberPath;

                            actions.push({
                                type: ActionName.AddRecord,
                                path: path,
                                record: {
                                    _id: getIdBySystemFieldValues(systemFieldValues),
                                    ...getTrackableEntityBySystemFieldValues(systemFieldValues),
                                    positions: getPositionsBySystemFieldValues(customFieldValues),
                                    values: getValuesByCustomFieldValues(customFieldValues, aiTable.fields() as AITableViewFields)
                                }
                            });
                        });
                    } else {
                        try {
                            const sharedRecords = sharedType.get('records')! as Y.Array<SyncArrayElement>;
                            const sharedFields = sharedType.get('fields')! as Y.Array<SyncMapElement>;
                            let systemFieldOffset = 0;
                            delta.insert?.map((item: any) => {
                                const recordIndex = targetPath[0] as number;
                                const fieldIndex = offset;
                                const record = (aiTable.records() as AITableViewRecords)[recordIndex];
                                if (isSystemFieldOperation(targetPath)) {
                                    if (isPositionsOperation(fieldIndex)) {
                                        const newPositions: Positions = {};
                                        for (const key in item) {
                                            newPositions[key] = item[key];
                                        }
                                        actions.push({
                                            type: ActionName.SetRecordPositions,
                                            path: [record._id],
                                            positions: newPositions
                                        });
                                    // 此处的循环会包含 updated_at 和 updated_by 各一次，这里只处理 updated_by 同时包含两个字段的修改
                                    } else if (isUpdatedByOperation(fieldIndex + systemFieldOffset)) {
                                        const systemFieldValues = getSharedRecord(sharedRecords, recordIndex).get(0).toJSON();
                                        const { updated_at, updated_by } = getTrackableEntityBySystemFieldValues(systemFieldValues);
                                        actions.push({
                                            type: ActionName.UpdateSystemFieldValue,
                                            path: [record._id],
                                            updatedInfo: { updated_at, updated_by }
                                        });
                                    }
                                    systemFieldOffset++;
                                } else {
                                    const recordId = getSharedRecordId(sharedRecords, recordIndex);
                                    const fieldId = getSharedMapValueId(sharedFields, fieldIndex);
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
                        ) as NumberPath;
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
                            type: ActionName.AddView,
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

export function isSystemFieldOperation(targetPath: number[]): boolean {
    if (targetPath.length === 2 && targetPath[1] === 0) {
        return true;
    }
    return false;
}

export function isCustomFieldOperation(targetPath: number[]): boolean {
    if (targetPath.length === 2 && targetPath[1] === 1) {
        return true;
    }
    return false;
}

export function isPositionsOperation(fieldIndex: number): boolean {
    return fieldIndex === POSITIONS_INDEX;
}

export function isUpdatedByOperation(fieldIndex: number): boolean {
    return fieldIndex === UPDATED_BY_INDEX;
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
                    ids.push(item.content.getContent() as IdPath);
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
