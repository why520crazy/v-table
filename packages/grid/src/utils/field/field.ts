import { AITableField, AITableReferences } from '../../index';

export abstract class Field {
    abstract cellFullText(transformValue: any, field: AITableField, references?: AITableReferences): string[];
}
