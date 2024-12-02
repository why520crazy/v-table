import { customAlphabet } from 'nanoid';
import { isNil, isNumber, isString, includes, values } from 'lodash';

export enum AlphabetType {
    url = 1,
    numbers = 2,
    lowercase = 3,
    uppercase = 4,
    alphanumeric = 5
}

export enum AlphabetDictionary {
    url = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-',
    numbers = '0123456789',
    lowercase = 'abcdefghijklmnopqrstuvwxyz',
    uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
}

const buildInAlphabets = {
    [AlphabetType.url]: customAlphabet(AlphabetDictionary.url),
    [AlphabetType.numbers]: customAlphabet(AlphabetDictionary.numbers),
    [AlphabetType.lowercase]: customAlphabet(AlphabetDictionary.lowercase),
    [AlphabetType.uppercase]: customAlphabet(AlphabetDictionary.uppercase),
    [AlphabetType.alphanumeric]: customAlphabet(AlphabetDictionary.alphanumeric)
};

/**
 * 使用nanoid实现
 * @param alphabet
 * @param size [number] id 长度  [6,32]之间 默认为6
 */
export function shortId(alphabet?: AlphabetType | string, size?: number): string;

/**
 * 使用nanoid实现
 * @param alphabet [string | AlphabetType] 默认为 AlphabetType.url
 * @param size [number] id 长度  [6,32]之间 默认为6
 * @param quantity [number]   id 个数
 */
export function shortId(alphabet?: AlphabetType | string, size?: number, quantity?: number): string[];

export function shortId(alphabet: AlphabetType | string = AlphabetType.url, size: number = 6, quantity?: number): string | string[] {
    if (size < 6 || size > 32) {
        throw new Error(`Invalid size "${size}", size must in 6-32`);
    }
    let idGenerator: (size?: number) => string;
    if (isNumber(alphabet)) {
        if (!includes(values(AlphabetType), alphabet)) {
            throw new Error(`Invalid alphabet "${alphabet}", alphabet must one of ${Object.values(AlphabetType).join(' ')}`);
        }
        idGenerator = buildInAlphabets[alphabet];
    } else if (isString(alphabet)) {
        idGenerator = customAlphabet(alphabet);
    } else {
        throw new Error(`Invalid alphabet "${alphabet}", alphabet type must be AlphabetType or string`);
    }
    if (!isNil(quantity)) {
        if (!isNumber(quantity)) {
            throw new Error(`Invalid quantity "${quantity}", quantity type must be number`);
        }
        const idTasks = Array.from({ length: quantity }, () => idGenerator(size));
        const ids = idTasks;
        return ids;
    }
    return idGenerator(size);
}
