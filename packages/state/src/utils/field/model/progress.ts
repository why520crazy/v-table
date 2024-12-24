import { AITableField } from '@ai-table/grid';
import { NumberField } from './number';

export class ProgressField extends NumberField {
    override cellFullText(transformValue: number, field: AITableField): string[] {
        const fullText = `${transformValue}%`;
        return [fullText];
    }
}
