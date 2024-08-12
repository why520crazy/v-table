import { AITable, AITableAction } from '@ai-table/grid';
import updateFieldValue from './update-field-value';
import addRecord from './add-record';
import addField from './add-field';
import setView from './set-view';
import { SharedType } from '../../types';

export type ActionMapper<O extends AITableAction = AITableAction> = {
    [K in O['type']]: O extends { type: K } ? ApplyFunc<O> : never;
};

export type ApplyFunc<O extends AITableAction = AITableAction> = (sharedType: SharedType, op: O) => SharedType;

export const actionMappers: Partial<ActionMapper<any>> = {
    update_field_value: updateFieldValue,
    add_record: addRecord,
    add_field: addField,
    set_view: setView
};

export function applyActionOps(sharedType: SharedType, actions: AITableAction[], aiTable: AITable): SharedType {
    if (actions.length > 0) {
        sharedType.doc!.transact(() => {
            actions.forEach((action) => {
                const apply = actionMappers[action.type] as ApplyFunc<typeof action>;
                if (apply) {
                    return apply(sharedType, action);
                }
                return null;
            });
        }, aiTable);
    }

    return sharedType;
}