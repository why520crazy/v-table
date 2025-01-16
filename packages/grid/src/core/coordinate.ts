import { AITableCellMetaData, AITableCoordinate, AITableRowColumnType, AITableSizeMap } from '../types';

/**
 * 用于构建 Canvas 基础坐标系，后续的绘制工作以此为基础
 */
export class Coordinate {
    protected _rowHeight: number;
    public rowCount: number;
    public columnCount: number;
    public container: HTMLDivElement;
    public containerWidth: number;
    public containerHeight: number;
    // 用 index 映射 每一行的 高度
    public rowIndicesSizeMap: AITableSizeMap = {};
    // 用 index 映射 每一列 的 宽度
    public columnIndicesSizeMap: AITableSizeMap = {};
    // 除去表头和编号列真正单元格绘制的初始值 x
    public rowInitSize: number;
    // 除去表头和编号列真正单元格绘制的初始值 y
    public columnInitSize: number;
    // 行坐标集中最后一行的索引
    public lastRowIndex = -1;
    // 列坐标集中最后一列的索引
    public lastColumnIndex = -1;
    public rowMetaDataMap: Record<number, AITableCellMetaData> = {};
    public columnMetaDataMap: Record<number, AITableCellMetaData> = {};
    public frozenColumnCount: number;

    constructor({
        rowHeight,
        rowCount,
        columnCount,
        container,
        rowIndicesSizeMap = {},
        columnIndicesSizeMap = {},
        rowInitSize = 0,
        columnInitSize = 0,
        frozenColumnCount = 0
    }: AITableCoordinate) {
        this._rowHeight = rowHeight;
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.rowInitSize = rowInitSize;
        this.columnInitSize = columnInitSize;
        this.containerWidth = container.offsetWidth;
        this.rowIndicesSizeMap = rowIndicesSizeMap;
        this.columnIndicesSizeMap = columnIndicesSizeMap;
        this.containerHeight = container.offsetHeight;
        this.frozenColumnCount = frozenColumnCount;
        this.container = container;
    }

    public get rowHeight() {
        return this._rowHeight;
    }

    public set rowHeight(height: number) {
        this._rowHeight = height;
    }

    /**
     * 总宽度
     */
    public get totalWidth() {
        const { offset, size } = this.getCellMetaData(this.columnCount - 1, AITableRowColumnType.column);
        return offset + size;
    }

    /**
     * 总高度
     */
    public get totalHeight() {
        const { offset, size } = this.getCellMetaData(this.rowCount - 1, AITableRowColumnType.row);
        return offset + size;
    }

    /**
     * 根据 rowIndex 获取对应行高
     */
    public getRowHeight(index: number) {
        return this.rowIndicesSizeMap[index] ?? this.rowHeight;
    }

    /**
     * 根据 columnIndex 获取对应列宽
     */
    public getColumnWidth(index: number) {
        return this.columnIndicesSizeMap[index];
    }

    /**
     * 获取每个 cell 垂直/水平方向的坐标信息
     */
    protected getCellMetaData(index: number, itemType: AITableRowColumnType): AITableCellMetaData {
        let cellMetadataMap, lastMeasuredIndex, offset;
        const isColumnType = itemType === AITableRowColumnType.column;
        if (isColumnType) {
            offset = this.columnInitSize;
            lastMeasuredIndex = this.lastColumnIndex;
            cellMetadataMap = this.columnMetaDataMap;
        } else {
            offset = this.rowInitSize;
            lastMeasuredIndex = this.lastRowIndex;
            cellMetadataMap = this.rowMetaDataMap;
        }
        if (index > lastMeasuredIndex) {
            if (lastMeasuredIndex >= 0) {
                const itemMetadata = cellMetadataMap[lastMeasuredIndex];
                offset = itemMetadata.offset + itemMetadata.size;
            }

            for (let i = lastMeasuredIndex + 1; i <= index; i++) {
                const size = isColumnType ? this.columnIndicesSizeMap[i] : (this.rowIndicesSizeMap[i] ?? this.rowHeight);

                cellMetadataMap[i] = {
                    offset,
                    size
                };
                offset += size;
            }
            if (isColumnType) {
                this.lastColumnIndex = index;
            } else {
                this.lastRowIndex = index;
            }
        }
        return cellMetadataMap[index] || { size: 0, offset: 0 };
    }

    /**
     * 查找最近的单元格索引
     * 性能较差，但无论如何都可以找到
     */
    private _findNearestCellIndex(index: number, offset: number, itemType: AITableRowColumnType) {
        const itemCount = itemType === AITableRowColumnType.column ? this.columnCount : this.rowCount;
        let interval = 1;

        while (index < itemCount && this.getCellMetaData(index, itemType).offset < offset) {
            index += interval;
            interval *= 2;
        }

        return this._findNearestCellIndexByBinary(offset, Math.floor(index / 2), Math.min(index, itemCount - 1), itemType);
    }

    /**
     * 二分法查找最近的单元格索引
     * 性能更佳，但需要加载数据
     */
    private _findNearestCellIndexByBinary(offset: number, low: number, high: number, itemType: AITableRowColumnType) {
        while (low <= high) {
            const middle = low + Math.floor((high - low) / 2);
            const currentOffset = this.getCellMetaData(middle, itemType).offset;

            if (currentOffset === offset) {
                return middle;
            } else if (currentOffset < offset) {
                low = middle + 1;
            } else if (currentOffset > offset) {
                high = middle - 1;
            }
        }
        return low > -1 ? low - 1 : 0;
    }

    /**
     * 根据偏移量查找最近的单元格索引
     */
    public findNearestCellIndex(offset: number, itemType: AITableRowColumnType) {
        let lastIndex;
        if (itemType === AITableRowColumnType.column) {
            lastIndex = this.lastColumnIndex;
        } else {
            lastIndex = this.lastRowIndex;
        }
        const cellOffset = this.getCellMetaData(lastIndex, itemType).offset;
        const lastMeasuredItemOffset = lastIndex > 0 ? cellOffset : 0;

        if (lastMeasuredItemOffset >= offset) {
            return this._findNearestCellIndexByBinary(offset, 0, lastIndex, itemType);
        }
        return this._findNearestCellIndex(Math.max(0, lastIndex), offset, itemType);
    }

    /**
     * 根据垂直偏移量找到起始单元格的索引
     */
    public getRowStartIndex(offset: number) {
        return this.findNearestCellIndex(offset, AITableRowColumnType.row);
    }

    /**
     * 根据垂直起始单元格的索引查找结束单元格的索引
     */
    public getRowStopIndex(startIndex: number, scrollTop: number) {
        const itemMetadata = this.getCellMetaData(startIndex, AITableRowColumnType.row);
        const maxOffset = scrollTop + this.containerHeight;
        let offset = itemMetadata.offset + itemMetadata.size;
        let stopIndex = startIndex;

        while (stopIndex < this.rowCount - 1 && offset < maxOffset) {
            stopIndex++;
            offset += this.getCellMetaData(stopIndex, AITableRowColumnType.row).size;
        }
        return stopIndex;
    }

    /**
     * 根据水平偏移量找到起始单元格的索引
     */
    public getColumnStartIndex(offset: number) {
        return this.findNearestCellIndex(offset, AITableRowColumnType.column);
    }

    /**
     * 根据水平起始单元格的索引查找结束单元格的索引
     */
    public getColumnStopIndex(startIndex: number, scrollLeft: number) {
        const itemMetadata = this.getCellMetaData(startIndex, AITableRowColumnType.column);
        const maxOffset = scrollLeft + this.containerWidth;
        let offset = itemMetadata.offset + itemMetadata.size;
        let stopIndex = startIndex;

        while (stopIndex < this.columnCount - 1 && offset < maxOffset) {
            stopIndex++;
            offset += this.getCellMetaData(stopIndex, AITableRowColumnType.column).size;
        }
        return stopIndex;
    }

    /**
     * 根据 rowIndex 获取垂直偏移量
     */
    public getRowOffset(rowIndex: number) {
        return this.getCellMetaData(rowIndex, AITableRowColumnType.row).offset;
    }

    /**
     * 根据 columnIndex 获取水平偏移量
     */
    public getColumnOffset(columnIndex: number) {
        return this.getCellMetaData(columnIndex, AITableRowColumnType.column).offset;
    }

    /**
     * 冻结区域宽度
     */
    get frozenColumnWidth() {
        return this.getColumnOffset(this.frozenColumnCount) - this.columnInitSize;
    }

    /**
     * 根据 rowIndex, columnIndex 获取单元格坐标信息
     */
    public getCellRect(rowIndex: number, columnIndex: number) {
        const { size: height, offset: y } = this.getCellMetaData(rowIndex, AITableRowColumnType.row);
        const { size: width, offset: x } = this.getCellMetaData(columnIndex, AITableRowColumnType.column);
        return {
            x,
            y,
            width,
            height
        };
    }
}
