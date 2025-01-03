import { AITableField, AITableFilterCondition, AITableRecord } from '@ai-table/grid';
import { Id } from 'ngx-tethys/types';

export class Positions {
    [view_id: string]: number;
}

export class RemovePositions {
    [view_id: string]: undefined;
}

export interface AITableViewRecord extends AITableRecord {
    positions: Positions;
}

export interface AITableViewField extends AITableField {
    positions: Positions;
}

export type AITableViewRecords = AITableViewRecord[];

export type AITableViewFields = AITableViewField[];

export enum Direction {
    default = 0,
    ascending = 1,
    descending = -1
}

export enum AITableFilterLogical {
    and = 'and',
    or = 'or'
}

export type ViewSettings = AITableSearchOptions & AITableFilterConditions & AITableSortOptions;

export interface AITableView {
    _id: string;
    short_id: string;
    name: string;
    emoji_icon?: string;
    settings?: ViewSettings;
}

export interface AITableFilterConditions<TValue = unknown> {
    condition_logical?: AITableFilterLogical;
    conditions?: AITableFilterCondition<TValue>[];
}

export interface AITableSortOptions {
    is_keep_sort?: boolean;
    sorts?: {
        sort_by: Id;
        direction: Direction;
    }[];
}

export interface AITableSearchOptions {
    keywords?: string;
}

export type AITableViews = AITableView[];
