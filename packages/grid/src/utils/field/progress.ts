import { AITableField, isEmpty } from '../../index';
import { Field } from './field';

export class ProgressField extends Field {
    cellFullText(transformValue: number, field: AITableField): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue)) {
            fullText.push(`${transformValue}%`);
        }
        return fullText;
    }
}
