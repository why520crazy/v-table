import { Pipe, PipeTransform } from '@angular/core';
import { AITableFieldSettings, AITableSelectOption, MemberSettings, SelectSettings } from '../core';
import { AITableReferences, AITableSelection } from '../types';

@Pipe({
    name: 'selectOption',
    standalone: true
})
export class SelectOptionPipe implements PipeTransform {
    transform(_id: string, options: AITableSelectOption[]) {
        return options?.length && options.find((item) => item._id === _id);
    }
}

@Pipe({
    name: 'selectOptions',
    standalone: true
})
export class SelectOptionsPipe implements PipeTransform {
    transform(ids: string[], options: AITableSelectOption[] = []) {
        return (
            (ids?.length &&
                ids.map((id: string) => {
                    return options.find((item) => item._id === id);
                })) ||
            []
        );
    }
}

@Pipe({
    name: 'isSelectRecord',
    standalone: true
})
export class IsSelectRecordPipe implements PipeTransform {
    transform(recordId: string, selection: AITableSelection) {
        return selection.selectedRecords.has(recordId);
    }
}

@Pipe({
    name: 'user',
    standalone: true
})
export class UserPipe implements PipeTransform {
    transform(values: string[], references: AITableReferences) {
        return (
            (values.length &&
                values.map((item) => {
                    return references.members[item] || {};
                })) ||
            []
        );
    }
}

@Pipe({
    name: 'selectSetting',
    standalone: true
})
export class SelectSettingPipe implements PipeTransform {
    transform(settings: AITableFieldSettings) {
        return settings as SelectSettings;
    }
}

@Pipe({
    name: 'memberSetting',
    standalone: true
})
export class MemberSettingPipe implements PipeTransform {
    transform(settings: AITableFieldSettings) {
        return settings as MemberSettings;
    }
}

@Pipe({
    name: 'fieldIsMultiple',
    standalone: true
})
export class AITableFieldIsMultiplePipe implements PipeTransform {
    transform(settings: AITableFieldSettings) {
        if (settings && settings.hasOwnProperty('is_multiple')) {
            return !!(settings as SelectSettings | MemberSettings).is_multiple;
        }
        return false;
    }
}
