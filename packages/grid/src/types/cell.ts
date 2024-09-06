import Konva from 'konva';
import { AITable, AITableField, Coordinate, FieldValue } from '../core';
import { AITableContext } from './grid';
import { AITableLinearRowRecord } from './row';

export interface AITableCellsOptions {
    aiTable: AITable;
    context: AITableContext;
    instance: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
}

export interface AITableCellsDrawerOptions extends AITableCellsOptions {
    ctx: Konva.Context | CanvasRenderingContext2D;
}

export interface AITableRender {
    x: number;
    y: number;
    columnWidth: number;
    rowHeight: number;
    recordId: string;
    field: AITableField;
    cellValue: FieldValue;
    style: AITableRenderStyle;
}

export interface AITableRenderStyle {
    color?: string;
    textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
}

export interface AITableFirstCell {
    row: AITableLinearRowRecord;
    style: any;
}

export interface AITableDynamicCellsOptions {
    aiTable: AITable;
    context: AITableContext;
    instance: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
}

export interface AITableCellHeightOptions {
    field: AITableField | null;
    rowHeight: number;
    activeHeight?: number;
    isActive?: boolean;
}

export interface AITablePlaceholderDrawerOptions {
    aiTable: AITable;
    context: AITableContext;
    instance: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
    rowStartIndex: number;
    rowStopIndex: number;
}

export interface AITableActiveCellOptions {
    aiTable: AITable;
    context: AITableContext;
    instance: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
    rowStartIndex: number;
    rowStopIndex: number;
}

export interface AITableCellScrollContainerOptions {
    aiTable: AITable;
    context: AITableContext;
    x: number;
    y: number;
    columnWidth: number;
    rowHeight: number;
    fieldId: string;
    recordId: string;
    renderData: any;
    children: any[];
    [key: string]: any;
}

export interface AITableCellOptions {
    aiTable: AITable;
    context: AITableContext;
    field: AITableField;
    recordId: string;
    x: number;
    y: number;
    rowHeight: number;
    columnWidth: number;
    cellValue: FieldValue;
    renderData: any;
    isActive?: boolean;
    style?: any;
}
