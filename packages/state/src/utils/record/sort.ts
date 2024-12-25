import { AITable, AITableQueries } from '@ai-table/grid';
import { AITableView, AITableViewRecords } from '../../types';
import { ViewOperationMap } from '../field/model';
import { sortByViewPosition } from '../common';

export function getSortRecords(aiTable: AITable, records: AITableViewRecords, activeView: AITableView) {
    if (!activeView?.settings || !activeView.settings.sorts?.length) {
        return records;
    }
    const { is_keep_sort, sorts } = activeView.settings;
    if (is_keep_sort && sorts?.length) {
        return sortRecordsBySortInfo(aiTable, records, activeView);
    }
    return sortByViewPosition(records, activeView);
}

export function sortRecordsBySortInfo(aiTable: AITable, records: AITableViewRecords, activeView: AITableView) {
    const shallowRows = [...records];
    if (activeView.settings?.sorts?.length) {
        shallowRows.sort((prev, current) => {
            return activeView.settings!.sorts!.reduce((acc, rule) => {
                const field = aiTable.fieldsMap()[rule.sort_by];
                if (!field || acc !== 0) {
                    return acc;
                }
                const fieldMethod = ViewOperationMap[field.type];

                const cellValue1 = AITableQueries.getFieldValue(aiTable, [prev._id, field._id]);
                const cellValue2 = AITableQueries.getFieldValue(aiTable, [current._id, field._id]);
                const references = aiTable.references();
                const res = fieldMethod.compare(cellValue1, cellValue2, field, references);
                return res * rule.direction;
            }, 0);
        });
        return shallowRows;
    }
    return shallowRows;
}
