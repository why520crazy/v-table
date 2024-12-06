import { ChangeDetectionStrategy, Component, ElementRef, Input, computed } from '@angular/core';
import { ThyDivider } from 'ngx-tethys/divider';
import {
    ThyDropdownAbstractMenu,
    ThyDropdownMenuComponent,
    ThyDropdownMenuItemDirective,
    ThyDropdownMenuItemIconDirective,
    ThyDropdownMenuItemNameDirective
} from 'ngx-tethys/dropdown';
import { ThyIcon } from 'ngx-tethys/icon';
import { AITable } from '../../core';
import { AITableFieldMenuItem } from '../../types/field';
import { NgClass } from '@angular/common';

@Component({
    selector: 'field-menu',
    templateUrl: './field-menu.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'field-menu'
    },
    imports: [
        ThyIcon,
        ThyDivider,
        ThyDropdownMenuComponent,
        ThyDropdownMenuItemDirective,
        ThyDropdownMenuItemNameDirective,
        ThyDropdownMenuItemIconDirective,
        NgClass
    ]
})
export class FieldMenu extends ThyDropdownAbstractMenu {
    @Input({ required: true }) fieldId!: string;

    @Input({ required: true }) aiTable!: AITable;

    @Input({ required: true }) fieldMenus!: AITableFieldMenuItem[];

    @Input() origin!: HTMLElement | ElementRef<any>;

    @Input() position!: { x: number; y: number };

    field = computed(() => {
        return this.aiTable.fields().find((item) => item._id === this.fieldId)!;
    });

    execute(menu: AITableFieldMenuItem) {
        if ((menu.disabled && !menu.disabled(this.aiTable, this.field)) || !menu.disabled) {
            menu.exec && menu.exec(this.aiTable, this.field, this.origin, this.position);
        }
    }
}
