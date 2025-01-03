import { AITable, AITableContextMenuItem, AITableGridSelectionService } from '@ai-table/grid';
import { Actions } from '../action';
import { AIViewTable } from '../types';

export const RemoveRecordsItem: AITableContextMenuItem = {
    type: 'removeRecords',
    name: '删除行',
    icon: 'trash',
    exec: (
        aiTable: AITable,
        targetName: string,
        position: { x: number; y: number },
        aiTableGridSelectionService: AITableGridSelectionService
    ) => {
        let selectedRecordIds = AITable.getSelectedRecordIds(aiTable);

        selectedRecordIds.forEach((id: string) => {
            Actions.removeRecord(aiTable as AIViewTable, [id]);
        });

        aiTableGridSelectionService.clearSelection();
    }
};
