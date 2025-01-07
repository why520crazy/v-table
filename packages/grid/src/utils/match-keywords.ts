import { AITable, AITableField, AITableQueries } from '../core';
import { AITableReferences } from '../types';
import { transformCellValue } from './cell';
import { ViewOperationMap } from './field/model';

export const isCellMatchKeywords = (
    aiTable: AITable,
    field: AITableField,
    recordId: string,
    keywords: string,
    references: AITableReferences
) => {
    const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, field._id]);
    const transformValue = transformCellValue(aiTable, field, cellValue);
    const fieldMethod = ViewOperationMap[field.type];
    let cellFullText: string[] = fieldMethod.cellFullText(transformValue, field, references);

    try {
        return keywords && cellFullText.length && cellFullText.some((item) => item.toLowerCase().includes(keywords.toLowerCase()));
    } catch (error) {
        return false;
    }
};
