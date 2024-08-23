import Konva from 'konva';
import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE,
    AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH,
    AI_TABLE_ICON_COMMON_SIZE,
    DEFAULT_FONT_SIZE
} from '../constants';
import { AITable } from '../core';
import { AITableFieldHeadOptions } from '../types';
import { generateTargetName, TextMeasure } from '../utils';
import { createFieldIcon } from './field-icon';
import { createText } from './text';

export const createFieldHead = (options: AITableFieldHeadOptions) => {
    const colors = AITable.getColors();
    const textMeasure = TextMeasure();
    const { x = 0, y = 0, width, field, height: headHeight, stroke, operationVisible, isSelected } = options;
    const { _id: fieldId, name: _fieldName } = field;
    const textOffset = AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE;

    let availableTextWidth =
        width -
        (operationVisible
            ? 2 * (AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE)
            : 2 * AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE);

    // 在 "默认列标题高度" 模式下，换行符将转换为空格以便完整显示.
    const fieldName = _fieldName.replace(/\r|\n/g, ' ');

    const getTextData = () => {
        textMeasure.setFont({ fontSize: DEFAULT_FONT_SIZE });
        const { width, height, isOverflow } = textMeasure.measureText(fieldName, availableTextWidth, 1);
        return {
            width: Math.min(width, availableTextWidth),
            height,
            isOverflow
        };
    };

    const group = new Konva.Group({ x: x, y: y });
    const rect = new Konva.Rect({
        x: 0.5,
        y: 0.5,
        name: generateTargetName({
            targetName: AI_TABLE_FIELD_HEAD,
            fieldId
        }),
        width: width,
        height: headHeight,
        fill: isSelected ? colors.activeBackground : colors.defaultBackground,
        stroke: stroke || colors.defaultBorderStroke,
        strokeWidth: 1,
        onMouseEnter: () => {},
        onMouseOut: () => {}
    });

    const fieldIcon = createFieldIcon({
        fieldType: field.type,
        x: AI_TABLE_CELL_PADDING,
        y: (headHeight - AI_TABLE_ICON_COMMON_SIZE) / 2,
        width: AI_TABLE_ICON_COMMON_SIZE,
        height: AI_TABLE_ICON_COMMON_SIZE,
        fill: colors.defaultFieldIconFill
    });

    const textData = getTextData();
    const text = createText({
        x: textOffset,
        y: undefined,
        width: Math.max(textData.width, AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH),
        height: headHeight + 2,
        text: fieldName,
        lineHeight: 1.84
    });

    group.add(rect);
    group.add(fieldIcon);
    group.add(text);

    return group;
};
