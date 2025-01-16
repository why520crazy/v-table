import { AITable, AITableFieldType, AITableQueries, ViewOperationMap } from '@ai-table/grid';
import { AITableView, AITableViewRecords } from '../../types';
import { sortByViewPosition } from '../common';

export function getSortRecords(
    aiTable: AITable,
    records: AITableViewRecords,
    activeView: AITableView,
    sortKeysMap?: Partial<Record<AITableFieldType, string>>
) {
    if (!activeView?.settings || !activeView.settings.sorts?.length) {
        return records;
    }
    const { is_keep_sort, sorts } = activeView.settings;
    if (is_keep_sort && sorts?.length) {
        return sortRecordsBySortInfo(aiTable, records, activeView, sortKeysMap);
    }
    return sortByViewPosition(records, activeView);
}

export function sortRecordsBySortInfo(
    aiTable: AITable,
    records: AITableViewRecords,
    activeView: AITableView,
    sortKeysMap?: Partial<Record<AITableFieldType, string>>
) {
    const shallowRows = [...records];
    if (activeView.settings?.sorts?.length) {
        shallowRows.sort((prev, current) => {
            return activeView.settings!.sorts!.reduce((acc, rule) => {
                const field = aiTable.fieldsMap()[rule.sort_by];
                if (!field || acc !== 0) {
                    return acc;
                }
                const fieldMethod = ViewOperationMap[field.type];
                const sortKey = sortKeysMap?.[field.type];

                const cellValue1 = AITableQueries.getFieldValue(aiTable, [prev._id, field._id]);
                const cellValue2 = AITableQueries.getFieldValue(aiTable, [current._id, field._id]);
                const references = aiTable.context!.references();
                const res = fieldMethod.compare(cellValue1, cellValue2, field, references, sortKey);
                return res * rule.direction;
            }, 0);
        });
        return shallowRows;
    }
    return shallowRows;
}
