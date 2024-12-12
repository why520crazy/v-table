import {
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_HEAD_WIDTH,
    DEFAULT_FONT_SIZE
} from '../../constants';
import { DEFAULT_TEXT_ALIGN_CENTER, DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE } from '../../constants/text';
import { AITable } from '../../core';
import { AITableCell } from '../../types';
import { Layout } from './layout-drawer';

/**
 * 绘制行的布局，通过直接操作 Canvas 提供高效的渲染方法。
 * 它继承自 Layout 类，包含了用于绘制行中单元格（尤其是首列和尾列）的几个方法
 */
export class RecordRowLayout extends Layout {
    // 首列
    private renderFirstCell({ row, style, isHoverRow, isCheckedRow }: AITableCell) {
        if (!this.isFirst) return;

        const { fill } = style;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const colors = AITable.getColors();
        // 编号的上下边框
        let fillBg = colors.transparent;
        if (isCheckedRow) {
            fillBg = colors.itemActiveBgColor;
        } else if (isHoverRow) {
            fillBg = colors.gray80;
        }
        this.customRect({
            x: AI_TABLE_OFFSET,
            y,
            width: AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OFFSET,
            height: rowHeight,
            fill: fillBg,
            strokes: {
                right: colors.gray200,
                bottom: colors.gray200
            }
        });
        // 第一列单元格
        this.rect({
            x: AI_TABLE_ROW_HEAD_WIDTH,
            y,
            width: columnWidth + AI_TABLE_OFFSET,
            height: rowHeight,
            fill: fill,
            stroke: colors.gray200
        });

        if (!isCheckedRow && !isHoverRow) {
            // 设置字体样式，居中绘制行号
            this.setStyle({ fontSize: DEFAULT_FONT_SIZE });
            this.text({
                x: AI_TABLE_ROW_HEAD_WIDTH / 2,
                y: y + AI_TABLE_FIELD_HEAD_HEIGHT / 2,
                text: String(row.displayIndex),
                textAlign: DEFAULT_TEXT_ALIGN_CENTER,
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
            });
        }
    }

    // 尾列
    private renderLastCell({ style, isHoverRow, isCheckedRow }: Pick<AITableCell, 'style' | 'isHoverRow' | 'isCheckedRow'>) {
        if (!this.isLast || this.isFirst) return;

        const { fill, stroke } = style;
        const colors = AITable.getColors();

        // 背景、边框
        this.rect({
            x: this.x,
            y: this.y,
            width: this.columnWidth,
            height: this.rowHeight,
            fill: fill || colors.white,
            stroke: stroke || colors.gray200
        });

        // 延伸到 FIELD_ADD_BUTTON
        super.renderAddFieldBlank({ isHoverRow, isCheckedRow });
        const rowHeight = this.rowHeight;
        const startX = this.x + this.columnWidth;
        const lineWidth =
            this.containerWidth - startX < AI_TABLE_FIELD_ADD_BUTTON_WIDTH ? AI_TABLE_FIELD_ADD_BUTTON_WIDTH : this.containerWidth - startX;
        this.line({
            x: startX,
            y: this.y,
            points: [0, rowHeight, lineWidth, rowHeight],
            stroke: this.colors.gray200
        });
    }

    // 绘制中间的普通单元格
    private renderCommonCell({ style }: Pick<AITableCell, 'style'>) {
        if (this.isFirst || this.isLast) return;

        const { fill, stroke } = style;
        const colors = AITable.getColors();

        // 背景、边框
        this.rect({
            x: this.x,
            y: this.y,
            width: this.columnWidth,
            height: this.rowHeight,
            fill: fill || colors.white,
            stroke: stroke || colors.gray200
        });
    }

    render(config: AITableCell) {
        const { row, style, isCheckedRow, isHoverRow } = config;
        this.renderFirstCell({ row, style, isCheckedRow, isHoverRow });
        this.renderCommonCell({ style });
        this.renderLastCell({ style, isCheckedRow, isHoverRow });
    }
}

export const recordRowLayout = new RecordRowLayout();
