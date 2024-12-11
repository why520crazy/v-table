import { Injectable } from '@angular/core';
import { ThyPopover } from 'ngx-tethys/popover';
import { AITableFieldPropertyEditor } from '../components';
import { FieldMenu } from '../components/field-menu/field-menu.component';
import { AITable } from '../core';
import { AIFieldConfig, AITableEditFieldOptions, AITableFieldMenuOptions } from '../types';

export const AI_TABLE_GRID_FIELD_SERVICE_MAP = new WeakMap<AITable, AITableGridFieldService>();

@Injectable()
export class AITableGridFieldService {
    aiFieldConfig: AIFieldConfig | undefined;

    constructor(private thyPopover: ThyPopover) {}

    initAIFieldConfig(aiFieldConfig: AIFieldConfig | undefined) {
        this.aiFieldConfig = aiFieldConfig;
    }

    editFieldProperty(aiTable: AITable, options: AITableEditFieldOptions) {
        const { field, isUpdate, origin, position } = options;
        const component = this.aiFieldConfig?.fieldPropertyEditor ?? AITableFieldPropertyEditor;
        return this.thyPopover.open(component, {
            origin,
            originPosition: position,
            placement: 'bottomLeft',
            manualClosure: true,
            originActiveClass: undefined,
            height: 'auto',
            panelClass: 'ai-table-field-property-editor-panel',
            initialState: {
                aiTable,
                aiEditField: field,
                isUpdate
            }
        });
    }

    openFieldMenu(aiTable: AITable, options: AITableFieldMenuOptions) {
        const { origin, editOrigin, position, fieldId, fieldMenus } = options;
        const ref = this.thyPopover.open(FieldMenu, {
            origin,
            originPosition: position,
            placement: 'bottomLeft',
            originActiveClass: undefined,
            insideClosable: true,
            initialState: {
                origin: editOrigin,
                position: options.editFieldPosition,
                aiTable,
                fieldId,
                fieldMenus
            }
        });
        return ref;
    }
}
