import { AITableRecordUpdatedInfo } from '@ai-table/grid';
import { AIViewTable } from '../../types';
import { Actions } from '../../action';

export function updateRecordsUpdatedInfo(aiTable: AIViewTable, updatedInfo: AITableRecordUpdatedInfo) {
    const records = aiTable.records();
    records.forEach((item) => {
        Actions.updateSystemFieldValue(aiTable, [item._id], updatedInfo);
    });
}
