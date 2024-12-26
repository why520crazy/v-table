import { Signal, WritableSignal } from '@angular/core';
import { Colors } from '../../constants/colors';
import { AITableReferences, AITableSelection } from '../../types';
import { RendererContext } from '../context';
import { AITableField, AITableFields, AITableRecord, AITableRecords } from './core';

export interface AITable {
    records: WritableSignal<AITableRecords>;
    fields: WritableSignal<AITableFields>;
    context?: RendererContext;
    selection: WritableSignal<AITableSelection>;
    matchedCells: WritableSignal<string[]>; // [`${recordId}-${fieldId}`]
    recordsMap: Signal<{ [key: string]: AITableRecord }>;
    fieldsMap: Signal<{ [key: string]: AITableField }>;
    recordsWillHidden: WritableSignal<string[]>;
    recordsWillMove: WritableSignal<string[]>;
    references: WritableSignal<AITableReferences>;
}

export type AIPlugin = (aiTable: AITable) => AITable;

export const AITable = {
    getColors() {
        return Colors;
    },
    getVisibleFields(aiTable: AITable) {
        return aiTable.fields().filter((field) => !field.hidden);
    },
    getVisibleRows(aiTable: AITable) {
        return aiTable.records();
    },
    getActiveCell(aiTable: AITable): { recordId: string; fieldId: string } | null {
        const selection = aiTable.selection();
        let selectedCells = [];
        for (let [recordId, fieldIds] of selection.selectedCells.entries()) {
            for (let fieldId of Object.keys(fieldIds)) {
                if ((fieldIds as { [key: string]: boolean })[fieldId]) {
                    selectedCells.push({
                        recordId,
                        fieldId
                    });
                }
            }
        }
        return selectedCells ? selectedCells[0] : null;
    },
    isCellVisible(aiTable: AITable, cell: { recordId: string; fieldId: string }) {
        const visibleRowIndexMap = aiTable.context!.visibleRowsIndexMap();
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsMap();
        return visibleRowIndexMap!.has(cell.recordId) && visibleColumnIndexMap.has(cell.fieldId);
    },
    getCellIndex(aiTable: AITable, cell: { recordId: string; fieldId: string }): { rowIndex: number; columnIndex: number } | null {
        const visibleRowIndexMap = aiTable.context!.visibleRowsIndexMap();
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsMap();
        if (AITable.isCellVisible(aiTable, cell)) {
            return {
                rowIndex: visibleRowIndexMap!.get(cell.recordId)!,
                columnIndex: visibleColumnIndexMap.get(cell.fieldId)!
            };
        }
        return null;
    }
};
