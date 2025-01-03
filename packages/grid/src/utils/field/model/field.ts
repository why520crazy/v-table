import { AITableFilterCondition, AITableFilterOperation, AITableReferences } from '../../../types';
import { AITableField, FieldValue } from '../../../core';
import { isEmpty } from '../../common';

export abstract class Field {
    // 排序
    abstract compare(cellValue1: FieldValue, cellValue2: FieldValue, field: AITableField, references?: AITableReferences): number;

    // 筛选
    isMeetFilter(condition: AITableFilterCondition, cellValue: FieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
            case AITableFilterOperation.exists: {
                return this.isEmptyOrNot(condition.operation, cellValue);
            }
            default: {
                return true;
            }
        }
    }

    // 查找
    cellFullText(transformValue: any, field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue)) {
            fullText.push(String(transformValue));
        }
        return fullText;
    }

    isEmptyOrNot(operation: AITableFilterOperation.empty | AITableFilterOperation.exists, cellValue: FieldValue) {
        switch (operation) {
            case AITableFilterOperation.empty: {
                return isEmpty(cellValue);
            }
            case AITableFilterOperation.exists: {
                return !isEmpty(cellValue);
            }
            default: {
                throw new Error('compare operator type error');
            }
        }
    }
}
