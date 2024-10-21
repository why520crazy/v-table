import { AITable } from '@ai-table/grid';
import * as Y from 'yjs';
import {
    ActionName,
    AddFieldAction,
    AddRecordAction,
    SetRecordPositionAction,
    AddViewAction,
    AITableViewRecord,
    SharedType,
    SyncArrayElement,
    SyncMapElement,
    AITableViewFields,
    UpdateSystemFieldValue
} from '../../types';
import {
    getPositionsByRecordSyncElement,
    getSharedRecordIndex,
    toRecordSyncElement,
    toSyncElement,
    setRecordPositions,
    getIdBySystemFieldValuesType,
    setRecordUpdatedInfo
} from '../utils';

export default function addNode(
    aiTable: AITable,
    sharedType: SharedType,
    action: AddFieldAction | AddRecordAction | AddViewAction | SetRecordPositionAction | UpdateSystemFieldValue
): SharedType {
    const records = sharedType.get('records')! as Y.Array<SyncArrayElement>;
    const views = sharedType.get('views')!;
    const fields = sharedType.get('fields')! as Y.Array<SyncMapElement>;
    switch (action.type) {
        case ActionName.AddRecord:
            records && records.push([toRecordSyncElement(action.record as AITableViewRecord, aiTable.fields() as AITableViewFields)]);
            break;
        case ActionName.AddView:
            views && views.push([toSyncElement(action.view)]);
            break;
        case ActionName.SetRecordPositions:
            if (records) {
                const recordIndex = getSharedRecordIndex(records, action.path[0]);
                const record = records.get(recordIndex);
                const positions = getPositionsByRecordSyncElement(record);
                const newPositions = { ...positions };
                for (const key in action.positions) {
                    if (action.positions[key] === null || action.positions[key] === undefined) {
                        delete newPositions[key];
                    } else {
                        newPositions[key] = action.positions[key];
                    }
                }
                setRecordPositions(record, newPositions);
            }
            break;
        case ActionName.UpdateSystemFieldValue:
            if (records) {
                const recordIndex = getSharedRecordIndex(records, action.path[0]);
                const record = records.get(recordIndex);
                if (action.updatedInfo.updated_at && action.updatedInfo.updated_at) {
                    setRecordUpdatedInfo(record, action.updatedInfo as { updated_at: number; updated_by: string });
                }
            }
            break;
        case ActionName.AddField:
            if (fields && records) {
                fields.push([toSyncElement(action.field)]);
                const path = action.path[0];
                for (let value of records) {
                    const customFieldValues = value.get(1);
                    const systemFieldValues = value.get(0);
                    const recordEntity = aiTable.recordsMap()[getIdBySystemFieldValuesType(systemFieldValues)];
                    const newFieldValue = recordEntity.values[action.field._id];
                    customFieldValues.insert(path, [newFieldValue]);
                }
            }
            break;
    }

    return sharedType;
}
