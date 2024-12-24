import { Injectable } from '@angular/core';
import { AITable, AITableField, AITableQueries } from '../core';
import { AITableReferences } from '../types';
import { transformCellValue } from '../utils';
import { ViewOperationMap } from '@ai-table/state';

@Injectable()
export class AITableGridMatchCellService {
    aiTable!: AITable;

    initialize(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    findMatchedCells(keywords: string, references: AITableReferences) {
        let matchedCells: string[] = [];
        this.aiTable.records().forEach((record) => {
            this.aiTable.fields().forEach((field) => {
                if (this.isCellMatchKeywords(this.aiTable, field, record._id, keywords, references)) {
                    matchedCells.push(`${record._id}-${field._id}`);
                }
            });
        });
        this.aiTable.matchedCells.set([...matchedCells]);
    }

    private isCellMatchKeywords(aiTable: AITable, field: AITableField, recordId: string, keywords: string, references: AITableReferences) {
        const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, field._id]);
        const transformValue = transformCellValue(aiTable, field, cellValue);
        let cellFullText: string[] = ViewOperationMap[field.type].cellFullText(transformValue, field, references);

        try {
            return keywords && cellFullText.length && cellFullText.some((item) => item.toLowerCase().includes(keywords.toLowerCase()));
        } catch (error) {
            return false;
        }
    }
}
