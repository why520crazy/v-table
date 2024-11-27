import { AI_TABLE_FIELD_HEAD, AI_TABLE_FIELD_HEAD_MORE, Colors } from '../../constants';
import { AITableColumnHeadsConfig, AITableFieldHeadConfig } from '../../types';

export const createColumnHeads = (config: AITableColumnHeadsConfig) => {
    const { coordinate, columnStartIndex, columnStopIndex, pointPosition, aiTable } = config;
    const colors = Colors;
    const { columnCount, rowInitSize: fieldHeadHeight } = coordinate;
    const { columnIndex: pointColumnIndex, targetName: pointTargetName } = pointPosition;
    const { fields } = aiTable;

    const getFieldHeadStatus = (fieldId: string) => {
        const iconVisible =
            [AI_TABLE_FIELD_HEAD, AI_TABLE_FIELD_HEAD_MORE].includes(pointTargetName) && fields()[pointColumnIndex]?._id === fieldId;
        const isHoverIcon = pointTargetName === AI_TABLE_FIELD_HEAD_MORE && fields()[pointColumnIndex]?._id === fieldId;
        const isSelected = aiTable.selection().selectedFields.has(fieldId);
        return {
            iconVisible,
            isSelected,
            isHoverIcon
        };
    };

    const fieldHeads: AITableFieldHeadConfig[] = [];
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;
        if (columnIndex < 0) continue;
        const field = fields()[columnIndex];
        if (field == null) continue;
        const x = coordinate.getColumnOffset(columnIndex);
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const { iconVisible, isSelected, isHoverIcon } = getFieldHeadStatus(field._id);
        const fieldHead = {
            x,
            y: 0,
            width: columnWidth,
            height: fieldHeadHeight,
            field,
            stroke: columnIndex === 0 ? colors.transparent : undefined,
            iconVisible,
            isSelected,
            isHoverIcon
        };

        fieldHeads.push(fieldHead);
    }
    return fieldHeads;
};
