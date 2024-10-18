import { AITable } from '@ai-table/grid';
import updateFieldValue from './update-field-value';
import { ActionName, AITableAction, SharedType } from '../../types';
import setNode from './set-node';
import addNode from './add-node';
import removeNode from './remove-node';

export type ActionMapper<O extends AITableAction = AITableAction> = {
    [K in O['type']]: O extends { type: K } ? ApplyFunc<O> : never;
};

export type ApplyFunc<O extends AITableAction = AITableAction> = (sharedType: SharedType, op: O) => SharedType;

export const actionMappers: Partial<ActionMapper<any>> = {
    [ActionName.AddRecord]: addNode,
    [ActionName.UpdateFieldValue]: updateFieldValue,
    [ActionName.RemoveRecord]: removeNode,
    [ActionName.AddField]: addNode,
    [ActionName.SetField]: setNode,
    [ActionName.RemoveField]: removeNode,
    [ActionName.SetView]: setNode,
    [ActionName.AddView]: addNode,
    [ActionName.RemoveView]: removeNode,
    [ActionName.SetRecordPositions]: addNode
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
