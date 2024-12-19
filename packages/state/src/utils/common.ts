import { Path } from '@ai-table/grid';
import { isUndefinedOrNull, isEmpty as isArrayEmpty, isArray, isObject } from 'ngx-tethys/util';
import { AITableView, AITableViewFields, AITableViewRecords } from '../types';

export function isEmpty(value: any) {
    if (isArray(value)) {
        return isArrayEmpty(value);
    }

    if (isObject(value)) {
        return Reflect.ownKeys(value).length === 0;
    }

    return isUndefinedOrNull(value) || value === '';
}

export function isPathEqual(path: Path, another: Path): boolean {
    return path.length === another.length && path.every((n, i) => n === another[i]);
}

export function sortByViewPosition(data: AITableViewRecords | AITableViewFields, activeView: AITableView) {
    const hasPositions = data.every((item) => item.positions && item.positions);
    if (hasPositions) {
        return [...data].sort((a, b) => a.positions[activeView._id] - b.positions[activeView._id]);
    }
    return data;
}
