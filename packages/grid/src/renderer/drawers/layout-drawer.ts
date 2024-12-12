import { AI_TABLE_FIELD_ADD_BUTTON_WIDTH, AI_TABLE_OFFSET } from '../../constants/table';
import { AITableCell, AITableLayout } from '../../types';
import { Drawer } from './drawer';

/**
 * 用于处理表格行或单元格的布局和绘制。
 * 它提供了基本的布局信息（如位置、大小等），并定义了常用的绘图方法（如渲染缩进区域、添加新字段的空白区域等）。
 * 该类继承自 Drawer，并被其他更具体的布局类（如 RecordRowLayout）扩展和使用
 */
export class Layout extends Drawer {
    // 定义当前单元格或行的位置
    protected x = 0;
    protected y = 0;
    // 行高
    protected rowHeight = 0;
    // 列宽
    protected columnWidth = 0;
    // 行索引
    protected rowIndex = 0;
    // 列索引
    protected columnIndex = 0;
    // 列数
    protected columnCount = 0;

    protected containerWidth = 0;

    // 用于初始化或重置布局的基本属性。这个方法通常在每次渲染新的一行或单元格时调用，确保布局信息是最新的
    init({ x, y, rowIndex, columnIndex, rowHeight, columnWidth, columnCount, containerWidth }: AITableLayout) {
        this.x = x;
        this.y = y;
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.rowHeight = rowHeight;
        this.columnWidth = columnWidth;
        this.columnCount = columnCount;
        this.containerWidth = containerWidth;
    }

    // 当前单元格是否是行的第一列
    protected get isFirst() {
        return this.columnIndex === 0;
    }

    // 当前单元格是否是行的最后一列
    protected get isLast() {
        return this.columnIndex === this.columnCount - 1;
    }

    protected renderAddFieldBlank({ isHoverRow, isCheckedRow }: Pick<AITableCell, 'isHoverRow' | 'isCheckedRow'>) {
        const rowHeight = this.rowHeight;
        const fill = isCheckedRow ? this.colors.itemActiveBgColor : isHoverRow ? this.colors.gray80 : this.colors.transparent;
        const addFieldBlankX = this.x + this.columnWidth + AI_TABLE_OFFSET;
        this.rect({
            x: addFieldBlankX,
            y: this.y + AI_TABLE_OFFSET,
            width:
                this.containerWidth - addFieldBlankX < AI_TABLE_FIELD_ADD_BUTTON_WIDTH
                    ? AI_TABLE_FIELD_ADD_BUTTON_WIDTH
                    : this.containerWidth - addFieldBlankX,
            height: rowHeight,
            fill
        });
    }
}
