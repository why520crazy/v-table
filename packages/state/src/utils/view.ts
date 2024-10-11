import { idCreator } from '@ai-table/grid';
import { AITableView, AITableViewField, AITableViewFields, AITableViewRecords, AIViewTable, Positions } from '../types';
import { Actions } from '../action';
import { ViewActions } from '../action/view';
import { PositionActions } from '../action/position';

export function createDefaultPositions(
    views: AITableView[],
    activeId: string,
    data: AITableViewRecords | AITableViewFields,
    index: number
) {
    const positions: Positions = {};
    const position = getPosition(data, activeId, index);
    const maxPosition = data[data.length - 1].positions[activeId];
    views.forEach((element) => {
        positions[element._id] = element._id === activeId ? position : maxPosition + 1;
    });
    return positions;
}

export function getPosition(data: AITableViewRecords | AITableViewFields, activeViewId: string, index: number) {
    let position = data.length - 1;
    if (index !== 0 && index !== data.length) {
        const previousViewPosition = data[index - 1].positions[activeViewId];
        const nextViewPosition = data[index].positions[activeViewId!];
        position = (previousViewPosition + nextViewPosition) / 2;
    } else {
        position = index;
    }
    return position;
}

export function addView(aiTable: AIViewTable, type: 'add' | 'copy') {
    let index = aiTable.views().length;
    const newId = idCreator();
    let newView: AITableView = {
        _id: newId,
        name: '表格视图 ' + index
    };
    let originViewId = aiTable.views()[aiTable.views().length - 1]._id;
    if (type === 'copy') {
        originViewId = aiTable.activeViewId();
        const copyView = aiTable.views().find((item) => item._id === aiTable.activeViewId())!;
        newView = {
            ...copyView,
            _id: newId,
            name: copyView.name + '-副本'
        };
        index = aiTable.views().indexOf(copyView) + 1;
    }
    ViewActions.addView(aiTable, newView, [index]);
    (aiTable.records() as AITableViewRecords).forEach((record) => {
        PositionActions.setRecordPosition(aiTable, { [newId]: record.positions[originViewId] }, [record._id]);
    });
    (aiTable.fields() as AITableViewFields).forEach((field) => {
        Actions.setField<AITableViewField>(
            aiTable,
            {
                positions: {
                    ...field.positions,
                    [newId]: field.positions[originViewId]
                }
            },
            [field._id]
        );
    });
    return newView;
}

export function removeView(aiTable: AIViewTable, records: AITableViewRecords, fields: AITableViewFields, activeViewId: string) {
    records.forEach((record) => {
        PositionActions.removeRecordPosition(aiTable, [activeViewId, record._id]);
    });
    fields.forEach((field) => {
        const positions = { ...field.positions };
        delete positions[activeViewId];
        Actions.setField<AITableViewField>(
            aiTable,
            {
                positions
            },
            [field._id]
        );
    });
    ViewActions.removeView(aiTable, [activeViewId]);
}


