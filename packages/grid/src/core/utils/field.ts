import { FieldOptions } from '../constants/field';
import { AITable, AITableField, AITableFieldOption, AITableFieldType, IsMultiple } from '../types';
import { idCreator } from './id-creator';

export const isArrayField = (field: AITableField) => {
    return (
        [AITableFieldType.member, AITableFieldType.createdBy, AITableFieldType.updatedBy].includes(field.type) ||
        AITableFieldType.select === field.type
    );
};

export const isSystemField = (field: AITableField) => {
    return [AITableFieldType.createdAt, AITableFieldType.createdBy, AITableFieldType.updatedAt, AITableFieldType.updatedBy].includes(
        field.type
    );
};

export const isNumberFiled = (field: AITableField) => {
    return [AITableFieldType.number, AITableFieldType.progress, AITableFieldType.rate].includes(field.type);
};

export function getDefaultFieldValue(field: AITableField) {
    if (isArrayField(field)) {
        return [];
    }
    if (isNumberFiled(field)) {
        return 0;
    }
    return '';
}

export function createDefaultFieldName(aiTable: AITable, field: AITableFieldOption) {
    const fieldOption = getFieldOptionByField(field);
    if (fieldOption) {
        const count = aiTable.fields().filter((item) => {
            return isSameFieldOption(field, item);
        }).length;
        return count === 0 ? fieldOption.name : fieldOption.name + ' ' + count;
    }
    return FieldOptions[0].name;
}

export function getFieldOptionByField(field: Partial<AITableField>) {
    return FieldOptions.find((item) => isSameFieldOption(item, field));
}

export function isSameFieldOption(fieldOption: AITableFieldOption, field: Partial<AITableField>): boolean {
    return (
        fieldOption.type === field.type &&
        (fieldOption.type === AITableFieldType.select || fieldOption.type === AITableFieldType.member
            ? !!(fieldOption.settings as IsMultiple)?.is_multiple === !!(field.settings as IsMultiple)?.is_multiple
            : true)
    );
}

export function createDefaultField(aiTable: AITable, type: AITableFieldType = AITableFieldType.text) {
    const fieldOption = FieldOptions.find((item) => item.type === type)!;
    return { _id: idCreator(), type, name: createDefaultFieldName(aiTable, fieldOption) };
}
