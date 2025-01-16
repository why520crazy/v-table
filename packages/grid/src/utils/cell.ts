import { AITable, AITableField, AITableFieldOption, FieldValue, getFieldOptionByField } from '../core';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP } from '../services';
import { AITableSizeMap } from '../types';

export function getColumnIndicesSizeMap(fields: AITableField[]) {
    const columnIndicesSizeMap: AITableSizeMap = {};
    fields?.forEach((field, index) => {
        columnIndicesSizeMap[index] = field.width ?? (getFieldOptionByField(field) as AITableFieldOption).width;
    });
    return columnIndicesSizeMap;
}

/**
 * 获取单元格位置
 * 根据单元格是否是第一列/最后一列确定单元格所在的位置
 */
export function getCellHorizontalPosition(options: { columnWidth: number; columnIndex: number; columnCount: number }) {
    const { columnWidth } = options;
    return { width: columnWidth, offset: 0 };
}

export function transformCellValue<T = any>(aiTable: AITable, field: AITableField, cellValue: FieldValue): T {
    const fieldService = AI_TABLE_GRID_FIELD_SERVICE_MAP.get(aiTable);

    if (!fieldService) {
        return cellValue;
    }

    const fieldRenderers = fieldService.aiFieldConfig?.fieldRenderers;
    if (!fieldRenderers) {
        return cellValue;
    }

    const cellTransform = fieldRenderers[field.type]?.transform;
    if (!cellTransform) {
        return cellValue;
    }

    const cellText = cellTransform(field, cellValue);

    if (cellText == null) {
        return cellValue;
    }

    return cellText;
}

/**
 * `\u4e00`: https://www.compart.com/en/unicode/U+4E00
 * `\u9fa5`: https://www.compart.com/en/unicode/U+9FA5
 */
const UNIFIED_IDEOGRAPHS_REGEX = /^[\u4e00-\u9fa5]+$/;

const SET_OF_LETTERS_REGEX = /^[a-zA-Z\/ ]+$/;

export function getAvatarShortName(name: string | null | undefined): string {
    if (!name) {
        return '';
    }

    name = name.trim();

    if (UNIFIED_IDEOGRAPHS_REGEX.test(name) && name.length > 2) {
        return name.slice(name.length - 2);
    }

    if (SET_OF_LETTERS_REGEX.test(name) && name.indexOf(' ') > 0) {
        const words: string[] = name.split(' ');
        return (words[0].slice(0, 1) + words[1].slice(0, 1)).toUpperCase();
    }

    return name.length > 2 ? name.slice(0, 2).toUpperCase() : name.toUpperCase();
}

export function getAvatarBgColor(name: string) {
    if (!name) {
        return;
    }
    const colors = ['#56abfb', '#5dcfff', '#84e17e', '#73d897', '#ff9f73', '#fa8888', '#fb7fb7', '#9a7ef4', '#868af6'];
    const nameArray: string[] = name.split('');
    const code: number =
        name && name.length > 0
            ? nameArray.reduce(
                  function (result, item) {
                      result.value += item.charCodeAt(0);
                      return result;
                  },
                  { value: 0 }
              ).value
            : 0;
    return colors[code % 9];
}
