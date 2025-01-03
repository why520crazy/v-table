import { RateFieldValue } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { isEmpty } from '../../common';
import { compareNumber } from '../operate';
import { Field } from './field';

export class RateField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string[]>, cellValue: RateFieldValue | string) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.in:
                const isContain = condition.value.some((item) => String(item) === String(cellValue));
                return !isEmpty(cellValue) && isContain;
            case AITableFilterOperation.nin:
                const noContain = condition.value.every((item) => String(item) !== String(cellValue));
                return isEmpty(cellValue) || noContain;
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }

    override compare(cellValue1: number, cellValue2: number): number {
        return compareNumber(cellValue1, cellValue2);
    }
}
