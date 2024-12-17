import { AITableFieldType } from '@ai-table/grid';
import { Field } from './field';
import { TextField } from './text';
import { SelectField } from './select';
import { DateField } from './date';
import { NumberField } from './number';
import { RateField } from './rate';
import { LinkField } from './link';

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
    [AITableFieldType.member]: new SelectField(),
    [AITableFieldType.progress]: new NumberField(),
    [AITableFieldType.createdBy]: new SelectField(),
    [AITableFieldType.updatedBy]: new SelectField()
};
