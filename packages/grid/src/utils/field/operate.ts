import { isEmpty } from '../common';

export const zhIntlCollator = typeof Intl !== 'undefined' ? new Intl.Collator('zh-CN') : undefined;

export function compareNumber(a: number, b: number): number {
    if (isEmpty(a) && isEmpty(b)) {
        return 0;
    }
    if (isEmpty(a)) {
        return -1;
    }
    if (isEmpty(b)) {
        return 1;
    }
    return a === b ? 0 : a > b ? 1 : -1;
}

export function compareString(a: string | null, b: string | null): number {
    if (a === b) {
        return 0;
    }
    if (a == null) {
        return -1;
    }
    if (b == null) {
        return 1;
    }

    //  pinyin sort
    return a === b ? 0 : zhIntlCollator ? zhIntlCollator.compare(a, b) : a.localeCompare(b, 'zh-CN') > 0 ? 1 : -1;
}

export function stringInclude(str: string, searchStr: string) {
    return str.toLowerCase().includes(searchStr.trim().toLowerCase());
}

/**
 * 两数组是否有交集
 */
export function hasIntersect<T extends number | string>(array1: T[], array2: T[]) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false;
    }
    const set1 = new Set(array1);
    const set2 = new Set(array2);
    for (const element of set1) {
        if (set2.has(element)) {
            return true;
        }
    }
    return false;
}
