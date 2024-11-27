import { ElementRef, Signal } from '@angular/core';
import { AITable, AITableField, SelectSettings } from '../core';

export interface AITableFieldMenuItem {
    type: string;
    name?: string;
    icon?: string;
    exec?: (
        aiTable: AITable,
        field: Signal<AITableField>,
        origin?: HTMLElement | ElementRef<any>,
        position?: { x: number; y: number }
    ) => any;
    hidden?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
    disabled?: (aiTable: AITable, field: Signal<AITableField>) => boolean;
}

export interface AITableSelectField extends AITableField {
    settings: SelectSettings;
}

export interface AITableEditFieldOptions {
    field: AITableField;
    isUpdate: boolean;
    origin: HTMLElement | ElementRef<any>;
    position?: { x: number; y: number };
}

export interface AITableFieldMenuOptions {
    fieldId: string;
    fieldMenus: AITableFieldMenuItem[];
    editOrigin?: any;
    origin?: any;
    position?: { x: number; y: number };
    editFieldPosition?: { x: number; y: number };
}
