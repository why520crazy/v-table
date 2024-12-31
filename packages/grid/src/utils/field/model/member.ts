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

    override compare(cellValue1: FieldValue, cellValue2: FieldValue, field: AITableField, references: AITableReferences): number {
        const value1 = cellValueToSortValue(cellValue1, field, references);
        const value2 = cellValueToSortValue(cellValue2, field, references);
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

function cellValueToSortValue(cellValue: MemberFieldValue, field: AITableField, references: AITableReferences): string | null {
    let names: string[] = [];
    if (cellValue?.length && references) {
        for (let index = 0; index < cellValue.length; index++) {
            const userInfo = references?.members[cellValue[index]];
            if (!userInfo) {
                continue;
            }
            if (userInfo.display_name_pinyin) {
                names.push(userInfo.display_name_pinyin);
            }
        }
    }
    return names && names.length ? names.join(', ') : null;
}
