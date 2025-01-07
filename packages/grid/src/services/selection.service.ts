import { Injectable } from '@angular/core';
import { AIRecordFieldIdPath, AITable } from '../core';

@Injectable()
export class AITableGridSelectionService {
    aiTable!: AITable;

    constructor() {}

    initialize(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    clearSelection() {
        this.aiTable.selection.set({
            selectedRecords: new Set(),
            selectedFields: new Set(),
            selectedCells: new Set(),
            activeCell: null
        });
    }

    setActiveCell(activeCell: AIRecordFieldIdPath) {
        this.aiTable.selection().activeCell = activeCell;
    }

    selectField(fieldId: string) {
        if (this.aiTable.selection().selectedFields.has(fieldId)) {
            return;
        }
        this.clearSelection();
        this.aiTable.selection().selectedFields.add(fieldId);
    }

    selectRecord(recordId: string) {
        if (this.aiTable.selection().selectedRecords.has(recordId)) {
            this.aiTable.selection().selectedRecords.delete(recordId);
        } else {
            this.aiTable.selection().selectedRecords.add(recordId);
        }
        this.aiTable.selection.set({
            selectedRecords: this.aiTable.selection().selectedRecords,
            selectedFields: new Set(),
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
            fieldId && recordId && this.selectCells([recordId, fieldId]);
        }
        if (colDom && !fieldAction) {
            const fieldId = colDom.getAttribute('fieldId');
            fieldId && this.selectField(fieldId);
        }
        if (!cellDom && !colDom && !checkbox) {
            this.clearSelection();
        }
    }

    selectCells(startCell: AIRecordFieldIdPath, endCell?: AIRecordFieldIdPath) {
        const [startRecordId, startFieldId] = startCell;
        const records = this.aiTable.records();
        const fields = this.aiTable.fields();
        const selectedCells = new Set<string>();

        if (!endCell) {
            selectedCells.add(`${startRecordId}:${startFieldId}`);
        } else {
            const [endRecordId, endFieldId] = endCell;
            const minRowIndex = records.findIndex((record) => record._id === startRecordId);
            const maxRowIndex = records.findIndex((record) => record._id === endRecordId);
            const minColIndex = fields.findIndex((field) => field._id === startFieldId);
            const maxColIndex = fields.findIndex((field) => field._id === endFieldId);

            for (let i = minRowIndex; i <= maxRowIndex; i++) {
                for (let j = minColIndex; j <= maxColIndex; j++) {
                    selectedCells.add(`${records[i]._id}:${fields[j]._id}`);
                }
            }
        }

        this.clearSelection();
        this.setActiveCell(startCell);
        this.aiTable.selection().selectedCells = selectedCells;
    }
}
