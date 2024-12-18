import { isEmpty } from '../../common';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { Field } from './field';
import { AITableField, FieldValue, LinkFieldValue } from '@ai-table/grid';
import { isObject, isString } from 'ngx-tethys/util';

export class LinkField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: FieldValue) {
        const cellTextValue = this.cellValueToString(cellValue);
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellTextValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellTextValue);
            case AITableFilterOperation.contain:
                return !isEmpty(cellTextValue) && this.stringInclude(cellTextValue, condition.value);
            default:
                return super.isMeetFilter(condition, cellTextValue);
        }
    }

    override eq(cv1: LinkFieldValue | string | null, cv2: LinkFieldValue | string | null): boolean {
        return this.cellValueToString(cv1) === this.cellValueToString(cv2);
    }

    override compare(cellValue1: FieldValue, cellValue2: FieldValue, field: AITableField): number {
        const cellTextValue1 = this.cellValueToString(cellValue1);
        const cellTextValue2 = this.cellValueToString(cellValue2);

        return super.compare(cellTextValue1, cellTextValue2, field);
    }

    cellValueToString(cellValue: LinkFieldValue | string | null): string {
        if (isString(cellValue)) {
            return cellValue;
        }
        if (isObject(cellValue)) {
            return cellValue.text;
        }
        return '';
    }
}
