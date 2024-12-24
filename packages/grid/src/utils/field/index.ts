import { AITableFieldType } from '../../index';
import { Field } from './field';
import { LinkField } from './link';
import { MemberField } from './member';
import { SelectField } from './select';
import { TextField } from './text';

export const ViewOperationMap: Record<AITableFieldType, Field> = {
    [AITableFieldType.text]: new TextField(),
    [AITableFieldType.richText]: new TextField(),
    [AITableFieldType.select]: new SelectField(),
    [AITableFieldType.date]: new TextField(),
    [AITableFieldType.createdAt]: new TextField(),
    [AITableFieldType.updatedAt]: new TextField(),
    [AITableFieldType.number]: new TextField(),
    [AITableFieldType.rate]: new TextField(),
    [AITableFieldType.link]: new LinkField(),
    [AITableFieldType.member]: new MemberField(),
    [AITableFieldType.progress]: new TextField(),
    [AITableFieldType.createdBy]: new MemberField(),
    [AITableFieldType.updatedBy]: new MemberField()
};
