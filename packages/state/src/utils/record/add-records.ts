import {
    AddRecordOptions,
    AITableRecord,
    Direction,
    FieldValue,
    getDefaultFieldValue,
    idsCreator,
    shortIdsCreator,
    TrackableEntity
} from '@ai-table/grid';
import { AITableViewFields, AITableViewRecords, AIViewTable } from '../../types';
import { getSortRecords } from './sort';
import { getSortFields } from '../field/sort-fields';
import { Actions } from '../../action';
import { getDefaultRecordDataByFilter } from './filter';

export function addRecords(aiTable: AIViewTable, options: AddRecordOptions, trackableEntity: TrackableEntity) {
    const { originId, direction = Direction.after, isDuplicate, count = 1 } = options;
    const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
    const records = getSortRecords(aiTable, aiTable.records() as AITableViewRecords, activeView);
    let addIndex = records.findIndex((item) => item._id === originId);
    if (direction === Direction.after) {
        addIndex++;
    }
    const newRecordIds = idsCreator(count);
    const newRecordShortIds = shortIdsCreator(count);
    const newRecordValues = getDefaultRecordValues(aiTable, isDuplicate, originId);
    // TODO: 判断如果存在筛选条件，且 newRecordValues 中没有一项满足筛选条件
    // 把 id 添加到 RECORDS_WILL_HIDDEN 中
    if (activeView.settings?.conditions?.length) {
        aiTable.recordsWillHidden?.update((value) => {
            value.push(...newRecordIds);
            return [...value];
        });
    }
    newRecordIds.forEach((id, index) => {
        const newRecord: AITableRecord = { _id: id, short_id: newRecordShortIds[index], values: newRecordValues, ...trackableEntity };
        Actions.addRecord(aiTable, newRecord, [addIndex + index]);
    });
}

export function getDefaultRecordValues(aiTable: AIViewTable, isDuplicate = false, recordId?: string) {
    let newRecordValues: Record<string, FieldValue> = {};
    if (isDuplicate && recordId) {
        newRecordValues = aiTable.recordsMap()[recordId].values;
    } else {
        const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
        const fields = getSortFields(aiTable, aiTable.fields() as AITableViewFields, activeView);
        fields.map((item) => {
            newRecordValues[item._id] = getDefaultFieldValue(item);
        });
        const { conditions, condition_logical } = activeView.settings || {};
        if (conditions && conditions.length) {
            newRecordValues = getDefaultRecordDataByFilter(newRecordValues, conditions, condition_logical);
        }
    }
    return newRecordValues;
}
