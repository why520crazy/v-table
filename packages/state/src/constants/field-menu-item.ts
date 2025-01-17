import { AI_TABLE_GRID_FIELD_SERVICE_MAP, AITable, AITableField, AITableFieldSetting } from '@ai-table/grid';
import { ElementRef, Signal } from '@angular/core';
import _ from 'lodash';
import { Actions } from '../action';
import { AIViewTable } from '../types';

export const DividerMenuItem = {
    type: 'divider'
};

export const EditFieldPropertyItem = {
    type: 'editFieldProperty',
    name: '编辑列',
    icon: 'edit',
    exec: (
        aiTable: AIViewTable,
        field: Signal<AITableField>,
        origin?: HTMLElement | ElementRef<any>,
        position?: { x: number; y: number }
    ) => {
        const fieldService = AI_TABLE_GRID_FIELD_SERVICE_MAP.get(aiTable);
        const copyField: AITableField = _.cloneDeep(field());
        if (origin && position) {
            const popoverRef = fieldService?.editFieldProperty(aiTable, {
                field: copyField,
                isUpdate: true,
                origin: origin!,
                position
            });
            if (popoverRef && fieldService && !fieldService.aiFieldConfig?.fieldSettingComponent) {
                (popoverRef.componentInstance as AITableFieldSetting).setField.subscribe((value) => {
                    Actions.setField(aiTable, value.field, value.path);
                });
            }
            return popoverRef;
        }
        return undefined;
    }
};
