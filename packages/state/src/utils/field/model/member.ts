import { isEmpty } from '../../common';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { Field } from './field';
import { AITableField, AITableReferences, MemberFieldValue } from '@ai-table/grid';

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

    cellValueToString(cellValue: MemberFieldValue, field: AITableField, references: AITableReferences): string | null {
        let memberDisplayNames: string[] = [];
        if (cellValue?.length && references) {
            for (let index = 0; index < cellValue.length; index++) {
                const userInfo = references?.members[cellValue[index]];
                if (!userInfo) {
                    continue;
                }
                if (userInfo.display_name) {
                    memberDisplayNames.push(userInfo.display_name);
                }
            }
        }
        return memberDisplayNames && memberDisplayNames.length ? memberDisplayNames.join(', ') : null;
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
