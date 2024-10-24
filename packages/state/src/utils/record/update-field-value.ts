import { AITableQueries, AITableRecordUpdatedInfo, UpdateFieldValueOptions } from '@ai-table/grid';
import * as _ from 'lodash';
import { Actions } from '../../action';
import { AIViewTable } from '../../types';

export function updateFieldValue(aiTable: AIViewTable, options: UpdateFieldValueOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const oldValue = AITableQueries.getFieldValue(aiTable, options.path);
    if (!_.isEqual(oldValue, options.value)) {
        Actions.updateFieldValue(aiTable, options.value, options.path);
        Actions.updateSystemFieldValue(aiTable, [options.path[0]], updatedInfo);
    }
}
