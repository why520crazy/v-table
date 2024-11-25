import * as Y from 'yjs';
import { AITableViewFields, AITableViewRecords, AITableViews, SharedRecordJsonType, SharedType } from '../../types';
import {
    getIdBySystemFieldValues,
    getPositionsBySystemFieldValues,
    getTrackableEntityBySystemFieldValues,
    getValuesByCustomFieldValues,
    toRecordSyncElement,
    toSyncElement
} from './translate';
import { AI_TABLE_CONTENT_FIELD_NAME } from '../../constants/default';

export const createSharedType = (fieldName: string = AI_TABLE_CONTENT_FIELD_NAME) => {
    const doc = new Y.Doc();
    const sharedType = doc.getMap<any>(fieldName);
    return sharedType;
};

export const getDataBySharedType = (sharedType: SharedType) => {
    const data = sharedType.toJSON();
    const fields: AITableViewFields = data['fields'];
    const records: AITableViewRecords = getRecordsBySharedJson(data['records'], fields);
    const views = data['views'];
    return {
        records,
        fields,
        views
    };
};

export const getSharedTypeByData = (
    doc: Y.Doc,
    initializeValue: {
        fields: AITableViewFields;
        records: AITableViewRecords;
        views: AITableViews;
    }
) => {
    const sharedType = doc.getMap<any>(AI_TABLE_CONTENT_FIELD_NAME);
    toSharedType(sharedType, initializeValue);
    return sharedType;
};

export function toSharedType(
    sharedType: Y.Map<any>,
    data: {
        fields: AITableViewFields;
        records: AITableViewRecords;
        views: AITableViews;
    }
): void {
    sharedType.doc!.transact(() => {
        const fieldSharedType = new Y.Array();
        fieldSharedType.insert(0, data.fields.map(toSyncElement));
        sharedType.set('fields', fieldSharedType);
        const recordSharedType = new Y.Array<Y.Array<any>>();
        sharedType.set('records', recordSharedType);
        recordSharedType.insert(
            0,
            data.records.map((record) => {
                return toRecordSyncElement(record, data.fields);
            })
        );

        const viewsSharedType = new Y.Array();
        sharedType.set('views', viewsSharedType);
        viewsSharedType.insert(0, data.views.map(toSyncElement));
    });
}

export const getRecordsBySharedJson = (recordJsonArray: SharedRecordJsonType[], fields: AITableViewFields): AITableViewRecords => {
    return recordJsonArray.map((record: SharedRecordJsonType) => {
        const [systemFieldValues, customFieldValues] = record;
        return {
            _id: getIdBySystemFieldValues(systemFieldValues),
            ...getTrackableEntityBySystemFieldValues(systemFieldValues),
            positions: getPositionsBySystemFieldValues(systemFieldValues),
            values: getValuesByCustomFieldValues(customFieldValues, fields)
        };
    });
};
