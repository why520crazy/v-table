import { Id } from 'ngx-tethys/types';

export enum AITableFieldType {
    text = 'text', // 包含多行文本
    richText = 'rich_text', // 包含多行文本
    select = 'select', // 包含单选和多选
    number = 'number',
    date = 'date',
    member = 'member', // 包含单个和多个
    // cascadeSelect = 'cascade_select', // 包含单选和多选，参数复杂后续再进行设计
    progress = 'progress',
    rate = 'rate',
    link = 'link',
    createdAt = 'created_at',
    updatedAt = 'updated_at',
    createdBy = 'created_by',
    updatedBy = 'updated_by'
}

export type SystemFieldTypes =
    | AITableFieldType.createdAt
    | AITableFieldType.createdBy
    | AITableFieldType.updatedAt
    | AITableFieldType.updatedBy;

export enum AITableStatType {
    None = 0,
    CountAll = 1,
    Empty = 2,
    Filled = 3,
    Unique = 4,
    PercentEmpty = 5,
    PercentFilled = 6,
    PercentUnique = 7,
    Sum = 8,
    Average = 9,
    Max = 10,
    Min = 11,
    DateRangeOfDays = 12,
    DateRangeOfMonths = 13,
    Checked = 14,
    UnChecked = 15,
    PercentChecked = 16,
    PercentUnChecked = 17
}

export interface AITableFieldOption {
    name: string;
    type: AITableFieldType;
    icon: string;
    width: number;
    settings?: AITableFieldSettings;
}

export interface AITableField {
    _id: string;
    name: string;
    type: AITableFieldType;
    icon?: string;
    width?: number;
    hidden?: boolean;
    frozen?: boolean;
    stat_type?: AITableStatType;
    settings?: AITableFieldSettings;
}

export type AITableFieldSettings = TextSettings | RichTextSettings | SelectSettings | MemberSettings;

export interface TextSettings {}

export interface RichTextSettings {}

export interface SelectSettings extends IsMultiple {
    option_style?: AITableSelectOptionStyle;
    options: AITableSelectOption[];
}

export interface MemberSettings extends IsMultiple {}

export interface IsMultiple {
    is_multiple?: boolean;
}

export interface AITableSelectOption {
    _id: string;
    text: string;
    icon?: string;
    color?: string;
    bg_color?: string;
}

export enum AITableSelectOptionStyle {
    text = 1,
    tag = 2,
    dot = 3,
    piece = 4
}

export type TextFieldValue = string;

export type LinkFieldValue = { url: string; text: string };

export type SelectFieldValue = Id[]; // 数字

export type NumberFieldValue = number;

export type DateFieldValue = { timestamp: number }; // 时间戳

export type MemberFieldValue = Id[];

export type ProgressFieldValue = number; // [0,1]

export type RateFieldValue = 1 | 2 | 3 | 4 | 5;

export type FieldValue =
    | TextFieldValue
    | LinkFieldValue
    | SelectFieldValue
    | NumberFieldValue
    | DateFieldValue
    | MemberFieldValue
    | ProgressFieldValue
    | RateFieldValue
    | any;

export interface TrackableEntity {
    created_at: NumberFieldValue;
    created_by: string;
    updated_at: NumberFieldValue;
    updated_by: string;
}

export interface UpdateTrackableEntity {
    updated_at: NumberFieldValue;
    updated_by: string;
}

export interface AITableRecord {
    _id: string;
    short_id: string;
    created_at: NumberFieldValue;
    created_by: string;
    updated_at: NumberFieldValue;
    updated_by: string;
    values: Record<string, FieldValue>;
}

export interface AITableRecordUpdatedInfo {
    updated_at: number;
    updated_by: string;
}

export type AITableRecords = AITableRecord[];

export type AITableFields = AITableField[];

export interface AITableValue {
    records: AITableRecords;
    fields: AITableFields;
}

export enum Direction {
    before = 'before',
    after = 'after'
}

export interface AddRecordOptions {
    originId: string;
    direction?: Direction;
    isDuplicate?: boolean;
    count?: number;
}

export interface AddFieldOptions {
    originId: string;
    defaultValue: Partial<AITableField>;
    direction?: Direction;
    isDuplicate?: boolean;
    count?: number;
}

export interface UpdateFieldValueOptions<T = unknown> {
    value: T;
    path: AIFieldValueIdPath;
}

export interface SetFieldOptions<T = unknown> {
    field: AITableField;
    path: IdPath;
}

export type NumberPath = [number];

export type IdPath = [string];

export type AIFieldValueIdPath = [string, string];

export type AIRecordFieldPosition = [string, string];

export type Path = NumberPath | IdPath | AIFieldValueIdPath;
