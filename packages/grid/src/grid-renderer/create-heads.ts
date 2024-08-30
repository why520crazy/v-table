import Konva from 'konva';
import {
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_ROW_HEAD_WIDTH,
    Colors,
    DEFAULT_COLUMN_WIDTH
} from '../constants';
import { AITableField } from '../core/types';
import { AITableCheckType, AITableCreateHeadsOptions } from '../types';
import { createFieldHead } from './field-head';
import { createIcon } from './icon';

export const createColumnHeads = (props: AITableCreateHeadsOptions) => {
    const { fields, instance, columnStartIndex, columnStopIndex } = props;
    const colors = Colors;
    const { columnCount, frozenColumnWidth, frozenColumnCount, rowInitSize: fieldHeadHeight } = instance;

    const getColumnHeadStatus = (field: AITableField, columnIndex: number) => {
        const iconVisible = false;
        const isSelected = false;
        return {
            iconVisible,
            isSelected
        };
    };

    const getColumnHead = (columnStartIndex: number, columnStopIndex: number) => {
        const _fieldHeads: Konva.Group[] = [];
        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) break;
            if (columnIndex < 0) continue;
            const field = fields[columnIndex];
            if (field == null) continue;
            const x = instance.getColumnOffset(columnIndex);
            const columnWidth = instance.getColumnWidth(columnIndex) ?? DEFAULT_COLUMN_WIDTH;
            const { iconVisible, isSelected } = getColumnHeadStatus(field, columnIndex);
            const fieldHead = createFieldHead({
                x,
                y: 0,
                width: columnWidth,
                height: fieldHeadHeight,
                field,
                stroke: columnIndex === 0 ? colors.transparent : undefined,
                isSelected: isSelected,
                operationVisible: iconVisible
            });

            _fieldHeads.push(fieldHead);
        }
        return _fieldHeads;
    };

    const getFrozenColumnHead = () => {
        const isChecked = false;
        const head = getColumnHead(0, frozenColumnCount - 1);
        const headGroup = [];
        const rect = new Konva.Rect({
            x: 0.5,
            y: 0.5,
            width: AI_TABLE_ROW_HEAD_WIDTH + 1,
            height: fieldHeadHeight,
            fill: colors.white,
            cornerRadius: [8, 0, 0, 0],
            listening: false
        });
        const icon = createIcon({
            name: AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
            x: 28,
            y: (fieldHeadHeight - AI_TABLE_ICON_COMMON_SIZE) / 2,
            type: isChecked ? AITableCheckType.checked : AITableCheckType.unchecked,
            fill: isChecked ? colors.primary : colors.gray300
        });
        const rect1 = new Konva.Rect({
            x: 0.5,
            y: 0.5,
            width: frozenColumnWidth + AI_TABLE_ROW_HEAD_WIDTH,
            height: fieldHeadHeight,
            stroke: colors.gray200,
            strokeWidth: 1,
            fill: colors.transparent,
            cornerRadius: [8, 0, 0, 0],
            listening: false
        });
        headGroup.push(rect, icon, ...head, rect1);

        return headGroup;
    };

    /**
     * 绘制其他列标题
     */
    const columnHeads = getColumnHead(Math.max(columnStartIndex, frozenColumnCount), columnStopIndex);

    const frozenColumnHead = getFrozenColumnHead();

    return {
        columnHeads,
        frozenColumnHead
    };
};