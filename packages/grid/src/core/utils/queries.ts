import { isUndefinedOrNull } from 'ngx-tethys/util';
import {
    AITable,
    AITableField,
    AITableRecord,
    AIRecordFieldIdPath,
    IdPath,
    NumberPath,
    AITableFieldType,
    SystemFieldTypes,
    DateFieldValue,
    MemberFieldValue
} from '../types';
import { isSystemField } from './field';

export const AITableQueries = {
    findRecordPath(aiTable: AITable, record: AITableRecord) {
        const recordIndex = record && aiTable.records().indexOf(record);
        if (!isUndefinedOrNull(recordIndex) && recordIndex > -1) {
            return [recordIndex] as NumberPath;
        }
        throw new Error(`can not find the record path: ${JSON.stringify({ ...(record || {}) })}`);
    },
    findFieldPath(aiTable: AITable, field: AITableField) {
        const fieldIndex = field && aiTable.fields().indexOf(field);
        if (!isUndefinedOrNull(fieldIndex) && fieldIndex > -1) {
            return [fieldIndex] as NumberPath;
        }
        throw new Error(`can not find the field path: ${JSON.stringify({ ...(field || {}) })}`);
    },
    getFieldValue(aiTable: AITable, path: AIRecordFieldIdPath): any {
        if (!aiTable) {
            throw new Error(`aiTable does not exist`);
        }
        if (!aiTable.records()) {
            throw new Error(`aiTable has no records`);
        }
        if (!aiTable.fields()) {
            throw new Error(`aiTable has no fields`);
        }
        if (!path) {
            throw new Error(`path does not exist as path [${path}]`);
        }
        const record = aiTable.recordsMap()[path[0]];
        if (!record) {
            throw new Error(`can not find record at path [${path}]`);
        }
        const field = aiTable.fieldsMap()[path[1]];
        if (!field) {
            throw new Error(`can not find field at path [${path}]`);
        }
        if (isSystemField(field)) {
            return AITableQueries.getSystemFieldValue(record, field.type as SystemFieldTypes);
        }
        return record.values[path[1]];
    },
    getSystemFieldValue(record: AITableRecord, type: SystemFieldTypes) {
        const value = record[type];
        if (type === AITableFieldType.createdAt || type === AITableFieldType.updatedAt) {
            return { timestamp: value } as DateFieldValue;
        }
        if (type === AITableFieldType.createdBy || type === AITableFieldType.updatedBy) {
            return [value] as MemberFieldValue;
        }
        throw new Error(`unexpected ${type}`);
    },
    getField(aiTable: AITable, path: IdPath): AITableField | undefined {
        if (!aiTable) {
            throw new Error(`aiTable does not exist`);
        }
        if (!path) {
            throw new Error(`path does not exist as path [${path}]`);
        }
        return aiTable.fields().find((item) => item._id === path[0]);
    },

    getRecord(aiTable: AITable, path: NumberPath): AITableRecord {
        if (!aiTable) {
            throw new Error(`aiTable does not exist`);
        }
        if (!path) {
            throw new Error(`path does not exist as path [${path}]`);
        }
        return aiTable.records()[path[0]];
    }
};
