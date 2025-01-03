import { AITableView, AITableViewFields, AITableViewRecords, AIViewTable } from '../types';
import { getSortRecords } from './record/sort';
import { getFilteredRecords } from './record/filter';
import { getSortFields } from './field/sort-fields';
import { AITableFieldType } from '@ai-table/grid';

export function buildRecordsByView(
    aiTable: AIViewTable,
    records: AITableViewRecords,
    fields: AITableViewFields,
    activeView: AITableView,
    sortKeysMap?: Partial<Record<AITableFieldType, string>>
) {
    const filteredRecords = getFilteredRecords(aiTable, records, fields, activeView);
    return getSortRecords(aiTable, filteredRecords, activeView, sortKeysMap);
}

export function buildFieldsByView(aiTable: AIViewTable, fields: AITableViewFields, activeView: AITableView) {
    return getSortFields(aiTable, fields as AITableViewFields, activeView);
}
