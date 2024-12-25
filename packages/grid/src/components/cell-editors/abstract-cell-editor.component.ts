import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, Input, OnInit, output } from '@angular/core';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { AITable, AITableField, AITableQueries, UpdateFieldValueOptions } from '../../core';
import { AITableReferences } from '../../types';

@Component({
    selector: 'abstract-edit-cell',
    template: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class AbstractEditCellEditor<TValue, TFieldType extends AITableField = AITableField> implements OnInit {
    @Input({ required: true }) aiTable!: AITable;

    @Input({ required: true }) fieldId!: string;

    @Input({ required: true }) recordId!: string;

    @Input({ required: true }) references!: AITableReferences;

    updateFieldValue = output<UpdateFieldValueOptions<TValue>>();

    modelValue!: TValue;

    field = computed(() => {
        return this.aiTable.fieldsMap()[this.fieldId] as TFieldType;
    });

    record = computed(() => {
        return this.aiTable.recordsMap()[this.recordId];
    });

    elementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

    protected thyPopoverRef = inject(ThyPopoverRef<AbstractEditCellEditor<TValue>>, { optional: true });

    ngOnInit(): void {
        this.modelValue = computed(() => {
            return AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id]);
        })();
    }

    update() {
        if (this.modelValue === AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id])) {
            return;
        }
        this.updateFieldValue.emit({
            value: this.modelValue,
            path: [this.record()._id, this.field()._id]
        });
    }

    closePopover() {
        this.thyPopoverRef?.close();
    }
}
