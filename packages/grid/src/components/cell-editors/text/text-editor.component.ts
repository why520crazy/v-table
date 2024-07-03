import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyInputModule } from 'ngx-tethys/input';
import { ThyAutofocusDirective } from 'ngx-tethys/shared';
import { AbstractCellEditor } from '../abstract-cell-editor.component';

@Component({
    selector: 'text-cell-editor',
    template: `<input thyInput [thyAutofocus]="true" [(ngModel)]="cellValue" (blur)="updateValue()" placeholder="" /> `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, FormsModule, ThyAutofocusDirective, ThyInputModule]
})
export class TextCellEditorComponent extends AbstractCellEditor<string> {
    updateValue() {
        this.updateFieldValue();
        this.closePopover();
    }
}