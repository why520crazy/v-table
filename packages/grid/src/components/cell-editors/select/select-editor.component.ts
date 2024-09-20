import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThySelect } from 'ngx-tethys/select';
import { ThyOption } from 'ngx-tethys/shared';
import { AITableSelectField } from '../../../types';
import { SelectOptionComponent } from '../../cell-views/select/option.component';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';

@Component({
    selector: 'select-cell-editor',
    templateUrl: './select-editor.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block h-100 select-cell-editor'
    },
    imports: [FormsModule, NgTemplateOutlet, ThySelect, ThyOption, SelectOptionComponent]
})
export class SelectCellEditorComponent extends AbstractEditCellEditor<string, AITableSelectField> {
    selectOptions = computed(() => {
        return this.field().settings.options;
    });

    constructor() {
        super();
    }

    updateValue(value: boolean) {
        if (!value) {
            this.updateFieldValue();
            this.closePopover();
        }
    }
}
