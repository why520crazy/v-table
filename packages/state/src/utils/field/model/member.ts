import { AITableField, AITableReferences } from '@ai-table/grid';
import { SelectField } from './select';

export class MemberField extends SelectField {
    override cellFullText(transformValue: string[], field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (transformValue?.length && references) {
            for (let index = 0; index < transformValue.length; index++) {
                const userInfo = references?.members[transformValue[index]];
                if (!userInfo) {
                    continue;
                }
                if (userInfo.display_name) {
                    fullText.push(userInfo.display_name);
                }
            }
        }
        return fullText;
    }
}
