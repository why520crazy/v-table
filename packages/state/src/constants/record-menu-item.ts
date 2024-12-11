import { AITable, AITableRecordMenuItem } from '@ai-table/grid';
import { Actions, AIViewTable } from '@ai-table/state';

export const RemoveRecordsItem: AITableRecordMenuItem = {
    type: 'removeRecords',
    name: '删除行',
    icon: 'trash',
    exec: (aiTable: AITable, selectedRecordIds: string[]) => {
        selectedRecordIds.forEach((id) => {
            Actions.removeRecord(aiTable as AIViewTable, [id]);
        });
    }
};
