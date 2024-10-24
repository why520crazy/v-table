import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyDot } from 'ngx-tethys/dot';
import { ThyEmptyModule } from 'ngx-tethys/empty';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThySelect } from 'ngx-tethys/select';
import { ThyOption } from 'ngx-tethys/shared';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { AITableQueries, AITableSelectOptionStyle } from '../../../core';
import { SelectOptionPipe } from '../../../pipes';
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
    imports: [
        FormsModule,
        NgTemplateOutlet,
        ThySelect,
        ThyOption,
        ThyTag,
        ThyIcon,
        ThyTooltipModule,
        ThyDot,
        ThyFlexibleText,
        SelectOptionPipe,
        SelectOptionComponent,
        ThyEmptyModule
    ]
})
export class SelectCellEditorComponent extends AbstractEditCellEditor<string[] | string, AITableSelectField> {
    selectOptions = computed(() => {
        return this.field().settings.options;
    });

    preset = computed(() => {
        return this.field().settings.is_multiple && this.field().settings.option_style === AITableSelectOptionStyle.tag ? 'tag' : '';
    });

    get isMultiple() {
        return !!this.field().settings.is_multiple;
    }

    constructor() {
        super();
    }

    override ngOnInit(): void {
        this.modelValue = computed(() => {
            const value = AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id]);
            if (!this.isMultiple) {
                return value[0];
            }
            return value || [];
        })();
    }

    updateValue(value: boolean) {
        if (!value) {
            const value = this.isMultiple ? this.modelValue : (this.modelValue && ([this.modelValue] as string[])) || [];
            this.updateFieldValue.emit({
                value: value,
                path: [this.record()._id, this.field()._id]
            });
            this.closePopover();
        }
    }
}
