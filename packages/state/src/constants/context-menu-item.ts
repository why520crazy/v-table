import { AITable, AITableContextMenuItem, AITableGridSelectionService, getDetailByTargetName } from '@ai-table/grid';
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
        let selectedRecordIds = [...aiTable.selection().selectedRecords.keys()];
        if (!selectedRecordIds.length) {
            const recordId = getDetailByTargetName(targetName).recordId as string;
            selectedRecordIds = [recordId];
        }

        selectedRecordIds.forEach((id: string) => {
            Actions.removeRecord(aiTable as AIViewTable, [id]);
        });

        aiTableGridSelectionService.clearSelection();
    }
};
