import {
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_ADD_BUTTON,
    DEFAULT_FONT_STYLE
} from '../../constants';
import { AITable, AITableQueries, RendererContext } from '../../core';
import { AITableCellsDrawerConfig, AITableRender, AITableRowType } from '../../types';
import { getCellHorizontalPosition, transformCellValue } from '../../utils';
import { addRowLayout } from '../drawers/add-row-layout-drawer';
import { cellDrawer } from '../drawers/cell-drawer';
import { recordRowLayout } from '../drawers/record-row-layout-drawer';

/**
 * 绘制单元格内容的函数
 * 利用 Canvas API 绘制每个单元格的背景颜色、文本以及其他可能的样式。这个函数通常用于自定义表格渲染，尤其是在处理大量数据时，通过直接操作 Canvas 来提高渲染性能
 * @param config
 */
export const createCells = (config: AITableCellsDrawerConfig) => {
    const { aiTable, coordinate, references, ctx, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = config;
    const context = aiTable.context as RendererContext;
    const { rowHeight, columnCount, rowCount } = coordinate;
    const colors = AITable.getColors();
    const visibleColumns = AITable.getVisibleFields(aiTable);

    // 初始化绘图上下文, 为后续的绘制操作做准备
    cellDrawer.initCtx(ctx as CanvasRenderingContext2D);
    addRowLayout.initCtx(ctx as CanvasRenderingContext2D);
    recordRowLayout.initCtx(ctx as CanvasRenderingContext2D);

    // 遍历列, 确定在哪些列上绘制单元格
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;

        // 获取该列对应的 field，如果 field 不再展示范围，则跳过该列
        const field = visibleColumns[columnIndex];
        if (field == null) continue;

        // 获取该列对应的宽度
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const x = coordinate.getColumnOffset(columnIndex) + AI_TABLE_OFFSET;
        const isLastColumn = columnIndex === aiTable.fields.length - 1;

        if (columnIndex === 1) {
            cellDrawer.initStyle(field, { fontWeight: DEFAULT_FONT_STYLE });
        }

        // 遍历行, 从 rowStartIndex 到 rowStopIndex 的所有行，决定将在哪些行上绘制单元格
        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
            if (rowIndex > rowCount - 1) break;
            const row = context.linearRows()[rowIndex];
            const { _id: recordId, type } = row;
            const y = coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
            const { rowIndex: pointRowIndex, targetName } = context.pointPosition();
            const isHover = pointRowIndex === rowIndex;

            switch (type) {
                case AITableRowType.add: {
                    const isHoverRow = isHover && targetName === AI_TABLE_ROW_ADD_BUTTON;
                    const isCheckedRow = aiTable.selection().selectedRecords.has(row._id);
                    addRowLayout.init({
                        x,
                        y,
                        rowIndex,
                        columnIndex,
                        columnWidth,
                        rowHeight: AI_TABLE_FIELD_HEAD_HEIGHT,
                        columnCount,
                        containerWidth: coordinate.containerWidth
                    });
                    addRowLayout.render({
                        isHoverRow,
                        isCheckedRow
                    });
                    break;
                }
                case AITableRowType.record: {
                    let background = colors.white;
                    const fieldId = field._id;
                    const isCheckedRow = aiTable.selection().selectedRecords.has(row._id);
                    const isSelected = aiTable.selection().selectedFields.has(fieldId);
                    const isHoverRow = isHover && targetName !== AI_TABLE_FIELD_HEAD;
                    const activeCell = AITable.getActiveCell(aiTable);
                    const isSiblingActiveCell = recordId === activeCell?.recordId && fieldId !== activeCell?.fieldId;
                    const isActiveCell = recordId === activeCell?.recordId;

                    let matchedCellsMap: { [key: string]: boolean } = {};
                    aiTable.matchedCells().forEach((key) => {
                        matchedCellsMap[key] = true;
                    });
                    const isMatchedCell = matchedCellsMap[`${recordId}-${fieldId}`];

                    if (isMatchedCell) {
                        background = colors.itemMatchBgColor;
                    } else if (isCheckedRow || isSelected || isSiblingActiveCell) {
                        background = colors.itemActiveBgColor;
                    } else if (isHoverRow && !isActiveCell) {
                        background = colors.gray80;
                    }
                    recordRowLayout.init({
                        x,
                        y,
                        rowIndex,
                        columnIndex,
                        columnWidth,
                        rowHeight,
                        columnCount,
                        containerWidth: coordinate.containerWidth
                    });
                    recordRowLayout.render({
                        row,
                        style: { fill: background },
                        isHoverRow,
                        isCheckedRow
                    });
                    const { width, offset } = getCellHorizontalPosition({
                        columnIndex,
                        columnWidth,
                        columnCount
                    });
                    const realX = x + offset + AI_TABLE_OFFSET;
                    const realY = y + AI_TABLE_OFFSET;
                    const style = { fontWeight: DEFAULT_FONT_STYLE };
                    const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, fieldId]);
                    const transformValue = transformCellValue(aiTable, field, cellValue);
                    const render = {
                        aiTable,
                        x: realX,
                        y: realY,
                        columnWidth: width,
                        rowHeight,
                        recordId: recordId,
                        field,
                        cellValue,
                        transformValue,
                        references,
                        isActive: isSelected,
                        style,
                        colors
                    };

                    cellDrawer.initStyle(field, style);
                    // 最后一列，且单元格内容存在，需要裁剪内容，以防止文本溢出单元格边界
                    // 然后，根据计算好的样式和布局绘制单元格内容
                    if (isLastColumn && cellValue != null) {
                        ctx.save();
                        ctx.rect(realX, realY, width, rowHeight);
                        ctx.clip();
                        cellDrawer.renderCell(render as AITableRender, ctx as CanvasRenderingContext2D);
                        ctx.restore();
                    } else {
                        cellDrawer.renderCell(render as AITableRender, ctx as CanvasRenderingContext2D);
                    }
                }
            }
        }
    }
};
