import { Injectable } from '@angular/core';
import { AITable } from '../core';

@Injectable()
export class AITableGridSelectionService {
    aiTable!: AITable;

    constructor() {}

    initialize(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    clearSelection() {
        this.aiTable.selection.set({
            selectedRecords: new Map(),
            selectedFields: new Map(),
            selectedCells: new Set(),
            activeCell: null
        });
    }

    setActiveCell(recordId: string, fieldId: string) {
        this.aiTable.selection().activeCell = { recordId, fieldId };
    }

    selectField(fieldId: string) {
        if (this.aiTable.selection().selectedFields.has(fieldId)) {
            return;
        }
        this.clearSelection();
        this.aiTable.selection().selectedFields.set(fieldId, true);
    }

    selectRecord(recordId: string) {
        if (this.aiTable.selection().selectedRecords.has(recordId)) {
            this.aiTable.selection().selectedRecords.delete(recordId);
        } else {
            this.aiTable.selection().selectedRecords.set(recordId, true);
        }
        this.aiTable.selection.set({
            selectedRecords: this.aiTable.selection().selectedRecords,
            selectedFields: new Map(),
            selectedCells: new Set(),
            activeCell: null
        });
    }

    toggleSelectAll(checked: boolean) {
        this.clearSelection();
        if (checked) {
            this.aiTable.records().forEach((item) => {
                this.selectRecord(item._id);
            });
        }
    }

    updateSelect(event: MouseEvent) {
        const target = event?.target as HTMLElement;
        if (!target) {
            return;
        }
        const cellDom = target.closest('.grid-cell');
        const colDom = target.closest('.grid-field');
        const checkbox = target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox' && target.closest('.grid-checkbox');
        const fieldAction = target.closest('.grid-field-action');
        if (cellDom) {
            const fieldId = cellDom.getAttribute('fieldId');
            const recordId = cellDom.getAttribute('recordId');
            fieldId && recordId && this.selectCells(recordId, fieldId);
        }
        if (colDom && !fieldAction) {
            const fieldId = colDom.getAttribute('fieldId');
            fieldId && this.selectField(fieldId);
        }
        if (!cellDom && !colDom && !checkbox) {
            this.clearSelection();
        }
    }

    selectCells(startRecordId: string, startFieldId: string, endRecordId?: string, endFieldId?: string) {
        if (
            !this.aiTable.context!.visibleRowsIndexMap().has(startRecordId) ||
            !this.aiTable.context!.visibleColumnsMap().has(startFieldId)
        ) {
            return;
        }

        const selectedCells = new Set<string>();
        if (!endRecordId || !endFieldId) {
            selectedCells.add(`${startRecordId}:${startFieldId}`);
        } else {
            const startRowIndex = this.aiTable.context!.visibleRowsIndexMap().get(startRecordId)!;
            const endRowIndex = this.aiTable.context!.visibleRowsIndexMap().get(endRecordId)!;
            const startColIndex = this.aiTable.context!.visibleColumnsMap().get(startFieldId)!;
            const endColIndex = this.aiTable.context!.visibleColumnsMap().get(endFieldId)!;

            const minRowIndex = Math.min(startRowIndex, endRowIndex);
            const maxRowIndex = Math.max(startRowIndex, endRowIndex);
            const minColIndex = Math.min(startColIndex, endColIndex);
            const maxColIndex = Math.max(startColIndex, endColIndex);

            const rows = this.aiTable.context!.linearRows();
            const fields = AITable.getVisibleFields(this.aiTable);

            for (let i = minRowIndex; i <= maxRowIndex; i++) {
                for (let j = minColIndex; j <= maxColIndex; j++) {
                    selectedCells.add(`${rows[i]._id}:${fields[j]._id}`);
                }
            }
        }

        this.clearSelection();
        this.setActiveCell(startRecordId, startFieldId);
        this.aiTable.selection().selectedCells = selectedCells;
    }
}
