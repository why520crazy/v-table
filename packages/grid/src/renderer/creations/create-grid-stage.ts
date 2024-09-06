import Konva from 'konva/lib';
import { AITable, Context } from '../../core';
import { AITableGridStageOptions } from '../../types';
import { getVisibleRangeInfo } from '../../utils';
import { createAllCells } from './create-all-cells';
import { createColumnHeads } from './create-heads';
import { createAddFieldColumn } from './create-add-field-column';
import { createHoverRowHeads } from './create-hover-row-heads';
import { createOtherRows } from './create-other-rows';

Konva.pixelRatio = 2;

export const createGridStage = (config: AITableGridStageOptions) => {
    const { width, height, container, aiTable, coordinate: coordinateInstance } = config;
    const context = aiTable.context as Context;

    const fields = AITable.getVisibleFields(aiTable);

    const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = getVisibleRangeInfo(
        coordinateInstance,
        context.scrollState()
    );

    const gridStage = new Konva.Stage({
        container: container,
        width: width,
        height: height,
        listening: true
    });

    const gridLayer = new Konva.Layer();
    const gridGroup = new Konva.Group();
    const { columnHeads, frozenColumnHead } = createColumnHeads({
        coordinate: coordinateInstance,
        columnStartIndex,
        columnStopIndex,
        fields: fields,
        pointPosition: context.pointPosition(),
        aiTable
    });

    const { frozenCells, cells } = createAllCells({
        aiTable,
        coordinate: coordinateInstance,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex
    });

    const frozenGroup = new Konva.Group();
    const commonGroup = new Konva.Group();
    gridGroup.add(frozenGroup);
    gridGroup.add(commonGroup);
    const frozenColumnHeadGroup = new Konva.Group();
    frozenColumnHeadGroup.add(...frozenColumnHead);
    const frozenCellsGroup = new Konva.Group();
    frozenGroup.add(frozenColumnHeadGroup);
    frozenCellsGroup.add(frozenCells);
    const hoverRowHeads = createHoverRowHeads({
        aiTable,
        coordinate: coordinateInstance,
        rowStartIndex,
        rowStopIndex
    });

    const otherRows = createOtherRows({
        aiTable,
        coordinate: coordinateInstance,
        rowStartIndex,
        rowStopIndex
    });
    frozenCellsGroup.add(...hoverRowHeads, ...otherRows);
    frozenGroup.add(frozenCellsGroup);
    const columnHeadGroup = new Konva.Group();
    columnHeadGroup.add(...columnHeads);
    const addFieldColumn = createAddFieldColumn(coordinateInstance, fields, columnStopIndex);
    if (addFieldColumn) {
        columnHeadGroup.add(addFieldColumn);
    }
    const cellsGroup = new Konva.Group();
    commonGroup.add(columnHeadGroup);
    cellsGroup.add(cells);
    commonGroup.add(cellsGroup);
    gridLayer.add(gridGroup);
    gridStage.add(gridLayer);
    return gridStage;
};
