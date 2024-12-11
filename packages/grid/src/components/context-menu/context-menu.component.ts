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
import { AITableContextMenuItem } from '../../types';

@Component({
    selector: 'context-menu',
    templateUrl: './context-menu.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'context-menu'
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
export class ContextMenu extends ThyDropdownAbstractMenu {
    aiTable = input.required<AITable>();

    contextMenus = input.required<AITableContextMenuItem[]>();

    targetName = input.required<string>();

    position = input.required<{ x: number; y: number }>();

    execute(menu: AITableContextMenuItem) {
        if ((menu.disabled && !menu.disabled(this.aiTable(), this.targetName(), this.position())) || !menu.disabled) {
            menu.exec && menu.exec(this.aiTable(), this.targetName(), this.position());
        }
    }
}
