import { isEmpty } from '../../common';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { Field } from './field';
import { AITableField, AITableSelectField, AITableSelectOption, SelectFieldValue, SelectSettings } from '@ai-table/grid';
import { Id } from 'ngx-tethys/types';

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

    cellValueToString(cellValue: SelectFieldValue, field: AITableField): string | null {
        return this.arrayValueToString(this.cellValueToArray(cellValue, field));
    }

    cellValueToArray(cellValue: SelectFieldValue, field: AITableField): string[] | null {
        if (!cellValue) {
            return null;
        }
        const result: string[] = [];
        for (let i = 0, l = cellValue.length; i < l; i++) {
            const option = this.findOptionById(field, cellValue[i]);
            if (option) {
                result.push(option.text);
            }
        }
        return result;
    }

    findOptionById(field: AITableField, id: Id): AITableSelectOption | null {
        return (field.settings as SelectSettings).options.find((option) => option._id === id) || null;
    }

    arrayValueToString(cellValues: string[] | null): string | null {
        return cellValues && cellValues.length ? cellValues.join(', ') : null;
    }

    override cellFullText(transformValue: string[], field: AITableField): string[] {
        let cellText: string[] = [];
        if (transformValue && Array.isArray(transformValue) && transformValue.length) {
            transformValue.forEach((optionId) => {
                const item = (field as AITableSelectField).settings?.options?.find((option) => option._id === optionId);
                if (item?.text) {
                    cellText.push(item.text);
                }
            });
        }
        return cellText;
    }
}

function hasIntersect<T extends number | string>(array1: T[], array2: T[]) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false;
    }
    const set1 = new Set(array1);
    const set2 = new Set(array2);
    for (const ele of set1) {
        if (set2.has(ele)) {
            return true;
        }
    }
    return false;
}
