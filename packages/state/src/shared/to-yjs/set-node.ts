import { getSharedMapValueIndex } from '../utils';
import { ActionName, SetFieldAction, SetViewAction, SharedType, SyncMapElement } from '../../types';
import * as Y from 'yjs';
import { AITable } from '@ai-table/grid';

export default function setNode(aiTable: AITable, sharedType: SharedType, action: SetFieldAction | SetViewAction): SharedType {
    let sharedNodes;
    if (action.type === ActionName.SetField) {
        sharedNodes = sharedType.get('fields')! as Y.Array<SyncMapElement>;
    }

    if (action.type === ActionName.SetView) {
        sharedNodes = sharedType.get('views')! as Y.Array<SyncMapElement>;
    }

    if (sharedNodes) {
        let nodeIndex = getSharedMapValueIndex(sharedNodes, action.path[0] as string);
        if (nodeIndex > -1) {
            const node = sharedNodes.get(nodeIndex) as SyncMapElement;
            Object.entries(action.newProperties).forEach(([key, value]) => {
                if (value == null) {
                    node.delete(key);
                } else {
                    node.set(key, value);
                }
            });
            Object.entries(action.properties).forEach(([key]) => {
                if (!action.newProperties.hasOwnProperty(key)) {
                    node.delete(key);
                }
            });
        }
    }
    return sharedType;
}
