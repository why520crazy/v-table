import { AITableField } from '../../index';
import { Field } from './field';

export class ProgressField extends Field {
    override cellFullText(transformValue: number, field: AITableField): string[] {
        const fullText = `${transformValue}%`;
        return [fullText];
    }
}
