import { WritableSignal, computed, signal } from '@angular/core';
import { AITable, AITableField, AITableFields, AITableRecord, AITableRecords } from '../types';

export function createAITable(records: WritableSignal<AITableRecords>, fields: WritableSignal<AITableFields>): AITable {
    const aiTable: AITable = {
        records,
        fields,
        selection: signal({
            selectedRecords: new Set(),
            selectedFields: new Set(),
            selectedCells: new Set(),
            activeCell: null
        }),
        keywordsMatchedCells: signal([]),
        recordsMap: computed(() => {
            return records().reduce(
                (object, item) => {
                    object[item._id] = item;
                    return object;
                },
                {} as { [key: string]: AITableRecord }
            );
        }),
        fieldsMap: computed(() => {
            return fields().reduce(
                (object, item) => {
                    object[item._id] = item;
                    return object;
                },
                {} as { [key: string]: AITableField }
            );
        }),
        recordsWillHidden: signal([]),
        recordsWillMove: signal([]),
        references: signal({ members: {} })
    };
    return aiTable;
}
