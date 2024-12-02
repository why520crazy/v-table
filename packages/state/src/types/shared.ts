import { FieldValue } from '@ai-table/grid';
import * as Y from 'yjs';
import { Positions } from './view';

export type SyncMapElement = Y.Map<any>;

export type SyncArrayElement = Y.Array<any>;

export type RecordSyncElement = Y.Array<Y.Array<any>>;

export type SharedType = Y.Map<Y.Array<SyncMapElement | SyncArrayElement | RecordSyncElement>>;

export type SystemFieldValues = [{ _id: string }, string, number, string, Positions, number, string];

export type CustomFieldValues = FieldValue[];

export type SharedRecordJsonType = [SystemFieldValues, CustomFieldValues];
