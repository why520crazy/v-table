import { ElementRef, ViewContainerRef } from '@angular/core';
import { AITable, Coordinate } from '../core';
import { AITableGridSelectionService } from '../services/selection.service';

export enum AITableRowType {
    add = 'add',
    record = 'record'
}

export type AITableCellMetaData = {
    size: number;
    offset: number;
};

export type AITableCellMetaDataMap = Record<number, AITableCellMetaData>;

export type AITableLinearRowAdd = {
    _id: string;
    type: AITableRowType.add;
};

export type AITableLinearRowRecord = {
    _id: string;
    type: AITableRowType.record;
    displayIndex: number;
};

export type AITableLinearRow = AITableLinearRowAdd | AITableLinearRowRecord;

export interface AITableRowHeadsConfig {
    coordinate: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    aiTable: AITable;
}

export interface AITableContextMenuItem {
    type: string;
    name?: string;
    icon?: string;
    exec?: (
        aiTable: AITable,
        targetName: string,
        position: { x: number; y: number },
        aiTableGridSelectionService: AITableGridSelectionService
    ) => void;
    hidden?: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => boolean;
    disabled?: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => boolean;
}

export interface AITableContextMenuOptions {
    origin: ElementRef<any> | HTMLElement;
    position: { x: number; y: number };
    menuItems: AITableContextMenuItem[];
    targetName: string;
    viewContainerRef: ViewContainerRef;
}
