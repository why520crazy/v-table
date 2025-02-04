import { Signal, WritableSignal } from '@angular/core';
import { Colors } from '../../constants/colors';
import { AITableSelection } from '../../types';
import { RendererContext } from '../context';
import { AIRecordFieldIdPath, AITableField, AITableFields, AITableRecord, AITableRecords } from './core';

export interface AITable {
    records: WritableSignal<AITableRecords>;
    fields: WritableSignal<AITableFields>;
    context?: RendererContext;
    selection: WritableSignal<AITableSelection>;
    keywordsMatchedCells: WritableSignal<Set<string>>; // [`${recordId}:${fieldId}`]
    recordsMap: Signal<{ [key: string]: AITableRecord }>;
    fieldsMap: Signal<{ [key: string]: AITableField }>;
    recordsWillHidden: WritableSignal<string[]>;
    recordsWillMove: WritableSignal<string[]>;
}

export type AIPlugin = (aiTable: AITable) => AITable;

export const AITable = {
    getColors() {
        return Colors;
    },
    getVisibleFields(aiTable: AITable): AITableFields {
        return aiTable.fields().filter((field) => !field.hidden);
    },
    getVisibleRows(aiTable: AITable): AITableRecords {
        return aiTable.records();
    },
    getActiveCell(aiTable: AITable): AIRecordFieldIdPath | null {
        return aiTable.selection().activeCell;
    },
    getActiveRecordIds(aiTable: AITable): string[] {
        const selectedRecords = aiTable.selection().selectedRecords;
        const selectedCells = aiTable.selection().selectedCells;
        let selectedRecordIds: string[] = [];
        if (selectedRecords.size > 0) {
            selectedRecordIds = [...selectedRecords.keys()];
        } else if (selectedCells.size > 0) {
            selectedRecordIds = [...selectedCells].map((item) => item.split(':')[0]);
        } else {
            selectedRecordIds = [];
        }
        return selectedRecordIds;
    },
    isCellVisible(aiTable: AITable, cell: AIRecordFieldIdPath): boolean {
        const visibleRowIndexMap = aiTable.context!.visibleRowsIndexMap();
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();
        const [recordId, fieldId] = cell || [];
        const isVisible = visibleRowIndexMap!.has(recordId) && visibleColumnIndexMap.has(fieldId);
        return isVisible;
    },
    getCellIndex(aiTable: AITable, cell: AIRecordFieldIdPath): { rowIndex: number; columnIndex: number } | null {
        const visibleRowIndexMap = aiTable.context!.visibleRowsIndexMap();
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();
        if (AITable.isCellVisible(aiTable, cell)) {
            const [recordId, fieldId] = cell;
            return {
                rowIndex: visibleRowIndexMap!.get(recordId)!,
                columnIndex: visibleColumnIndexMap.get(fieldId)!
            };
        }
        return null;
    },
    isFrozenColumn(aiTable: AITable, columnIndex: number) {
        const frozenColumnCount = aiTable.context!.frozenColumnCount();
        if (columnIndex <= frozenColumnCount - 1) {
            return true;
        }
        return false;
    }
};
