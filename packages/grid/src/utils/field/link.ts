import { AITableField, LinkFieldValue } from '../../index';
import { Field } from './field';
import { isEmpty } from '../common';

export class LinkField extends Field {
    override cellFullText(transformValue: LinkFieldValue, field: AITableField): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue?.text)) {
            fullText.push(transformValue.text);
        }
        return fullText;
    }
}
