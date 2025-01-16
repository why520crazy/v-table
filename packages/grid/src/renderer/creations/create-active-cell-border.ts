import { RectConfig } from 'konva/lib/shapes/Rect';
import { AI_TABLE_CELL_BORDER, AI_TABLE_OFFSET } from '../../constants';
import { AITable } from '../../core';
import { AITableCellsConfig, AITableRowType } from '../../types';
import { getCellHorizontalPosition } from '../../utils';

export const createActiveCellBorder = (config: AITableCellsConfig) => {
    const { aiTable, coordinate, columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = config;
    const { linearRows } = aiTable.context!;
    const { rowHeight, frozenColumnCount } = coordinate;
    const colors = AITable.getColors();
    const visibleColumns = AITable.getVisibleFields(aiTable);
    const activeCell = AITable.getActiveCell(aiTable);
    const totalColumnCount = visibleColumns.length;

    let activeCellBorder: RectConfig | null = null;
    let frozenActiveCellBorder: RectConfig | null = null;

    if (
        Array.isArray(activeCell) &&
        !!activeCell.length &&
        aiTable.context!.visibleRowsIndexMap().has(activeCell[0]) &&
        aiTable.context!.visibleColumnsIndexMap().has(activeCell[1])
    ) {
        const fieldId = activeCell[1];
        const { rowIndex, columnIndex } = AITable.getCellIndex(aiTable, activeCell)!;

        const checkIsVisible = (rowIndex: number, columnIndex: number) => {
            if (columnIndex < frozenColumnCount) {
                return true;
            }
            return (
                rowIndex >= rowStartIndex && rowIndex <= rowStopIndex && columnIndex >= columnStartIndex && columnIndex <= columnStopIndex
            );
        };

        if (rowIndex != null && columnIndex != null && checkIsVisible(rowIndex, columnIndex)) {
            const { type } = linearRows()[rowIndex];

            if (type === AITableRowType.record) {
                const activeField = visibleColumns.find((field) => field._id === fieldId);
                if (activeField == null) {
                    return {
                        activeCellBorder,
                        frozenActiveCellBorder
                    };
                }

                const x = coordinate.getColumnOffset(columnIndex);
                const y = coordinate.getRowOffset(rowIndex);
                const columnWidth = coordinate.getColumnWidth(columnIndex);
                const isFrozenColumn = columnIndex < frozenColumnCount;
                const { offset, width } = getCellHorizontalPosition({
                    columnWidth,
                    columnIndex,
                    columnCount: totalColumnCount
                });
                // active 外边界和非 active 外边界 box 大小保持一致
                const currentConfig = {
                    x: x + offset + AI_TABLE_OFFSET,
                    y: y + AI_TABLE_OFFSET,
                    width: width - AI_TABLE_CELL_BORDER / 2,
                    height: rowHeight - AI_TABLE_CELL_BORDER / 2,
                    strokeWidth: AI_TABLE_CELL_BORDER,
                    stroke: colors.primary,
                    fillEnabled: false,
                    listening: false
                };

                if (isFrozenColumn) {
                    frozenActiveCellBorder = currentConfig;
                } else {
                    activeCellBorder = currentConfig;
                }
            }
        }
    }

    return {
        activeCellBorder,
        frozenActiveCellBorder
    };
};
