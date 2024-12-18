import { isEmpty } from '../../common';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { Field } from './field';
import { RateFieldValue } from '@ai-table/grid';

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

    cellValueToString(_cellValue: RateFieldValue): string | null {
        return null;
    }

    static _compare(cellValue1: number, cellValue2: number): number {
        if (isEmpty(cellValue1) && isEmpty(cellValue2)) {
            return 0;
        }
        if (isEmpty(cellValue1)) {
            return -1;
        }
        if (isEmpty(cellValue2)) {
            return 1;
        }
        return cellValue1 === cellValue2 ? 0 : cellValue1 > cellValue2 ? 1 : -1;
    }

    override compare(cellValue1: number, cellValue2: number): number {
        return RateField._compare(cellValue1, cellValue2);
    }
}
