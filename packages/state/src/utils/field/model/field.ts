import { AITableField, AITableReferences, FieldValue } from '@ai-table/grid';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { isEmpty } from '../../common';
import { isEqual } from 'lodash';

export const zhIntlCollator = typeof Intl !== 'undefined' ? new Intl.Collator('zh-CN') : undefined;

export abstract class Field {
    protected stringInclude(str: string, searchStr: string) {
        return str.toLowerCase().includes(searchStr.trim().toLowerCase());
    }

    abstract cellValueToString(cellValue: FieldValue, field: AITableField, references?: AITableReferences): string | null;

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

    eq(cv1: FieldValue, cv2: FieldValue): boolean {
        return isEqual(cv1, cv2);
    }

    compare(cellValue1: FieldValue, cellValue2: FieldValue, field: AITableField, references?: AITableReferences): number {
        if (this.eq(cellValue1, cellValue2)) {
            return 0;
        }
        if (cellValue1 == null) {
            return -1;
        }
        if (cellValue2 == null) {
            return 1;
        }

        let str1 = this.cellValueToString(cellValue1, field, references);
        let str2 = this.cellValueToString(cellValue2, field, references);

        if (str1 === str2) {
            return 0;
        }
        if (str1 == null) {
            return -1;
        }
        if (str2 == null) {
            return 1;
        }

        str1 = str1.trim();
        str2 = str2.trim();

        // test pinyin sort
        return str1 === str2 ? 0 : zhIntlCollator ? zhIntlCollator.compare(str1, str2) : str1.localeCompare(str2, 'zh-CN') > 0 ? 1 : -1;
    }
}
