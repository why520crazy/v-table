import Konva from 'konva';
import { AITable, AITableField, Coordinate } from '../core';
import { AITablePointPosition } from './grid';

export interface AITableIconConfig extends Konva.ShapeConfig {
    size?: number;
}

export interface AITableFieldTypeIconConfig {
    field: AITableField;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
}

export interface AITableFieldHeadConfig {
    x?: number;
    y?: number;
    width: number;
    height: number;
    field: AITableField;
    stroke?: string;
    iconVisible?: boolean;
    isSelected?: boolean;
    isHoverIcon?: boolean;
}

export interface AITableColumnHeadsConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
    pointPosition: AITablePointPosition;
}

export interface AITableAddFieldConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    fields: AITableField[];
    columnStopIndex: number;
    pointPosition: AITablePointPosition;
    readonly?: boolean;
}

export interface AITableTargetNameOptions {
    targetName: string;
    fieldId?: string;
    recordId?: string;
    mouseStyle?: string;
}

export interface AITableTargetNameDetail {
    targetName: string | null;
    fieldId?: string | null;
    recordId?: string | null;
    mouseStyle?: string | null;
}

export enum AITableMouseDownType {
    Left,
    Center,
    Right
}
