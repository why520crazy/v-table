import { FieldValue, LinkFieldValue } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { isEmpty } from '../../common';
import { compareString, stringInclude } from '../operate';
import { Field } from './field';

export class LinkField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: FieldValue) {
        const cellTextValue = cellValue?.text;
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellTextValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellTextValue);
            case AITableFilterOperation.contain:
                return !isEmpty(cellTextValue) && stringInclude(cellTextValue, condition.value);
            default:
                return super.isMeetFilter(condition, cellTextValue);
        }
    }

    override compare(cellValue1: FieldValue, cellValue2: FieldValue): number {
        return compareString(cellValueToSortValue(cellValue1), cellValueToSortValue(cellValue2));
    }

    override cellFullText(transformValue: LinkFieldValue): string[] {
        let texts: string[] = [];
        if (!isEmpty(transformValue?.text)) {
            texts.push(transformValue.text);
        }
        return texts;
    }
}

function cellValueToSortValue(cellValue: LinkFieldValue): string | null {
    return (cellValue && cellValue.text && cellValue.text.trim()) || null;
}
