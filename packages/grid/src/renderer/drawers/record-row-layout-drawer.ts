import { AI_TABLE_FIELD_HEAD_HEIGHT, AI_TABLE_OFFSET, AI_TABLE_ROW_HEAD_WIDTH, DEFAULT_FONT_SIZE } from '../../constants';
import { DEFAULT_TEXT_ALIGN_CENTER, DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE } from '../../constants/text';
import { AITable } from '../../core';
import { AITableFirstCell } from '../../types';
import { Layout } from './layout-drawer';

/**
 * 绘制行的布局，通过直接操作 Canvas 提供高效的渲染方法。
 * 它继承自 Layout 类，包含了用于绘制行中单元格（尤其是首列和尾列）的几个方法
 */
export class RecordRowLayout extends Layout {
    // 首列
    private renderFirstCell({ row, style }: AITableFirstCell) {
        if (!this.isFirst) return;

        const { fill } = style;
        const y = this.y;
        const rowHeight = this.rowHeight;
        const columnWidth = this.columnWidth;
        const colors = AITable.getColors();

        // 背景、边框
        this.customRect({
            x: 0,
            y,
            width: AI_TABLE_ROW_HEAD_WIDTH + columnWidth + AI_TABLE_OFFSET,
            height: rowHeight,
            fill: fill,
            strokes: {
                top: colors.gray200,
                right: colors.gray200,
                bottom: colors.gray200
            }
        });
        this.customRect({
            x: 1,
            y,
            width: AI_TABLE_ROW_HEAD_WIDTH - AI_TABLE_OFFSET,
            height: rowHeight,
            fill: fill,
            strokes: {
                right: colors.gray200
            }
        });
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

    // 尾列
    private renderLastCell({ style }: Pick<AITableFirstCell, 'style'>) {
        if (!this.isLast || this.isFirst) return;

        const { fill, stroke } = style;
        const columnWidth = this.columnWidth;
        const width = columnWidth;
        const colors = AITable.getColors();

        // 背景、边框
        this.rect({
            x: this.x,
            y: this.y,
            width,
            height: this.rowHeight,
            fill: fill || colors.white,
            stroke: stroke || colors.gray200
        });
    }

    // 绘制中间的普通单元格
    private renderCommonCell({ style }: Pick<AITableFirstCell, 'style'>) {
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

    render(config: AITableFirstCell) {
        const { row, style } = config;

        this.renderFirstCell({ row, style });
        this.renderCommonCell({ style });
        this.renderLastCell({ style });
    }
}

export const recordRowLayout = new RecordRowLayout();
