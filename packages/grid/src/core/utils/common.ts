import { WritableSignal, signal } from '@angular/core';
import { Actions } from '../action';
import { AITable, AITableAction, AITableFields, AITableRecords, Path } from '../types';
import { FLUSHING } from './weak-map';

export function createAITable(records: WritableSignal<AITableRecords>, fields: WritableSignal<AITableFields>): AITable {
    const aiTable: AITable = {
        records,
        fields,
        actions: [],
        selection: signal({
            selectedRecords: new Map(),
            selectedFields: new Map(),
            selectedCells: new Map()
        }),
        onChange: () => {},
        apply: (action: AITableAction) => {
            aiTable.actions.push(action);
            Actions.transform(aiTable, action);

            if (!FLUSHING.get(aiTable)) {
                FLUSHING.set(aiTable, true);
                Promise.resolve().then(() => {
                    FLUSHING.set(aiTable, false);
                    aiTable.onChange();
                    aiTable.actions = [];
                });
            }
        }
    };
    return aiTable;
}

export function isPathEqual(path: Path, another: Path): boolean {
    return path.length === another.length && path.every((n, i) => n === another[i]);
}
