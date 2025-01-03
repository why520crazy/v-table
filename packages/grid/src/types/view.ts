import { Id } from 'ngx-tethys/types';

export enum AITableFilterOperation {
    eq = 'eq',
    gte = 'gte',
    lte = 'lte',
    gt = 'gt',
    lt = 'lt',
    in = 'in',
    contain = 'contain',
    ne = 'ne',
    nin = 'nin',
    between = 'between',
    besides = 'besides',
    empty = 'empty',
    exists = 'exists',
    notContain = 'not_contain'
}

export interface AITableFilterCondition<TValue = unknown> {
    field_id: Id;
    operation: AITableFilterOperation;
    value: TValue;
}
