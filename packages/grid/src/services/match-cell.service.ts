import { Injectable } from '@angular/core';
import { AITable, AITableField, AITableFieldType, AITableQueries } from '../core';
import { AITableReferences, AITableSelectField } from '../types';
import { transformCellValue } from '../utils';

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
        const fieldType = field.type;

        let cellText: string[] = [];

        switch (fieldType) {
            case AITableFieldType.link:
                if (transformValue?.text) {
                    cellText.push(transformValue.text);
                }
                break;
            case AITableFieldType.select:
                if (transformValue && Array.isArray(transformValue) && transformValue.length) {
                    transformValue.forEach((optionId) => {
                        const item = (field as AITableSelectField).settings.options?.find((option) => option._id === optionId);
                        if (item?.text) {
                            cellText.push(item.text);
                        }
                    });
                }
                break;
            case AITableFieldType.progress:
                cellText.push(`${transformValue}%`);
                break;
            case AITableFieldType.number:
            case AITableFieldType.rate:
                cellText.push(String(transformValue));
                break;
            case AITableFieldType.member:
            case AITableFieldType.createdBy:
            case AITableFieldType.updatedBy:
                if (cellValue?.length && references) {
                    for (let index = 0; index < cellValue.length; index++) {
                        const userInfo = references?.members[cellValue[index]];
                        if (!userInfo) {
                            continue;
                        }
                        if (userInfo.display_name) {
                            cellText.push(userInfo.display_name);
                        }
                    }
                }
                break;
            default:
                if (transformValue) {
                    cellText.push(transformValue);
                }
        }
        try {
            return keywords && cellText.length && cellText.some((item) => item.toLowerCase().includes(keywords.toLowerCase()));
        } catch (error) {
            return false;
        }
    }
}