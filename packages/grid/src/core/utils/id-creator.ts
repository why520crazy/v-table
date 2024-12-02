import ObjectID from 'bson-objectid';
import { shortId } from './shoft-id';

export function idCreator() {
    return ObjectID().toHexString();
}

export function idsCreator(count: number) {
    if (count <= 0) return [];
    const newIds: string[] = [];
    for (let i = 0; i < count; i++) {
        newIds.push(idCreator());
    }
    return newIds;
}

export function shortIdCreator() {
    return shortId(undefined, 8);
}

export function shortIdsCreator(count: number) {
    return shortId(undefined, 8, count);
}
