import { AITableFields, AITableRecords, FieldOptions } from '../core';
import { AITableGridData, AITableLinearRow } from '../types';
import { AITableRowType } from '../types/row';

export const buildGridLinearRows = (visibleRecords: AITableRecords, isAddingVisible: boolean = true): AITableLinearRow[] => {
    const linearRows: AITableLinearRow[] = [];
    let displayRowIndex = 0;
    [...visibleRecords, { _id: '' }].forEach((row) => {
        if (row._id) {
            displayRowIndex++;
            linearRows.push({
                type: AITableRowType.record,
                _id: row._id,
                displayIndex: displayRowIndex
            });
        }
        if (isAddingVisible && !row._id) {
            linearRows.push({
                type: AITableRowType.add,
                _id: ''
            });
        }
    });
    return linearRows;
};

export const buildGridData = (recordValue: AITableRecords, fieldsValue: AITableFields): AITableGridData => {
    const fields = fieldsValue.map((value) => {
        const fieldOption = FieldOptions.find((item) => item.type === value.type)!;
        return {
            ...value,
            icon: value.icon || fieldOption.icon,
            width: value.width || fieldOption.width
        };
    });
    return {
        type: 'grid',
        fields,
        records: recordValue
    };
};
