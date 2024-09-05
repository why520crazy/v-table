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
