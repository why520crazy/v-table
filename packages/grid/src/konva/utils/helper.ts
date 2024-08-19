import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH } from '../constants/grid';

/**
 * Generate the targetName of the graph based on the incoming information
 */
export const generateTargetName = ({ targetName, fieldId, recordId, mouseStyle }: any) => {
    const flag = '$';
    return `${targetName}-${fieldId || flag}-${recordId || flag}-${mouseStyle || flag}`;
};

/**
 * Parse targetName for built-in information
 */
export const getDetailByTargetName = (_targetName: string | null) => {
    if (_targetName == null) {
        return {
            targetName: null,
            fieldId: null,
            recordId: null,
            mouseStyle: null
        };
    }

    const flag = '$';
    const [targetName, fieldId, recordId, mouseStyle] = _targetName.split('-');
    return {
        targetName,
        fieldId: fieldId === flag ? null : fieldId,
        recordId: recordId === flag ? null : recordId,
        mouseStyle: mouseStyle === flag ? null : mouseStyle
    };
};

export const getCellOffsetLeft = (depth: number) => {
    if (!depth) return 0;
    if (depth > 1) return (depth - 1) * GRID_GROUP_OFFSET;
    return 0;
};

export const isWithinFrozenColumnBoundary = (x: number, depth: number, frozenColumnWidth: number) => {
    const offset = getCellOffsetLeft(depth);
    const max = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
    const min = GRID_ROW_HEAD_WIDTH + offset;
    return x > min && x < max;
};

function getParentNodeByOneClass(element: HTMLElement, className: string) {
    return element.closest(`.${className}`) as HTMLElement | null;
}

/**
 * @description
 * @export
 * @param {HTMLElement} element
 * @param {(string | string[])} className
 * @returns
 */
export function getParentNodeByClass(element: HTMLElement, className: string | string[]): HTMLElement | null | undefined {
    if (!element || !className || !className.length) {
        return null;
    }

    if (Array.isArray(className)) {
        if (className.length === 1) {
            return getParentNodeByOneClass(element, className[0]);
        }
        for (const cn of className) {
            const ele = getParentNodeByOneClass(element, cn);
            if (ele) {
                return ele;
            }
        }
        return null;
    }
    return getParentNodeByOneClass(element, className);
}
