import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ThyDropdownAbstractMenu, ThyDropdownMenuItemDirective } from 'ngx-tethys/dropdown';
import { ThyIcon } from 'ngx-tethys/icon';
import { AITable } from '../../core';
import { AITableContextMenuItem } from '../../types';
import { AITableGridSelectionService } from '../../services/selection.service';

@Component({
    selector: 'ai-table-context-menu',
    templateUrl: './context-menu.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'context-menu'
    },
    imports: [ThyDropdownMenuItemDirective, ThyIcon, NgClass]
})
export class AITableContextMenu extends ThyDropdownAbstractMenu {
    private aiTableGridSelectionService = inject(AITableGridSelectionService);

    aiTable = input.required<AITable>();

    menuItems = input.required<AITableContextMenuItem[]>();

    targetName = input.required<string>();

    position = input.required<{ x: number; y: number }>();

    execute(menu: AITableContextMenuItem) {
        if ((menu.disabled && !menu.disabled(this.aiTable(), this.targetName(), this.position())) || !menu.disabled) {
            menu.exec && menu.exec(this.aiTable(), this.targetName(), this.position(), this.aiTableGridSelectionService);
        }
    }
}
