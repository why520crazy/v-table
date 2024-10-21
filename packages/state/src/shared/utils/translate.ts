import { AITableRecordUpdatedInfo, FieldValue, TrackableEntity } from '@ai-table/grid';
import {
    AITableViewField,
    AITableViewFields,
    AITableViewRecord,
    AITableViewRecords,
    CustomFieldValues,
    Positions,
    RecordSyncElement,
    SyncArrayElement,
    SyncMapElement,
    SystemFieldValues
} from '../../types';
import * as Y from 'yjs';

export const POSITIONS_INDEX = 3;
export const UPDATED_AT_INDEX = 4;
export const UPDATED_BY_INDEX = 5;

export function toSyncElement(node: any): SyncMapElement {
    const element: SyncMapElement = new Y.Map();
    for (const key in node) {
        element.set(key, node[key]);
    }
    return element;
}

export function toRecordSyncElement(record: AITableViewRecord, fields: AITableViewFields): Y.Array<Y.Array<any>> {
    const systemFieldValues = new Y.Array();
    // 临时方案：为了解决删除时协同操作无法精准获取删除的 id 的问题，将原来的[idValue] 改为[{'_id': idValue}]
    systemFieldValues.insert(0, getSystemFieldValues(record));
    const customFieldValues = new Y.Array();
    const valuesArray: FieldValue[] = [];
    fields.forEach((field: AITableViewField) => {
        valuesArray.push(record['values'][field._id]);
    });
    customFieldValues.insert(0, valuesArray);
    // To save memory, convert map to array.
    const element: RecordSyncElement = new Y.Array<Y.Array<any>>();
    element.insert(0, [systemFieldValues, customFieldValues]);
    return element;
}

export function translatePositionToPath(data: AITableViewRecords | AITableViewFields, position: number, activeViewId: string) {
    let index = data.findIndex((value, index) => {
        if (index === 0) {
            return position < value.positions[activeViewId];
        }
        return position > data[index - 1].positions[activeViewId] && position < value.positions[activeViewId];
    });
    if (index === -1) {
        index = data.length;
    }

    return [index];
}

export function getShareTypeNumberPath(path: (string | number)[]): number[] {
    return path.filter((node) => typeof node === 'number') as number[];
}

export function getSharedRecordId(records: Y.Array<SyncArrayElement>, recordIndex: number) {
    return records && (records as Y.Array<SyncArrayElement>).get(recordIndex).get(0).get(0)['_id'];
}

export function getSharedRecord(records: Y.Array<SyncArrayElement>, recordIndex: number) {
    return records && (records as Y.Array<SyncArrayElement>).get(recordIndex);
}

export function getSharedMapValueId(values: Y.Array<SyncMapElement>, index: number) {
    return values && values.get(index).get('_id');
}

export function getSharedRecordIndex(sharedRecords: Y.Array<SyncArrayElement>, recordId: string) {
    let recordIndex = -1;
    for (let index = 0; index < sharedRecords.length; index++) {
        const sharedRecordId = getSharedRecordId(sharedRecords, index);
        if (sharedRecordId === recordId) {
            recordIndex = index;
            break;
        }
    }
    return recordIndex;
}

export function getSharedMapValueIndex(sharedNodes: Y.Array<SyncMapElement>, id: string) {
    let nodeIndex = -1;
    for (let index = 0; index < sharedNodes.length; index++) {
        const sharedId = getSharedMapValueId(sharedNodes, index);
        if (sharedId === id) {
            nodeIndex = index;
            break;
        }
    }
    return nodeIndex;
}

export const getSystemFieldValues = (record: AITableViewRecord): SystemFieldValues => {
    return [{ _id: record['_id'] }, record.created_at, record.created_by, record['positions'], record.updated_at, record.updated_by];
};

export const getCustomFieldValues = (record: AITableViewRecord): CustomFieldValues => {
    throw new Error('No implement');
};

export const getValuesByCustomFieldValues = (customFieldValues: CustomFieldValues, fields: AITableViewFields) => {
    const fieldIds = fields.map((item) => item._id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        recordValue[item] = customFieldValues[index] || '';
    });
    return recordValue;
};

export const getTrackableEntityBySystemFieldValues = (systemFieldValues: SystemFieldValues): TrackableEntity => {
    return {
        created_at: systemFieldValues[1],
        created_by: systemFieldValues[2],
        updated_at: systemFieldValues[4],
        updated_by: systemFieldValues[5]
    };
};

export const getIdBySystemFieldValues = (systemFieldValues: SystemFieldValues): string => {
    return systemFieldValues[0]['_id'];
};

export const getIdBySystemFieldValuesType = (systemFieldValues: Y.Array<any>): string => {
    return systemFieldValues.get(0)['_id'];
};

export const getPositionsBySystemFieldValues = (systemFieldValues: SystemFieldValues): Positions => {
    return systemFieldValues[POSITIONS_INDEX];
};

export const getPositionsByRecordSyncElement = (recordSyncElement: RecordSyncElement) => {
    const systemFieldType = recordSyncElement.get(0) as Y.Array<any>;
    const positions = systemFieldType.get(POSITIONS_INDEX);
    return positions;
};

export const setRecordPositions = (recordSyncElement: RecordSyncElement, newPositions: Positions) => {
    const systemFieldType = recordSyncElement.get(0) as Y.Array<any>;
    systemFieldType.delete(POSITIONS_INDEX);
    systemFieldType.insert(POSITIONS_INDEX, [newPositions]);
};

export const setRecordUpdatedInfo = (recordSyncElement: RecordSyncElement, info: AITableRecordUpdatedInfo) => {
    const systemFieldType = recordSyncElement.get(0) as Y.Array<any>;
    systemFieldType.delete(UPDATED_AT_INDEX, 2);
    systemFieldType.insert(UPDATED_AT_INDEX, [info.updated_at, info.updated_by]);
};
