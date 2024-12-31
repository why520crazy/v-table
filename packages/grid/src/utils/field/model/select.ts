import { helpers } from 'ngx-tethys/util';
import { Field } from './field';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { AITableField, FieldValue, SelectFieldValue, SelectSettings } from '../../../core';
import { isEmpty } from '../../common';
import { compareString, hasIntersect } from '../operate';

export class SelectField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: SelectFieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.in:
                return Array.isArray(condition.value) && hasIntersect(cellValue, condition.value);
            case AITableFilterOperation.nin:
                return Array.isArray(condition.value) && !hasIntersect(cellValue, condition.value);
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }

    override compare(cellValue1: FieldValue, cellValue2: FieldValue, field: AITableField): number {
        const value1 = cellValueToSortValue(cellValue1, field);
        const value2 = cellValueToSortValue(cellValue2, field);
        return compareString(value1, value2);
    }

    override cellFullText(transformValue: string[], field: AITableField): string[] {
        let fullText: string[] = [];
        const optionsMap = helpers.keyBy((field.settings as SelectSettings).options || [], '_id');
        if (transformValue && Array.isArray(transformValue) && transformValue.length) {
            transformValue.forEach((optionId) => {
                const option = optionsMap[optionId];
                if (option && option.text) {
                    fullText.push(option.text);
                }
            });
        }
        return fullText;
    }
}

function cellValueToSortValue(cellValue: SelectFieldValue, field: AITableField): string | null {
    if (!cellValue) {
        return null;
    }
    const texts: string[] = [];
    const optionsMap = helpers.keyBy((field.settings as SelectSettings).options || [], '_id');
    if (cellValue && Array.isArray(cellValue) && cellValue.length) {
        cellValue.forEach((optionId) => {
            const option = optionsMap[optionId];
            if (option && option.text) {
                texts.push(option.text);
            }
        });
    }
    return texts && texts.length ? texts.join(',') : null;
}
