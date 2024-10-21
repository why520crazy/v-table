import { AITableRecordUpdatedInfo, UpdateFieldValueOptions } from '@ai-table/grid';
import { Actions } from '../../action';
import { AIViewTable } from '../../types';

export function updateFieldValue(aiTable: AIViewTable, options: UpdateFieldValueOptions, updatedInfo: AITableRecordUpdatedInfo) {
    Actions.updateFieldValue(aiTable, options.value, options.path);
    Actions.updateSystemFieldValue(aiTable, [options.path[0]], updatedInfo);
}
