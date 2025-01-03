import { AITableFieldType } from '../../../core';
import { DateField } from './date';
import { Field } from './field';

import { LinkField } from './link';
import { MemberField } from './member';
import { NumberField } from './number';
import { ProgressField } from './progress';
import { RateField } from './rate';
import { SelectField } from './select';
import { TextField } from './text';

export const ViewOperationMap: Record<AITableFieldType, Field> = {
    [AITableFieldType.text]: new TextField(),
    [AITableFieldType.richText]: new TextField(),
    [AITableFieldType.select]: new SelectField(),
    [AITableFieldType.date]: new DateField(),
    [AITableFieldType.createdAt]: new DateField(),
    [AITableFieldType.updatedAt]: new DateField(),
    [AITableFieldType.number]: new NumberField(),
    [AITableFieldType.rate]: new RateField(),
    [AITableFieldType.link]: new LinkField(),
    [AITableFieldType.member]: new MemberField(),
    [AITableFieldType.progress]: new ProgressField(),
    [AITableFieldType.createdBy]: new MemberField(),
    [AITableFieldType.updatedBy]: new MemberField()
};
