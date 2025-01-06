import { AIRecordFieldIdPath, AITableQueries, AITableRecord, AITableRecordUpdatedInfo, IdPath, NumberPath } from '@ai-table/grid';
import {
    UpdateFieldValueAction,
    ActionName,
    AddRecordAction,
    MoveRecordAction,
    RemoveRecordAction,
    AIViewTable,
    UpdateSystemFieldValue
} from '../types';

export function updateFieldValue(aiTable: AIViewTable, value: any, path: AIRecordFieldIdPath) {
    const oldValue = AITableQueries.getFieldValue(aiTable, path);
    const operation: UpdateFieldValueAction = {
        type: ActionName.UpdateFieldValue,
        fieldValue: oldValue,
        newFieldValue: value,
        path
    };
    aiTable.apply(operation);
}

export function updateSystemFieldValue(aiTable: AIViewTable, path: IdPath, updatedInfo: AITableRecordUpdatedInfo) {
    const operation: UpdateSystemFieldValue = {
        type: ActionName.UpdateSystemFieldValue,
        updatedInfo,
        path
    };
    aiTable.apply(operation);
}

export function addRecord(aiTable: AIViewTable, record: AITableRecord, path: NumberPath) {
    const operation: AddRecordAction = {
        type: ActionName.AddRecord,
        record,
        path
    };
    aiTable.apply(operation);
}

export function moveRecord(aiTable: AIViewTable, path: NumberPath, newPath: NumberPath) {
    const operation: MoveRecordAction = {
        type: ActionName.MoveRecord,
        path,
        newPath
    };
    aiTable.apply(operation);
}

export function removeRecord(aiTable: AIViewTable, path: IdPath) {
    const operation: RemoveRecordAction = {
        type: ActionName.RemoveRecord,
        path
    };
    aiTable.apply(operation);
}

export const RecordActions = {
    addRecord,
    updateFieldValue,
    moveRecord,
    removeRecord,
    updateSystemFieldValue
};
