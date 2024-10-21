import { AITable, getDefaultFieldValue } from '@ai-table/grid';
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
    AITableViewFields
} from '../../types';
import { getPositionsByRecordSyncElement, getSharedRecordIndex, toRecordSyncElement, toSyncElement, setRecordPositions } from '../utils';

export default function addNode(
    aiTable: AITable,
    sharedType: SharedType,
    action: AddFieldAction | AddRecordAction | AddViewAction | SetRecordPositionAction
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
        case ActionName.AddField:
            if (fields && records) {
                fields.push([toSyncElement(action.field)]);
                const path = action.path[0];
                for (let value of records) {
                    const newRecord = getDefaultFieldValue(action.field);
                    const customField = value.get(1);
                    customField.insert(path, [newRecord]);
                }
            }
            break;
    }

    return sharedType;
}
