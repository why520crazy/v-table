import { AITable, AITableField, AITableRecordUpdatedInfo } from '@ai-table/grid';
import { Signal } from '@angular/core';
import { Actions } from '../../action';
import { AIViewTable } from '../../types';
import { updateRecordsUpdatedInfo } from '../record/update-system-field-value';

export const buildRemoveFieldItem = (getUpdatedInfo: () => AITableRecordUpdatedInfo) => {
    return {
        type: 'removeField',
        name: '删除列',
        icon: 'trash',
        exec: (aiTable: AITable, field: Signal<AITableField>) => {
            Actions.removeField(aiTable as AIViewTable, [field()._id]);
            updateRecordsUpdatedInfo(aiTable as AIViewTable, getUpdatedInfo());
        }
    };
};
