import { AITableFieldType, AITableRecord, FieldValue, isSystemField, SystemFieldTypes } from '@ai-table/grid';
import {
    AITableFilterCondition,
    AITableFilterConditions,
    AITableFilterLogical,
    AITableView,
    AITableViewField,
    AITableViewFields,
    AITableViewRecords,
    AIViewTable
} from '../../types';
import { ViewOperationMap } from '../field/model';

export function getFilteredRecords(aiTable: AIViewTable, records: AITableViewRecords, fields: AITableViewFields, activeView: AITableView) {
    const { conditions, condition_logical } = activeView.settings || {};
    if (!conditions) {
        return records;
    }
    const illegalConditions = conditions.filter((item) => item.operation) || [];
    if (!illegalConditions.length) {
        return records;
    }
    const recordsWillHidden = aiTable.recordsWillHidden();
    return records.filter((record) => {
        if (recordsWillHidden && recordsWillHidden.length && recordsWillHidden.includes(record._id)) {
            return true;
        }
        return checkConditions(fields, record, { conditions: illegalConditions, condition_logical });
    });
}

function checkConditions(fields: AITableViewFields, record: AITableRecord, filterConditions: AITableFilterConditions) {
    if (!record) {
        return false;
    }
    if (!filterConditions?.conditions) {
        return true;
    }
    const { condition_logical, conditions } = filterConditions;
    if (condition_logical === AITableFilterLogical.and) {
        return conditions.every((condition) => doFilterOperations(fields, record, condition));
    }
    if (!condition_logical || condition_logical === AITableFilterLogical.or) {
        return conditions.some((condition) => doFilterOperations(fields, record, condition));
    }
    return false;
}

function doFilterOperations(fields: AITableViewFields, record: AITableRecord, condition: AITableFilterCondition) {
    const { field, cellValue } = getFilterValue(fields, record, condition);

    try {
        return field && doFilter(condition, field, cellValue);
    } catch (error) {
        return false;
    }
}

export function doFilter(condition: AITableFilterCondition, field: AITableViewField, cellValue: FieldValue) {
    return ViewOperationMap[field.type].isMeetFilter(condition, cellValue);
}

export function getDefaultRecordDataByFilter(
    recordValues: Record<string, FieldValue>,
    conditions: AITableFilterCondition[],
    conditionLogical?: AITableFilterLogical
) {
    if (conditions.length === 1) {
        // recordValues[conditions[0].field_id] = conditions[0].value;
    } else {
        //...
    }
    return recordValues;
}

export function getFilterValue(fields: AITableViewFields, record: AITableRecord, condition: AITableFilterCondition) {
    const field = fields.find((item) => item._id === condition.field_id);
    let cellValue = null;
    if (field && isSystemField(field)) {
        if ([AITableFieldType.createdAt, AITableFieldType.updatedAt].includes(field.type)) {
            cellValue = { timestamp: record[field.type as SystemFieldTypes] };
        } else {
            cellValue = record[field.type as SystemFieldTypes];
        }
    } else {
        cellValue = record.values[condition.field_id];
    }

    return {
        field,
        cellValue
    };
}
