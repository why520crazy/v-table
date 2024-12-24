import { AITableField, AITableReferences, isEmpty } from '../../index';
import { Field } from './field';

export class TextField extends Field {
    cellFullText(transformValue: any, field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue)) {
            fullText.push(String(transformValue));
        }
        return fullText;
    }
}
