import { createDraft, finishDraft } from 'immer';
import { AITableView, AITableViewAction, AITableViewField, AITableViewFields, AITableViewRecord, AITableViewRecords, AIViewTable, ViewActionName } from '../../types';
import { ActionName, AITableAction, getDefaultFieldValue } from '@ai-table/grid';
import { createDefaultPositions } from '../../utils/view';

export const GeneralViewActions = {
    transform(aiTable: AIViewTable, action: AITableViewAction): void {
        const views = createDraft(aiTable.views());
        applyView(aiTable, views, action);
        aiTable.views.update(() => {
            return finishDraft(views);
        });
    }
};

export const applyView = (aiTable: AIViewTable, views: AITableView[], action: AITableViewAction) => {
    switch (action.type) {
        case ViewActionName.SetView: {
            const view = views.find((item) => item._id === action.path[0]) as AITableView;
            if (view) {
                for (const key in action.newProperties) {
                    const k = key as keyof AITableView;
                    const value = action.newProperties[k];
                    if (value == null) {
                        delete view[k];
                    } else {
                        (view[k] as any) = value;
                    }
                }

                // properties that were previously defined, but are now missing, must be deleted
                for (const key in action.properties) {
                    if (!action.newProperties.hasOwnProperty(key)) {
                        delete view[<keyof AITableView>key];
                    }
                }
            }
            break;
        }
        case ViewActionName.AddView: {
            const [viewIndex] = action.path;
            if (viewIndex > -1) {
                views.splice(viewIndex, 0, action.view);
            }
            break;
        }
        case ViewActionName.RemoveView: {
            const [viewId] = action.path;
            const viewIndex = views.findIndex((item) => item._id === viewId);
            if (viewIndex > -1) {
                views.splice(viewIndex, 1);
            }
            break;
        }
    }
};

export const GeneralActions = {
    transform(aiTable: AIViewTable, action: AITableAction): void {
        const records = createDraft(aiTable.records()) as AITableViewRecords;
        const fields = createDraft(aiTable.fields()) as AITableViewFields;
        apply(aiTable, records, fields, action);
        if (action.type === ActionName.AddRecord) {
            aiTable.records.update(() => {
                return finishDraft(records);
            });
        }
        if (action.type === ActionName.AddField) {
            aiTable.fields.update(() => {
                return finishDraft(fields);
            });
        }
    }
};

export const apply = (aiTable: AIViewTable, records: AITableViewRecords, fields: AITableViewFields, action: AITableAction) => {
    switch (action.type) {
        case ActionName.AddRecord: {
            const [recordIndex] = action.path;
            if (recordIndex > -1) {
                (action.record as AITableViewRecord).positions = createDefaultPositions(
                    aiTable.views(),
                    aiTable.activeViewId(),
                    aiTable.records() as AITableViewRecords,
                    action.path[0]
                );
                records.splice(recordIndex, 0, action.record as AITableViewRecord);
            }
            break;
        }
        case ActionName.AddField: {
            const [fieldIndex] = action.path;
            if (fieldIndex > -1) {
                const newField = action.field;
                (newField as AITableViewField).positions = createDefaultPositions(
                    aiTable.views(),
                    aiTable.activeViewId(),
                    aiTable.fields() as AITableViewFields,
                    action.path[0]
                );
                fields.splice(fieldIndex, 0, newField as AITableViewField);
                const newRecord = {
                    [newField._id]: getDefaultFieldValue(action.field)
                };
                records.forEach((item) => {
                    item.values = {
                        ...item.values,
                        ...newRecord
                    };
                });
            }
            break;
        }

    }
}
