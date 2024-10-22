import { AddFieldOptions, AITableField, AITableRecordUpdatedInfo, Direction } from '@ai-table/grid';
import { getSortFields } from './sort-fields';
import { AITableViewFields, AIViewTable } from '../../types';
import { getNewIdsByCount } from '../common';
import { Actions } from '../../action';
import { updateRecordsUpdatedInfo } from '../record/update-system-field-value';

export function addFields(aiTable: AIViewTable, options: AddFieldOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const { originId, direction = Direction.after, defaultValue, isDuplicate, count = 1 } = options;
    const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
    const fields = getSortFields(aiTable, aiTable.fields() as AITableViewFields, activeView);
    let addIndex = fields.findIndex((item) => item._id === originId);
    if (direction === Direction.after) {
        addIndex++;
    }
    const newFieldIds = getNewIdsByCount(count);
    newFieldIds.forEach((id, index) => {
        const newField = { _id: id, ...defaultValue } as AITableField;
        Actions.addField(aiTable, newField, [addIndex + index]);
    });
    updateRecordsUpdatedInfo(aiTable, updatedInfo);
}
