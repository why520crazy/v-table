import { Signal, WritableSignal } from '@angular/core';
import { Dictionary } from 'ngx-tethys/types';
import {
    AIRecordFieldIdPath,
    AITable,
    AITableField,
    AITableFieldType,
    AITableRecord,
    Coordinate,
    FieldValue,
    UpdateFieldValueOptions
} from '../core';
import { AITableFieldMenuItem } from './field';
import { AITableLinearRow } from './row';

export interface AITableGridCellRenderSchema {
    editor?: any;
    transform?: (field: AITableField, value: FieldValue) => any;
}

export interface AITableGridData {
    type: 'grid';
    fields: AITableField[];
    records: AITableRecord[];
}

export interface AITableSelection {
    selectedRecords: Set<string>; // `${recordId}`
    selectedFields: Set<string>; // `${fieldId}`
    selectedCells: Set<string>; // `${recordId}:${fieldId}`
    activeCell: AIRecordFieldIdPath | null;
}

export interface AIFieldConfig {
    fieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>;
    fieldSettingComponent?: any;
    fieldMenus?: AITableFieldMenuItem[];
}

export interface AITableUserInfo {
    uid?: string;
    display_name?: string;
    avatar?: string;
    [key: string]: any;
}

export interface AITableReferences {
    members: Dictionary<AITableUserInfo>;
}

export interface AITableRendererConfig {
    aiTable: AITable;
    container: HTMLDivElement;
    coordinate: Coordinate;
    containerWidth: number;
    containerHeight: number;
    references: AITableReferences;
    readonly?: boolean;
}

export enum AITableRowColumnType {
    row = 'row',
    column = 'column'
}

export type AITableSizeMap = Record<number, number>;

export interface AITableCoordinate {
    rowCount: number;
    columnCount: number;
    container: HTMLDivElement;
    rowHeight: number;
    rowInitSize?: number;
    rowIndicesSizeMap: AITableSizeMap;
    columnIndicesSizeMap: AITableSizeMap;
    columnInitSize?: number;
    frozenColumnCount?: number;
}

export enum AITableCheckType {
    checked = 'checked',
    unchecked = 'unchecked'
}

export interface AITableScrollState {
    scrollTop: number;
    scrollLeft: number;
    isScrolling: boolean;
}

export interface ScrollActionOptions {
    deltaX: number;
    deltaY: number;
    shiftKey: boolean;
    callback?: () => void;
}

export enum AITableAreaType {
    grid = 'grid',
    none = 'none'
}

export type AITablePointPosition = {
    x: number;
    y: number;
    areaType: AITableAreaType;
    targetName: string;
    realTargetName: string;
    rowIndex: number;
    columnIndex: number;
    offsetTop: number;
    offsetLeft: number;
};

export interface AITableEditPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface AITableOpenEditOptions {
    recordId: string;
    fieldId: string;
    coordinate: Coordinate;
    references: AITableReferences;
    container?: HTMLDivElement;
    isHoverEdit?: boolean;
    updateFieldValue: (options: UpdateFieldValueOptions<any>) => void;
}

export interface AITableContext {
    linearRows: Signal<AITableLinearRow[]>;
    pointPosition: WritableSignal<AITablePointPosition>;
    scrollState: WritableSignal<AITableScrollState>;
    scrollAction: (options: ScrollActionOptions) => void;
    visibleColumnsIndexMap: Signal<Map<string, number>>;
    visibleRowsIndexMap: Signal<Map<string, number>>;
    frozenColumnCount: Signal<number>;
    references: Signal<AITableReferences>;
}
