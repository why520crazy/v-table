import { FieldValue } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { isEmpty } from '../../common';
import { compareString, stringInclude } from '../operate';
import { Field } from './field';

export class TextField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: FieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.contain:
                return !isEmpty(cellValue) && stringInclude(cellValue, condition.value);
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }

    override compare(cellValue1: FieldValue, cellValue2: FieldValue): number {
        const value1 = cellValueToSortValue(cellValue1);
        const value2 = cellValueToSortValue(cellValue2);
        return compareString(value1, value2);
    }
}

function cellValueToSortValue(cellValue: FieldValue): string | null {
    return (cellValue && cellValue.trim()) || null;
}
