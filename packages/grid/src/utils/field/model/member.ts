import { AITableField, FieldValue, MemberFieldValue } from '../../../core';
import { AITableFilterCondition, AITableFilterOperation, AITableReferences } from '../../../types';
import { isEmpty } from '../../common';
import { compareString, hasIntersect } from '../operate';
import { Field } from './field';

export class MemberField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: MemberFieldValue) {
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

    override compare(
        cellValue1: FieldValue,
        cellValue2: FieldValue,
        field: AITableField,
        references: AITableReferences,
        sortKey: string
    ): number {
        const value1 = cellValueToSortValue(cellValue1, field, references, sortKey);
        const value2 = cellValueToSortValue(cellValue2, field, references, sortKey);
        return compareString(value1, value2);
    }

    override cellFullText(transformValue: string[], field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (transformValue?.length && references) {
            for (let index = 0; index < transformValue.length; index++) {
                const userInfo = references?.members[transformValue[index]];
                if (!userInfo) {
                    continue;
                }
                if (userInfo.display_name) {
                    fullText.push(userInfo.display_name);
                }
            }
        }
        return fullText;
    }
}

function cellValueToSortValue(
    cellValue: MemberFieldValue,
    field: AITableField,
    references: AITableReferences,
    sortKey = 'display_name'
): string | null {
    let values: string[] = [];
    if (cellValue?.length && references) {
        for (let index = 0; index < cellValue.length; index++) {
            const userInfo = references?.members[cellValue[index]];
            if (!userInfo) {
                continue;
            }

            const value = userInfo[sortKey];
            if (value) {
                values.push(value);
            }
        }
    }
    return values && values.length ? values.join(', ') : null;
}
