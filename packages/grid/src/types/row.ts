import { AITable, Context, Coordinate } from '../core';

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

export interface AITableRowHeadOperationOptions {
    instance: Coordinate;
    isCheckedRow: boolean;
    isHoverRow: boolean;
    rowIndex: number;
    isHoverCheckbox: boolean;
    recordId: string;
}

export interface AITableRowHeadsOptions {
    instance: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    context: Context;
    aiTable: AITable;
}
