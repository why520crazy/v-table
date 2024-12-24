import { Field } from './field';
import { AITableField, AITableSelectField } from '../../index';

export class SelectField extends Field {
    cellFullText(transformValue: string[], field: AITableField): string[] {
        let cellText: string[] = [];
        if (transformValue && Array.isArray(transformValue) && transformValue.length) {
            transformValue.forEach((optionId) => {
                const item = (field as AITableSelectField).settings?.options?.find((option) => option._id === optionId);
                if (item?.text) {
                    cellText.push(item.text);
                }
            });
        }
        return cellText;
    }
}
