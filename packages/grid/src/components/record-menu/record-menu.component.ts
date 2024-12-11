import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
    ThyDropdownAbstractMenu,
    ThyDropdownMenuComponent,
    ThyDropdownMenuItemDirective,
    ThyDropdownMenuItemIconDirective,
    ThyDropdownMenuItemNameDirective
} from 'ngx-tethys/dropdown';
import { ThyIcon } from 'ngx-tethys/icon';
import { AITable } from '../../core';
import { AITableRecordMenuItem } from '../../types';

@Component({
    selector: 'record-menu',
    templateUrl: './record-menu.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'record-menu'
    },
    imports: [
        ThyDropdownMenuComponent,
        ThyDropdownMenuItemDirective,
        ThyDropdownMenuItemNameDirective,
        ThyDropdownMenuItemIconDirective,
        ThyIcon,
        NgClass
    ]
})
export class RecordMenu extends ThyDropdownAbstractMenu {
    aiTable = input.required<AITable>();

    recordMenus = input.required<AITableRecordMenuItem[]>();

    selectedRecordIds = input.required<string[]>();

    execute(menu: AITableRecordMenuItem) {
        if (!menu.disabled) {
            menu.exec && menu.exec(this.aiTable(), this.selectedRecordIds());
        }
    }
}
