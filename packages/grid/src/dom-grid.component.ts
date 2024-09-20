import { CommonModule, NgClass, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyAction } from 'ngx-tethys/action';
import { ThyAvatarModule } from 'ngx-tethys/avatar';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ThyDatePickerFormatPipe } from 'ngx-tethys/date-picker';
import { ThyDropdownDirective, ThyDropdownMenuComponent } from 'ngx-tethys/dropdown';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyProgress } from 'ngx-tethys/progress';
import { ThyRate } from 'ngx-tethys/rate';
import { ThyStopPropagationDirective } from 'ngx-tethys/shared';
import { ThyTag } from 'ngx-tethys/tag';
import { ProgressEditorComponent, SelectOptionComponent } from './components';
import { FieldMenu } from './components/field-menu/field-menu.component';
import { AITableFieldPropertyEditor } from './components/field-property-editor/field-property-editor.component';
import { AITableField } from './core';
import { AITableGridBase } from './grid-base.component';
import { IsSelectRecordPipe, MemberSettingPipe, SelectOptionPipe, SelectOptionsPipe, SelectSettingPipe, UserPipe } from './pipes/grid.pipe';
import { AITableGridEventService } from './services/event.service';
import { AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { buildGridData } from './utils';

@Component({
    selector: 'ai-table-dom-grid',
    templateUrl: './dom-grid.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid ai-table-dom-grid'
    },
    imports: [
        NgClass,
        NgComponentOutlet,
        CommonModule,
        FormsModule,
        SelectOptionPipe,
        SelectOptionsPipe,
        ThyTag,
        ThyPopoverModule,
        ThyIcon,
        ThyRate,
        ThyProgress,
        AITableFieldPropertyEditor,
        ThyDatePickerFormatPipe,
        ThyFlexibleText,
        ThyStopPropagationDirective,
        FieldMenu,
        ThyAction,
        ThyDropdownDirective,
        ThyDropdownMenuComponent,
        ThyCheckboxModule,
        ProgressEditorComponent,
        ThyAvatarModule,
        NgTemplateOutlet,
        IsSelectRecordPipe,
        ProgressEditorComponent,
        SelectOptionComponent,
        UserPipe,
        SelectSettingPipe,
        MemberSettingPipe
    ],
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableDomGrid extends AITableGridBase implements OnInit {
    gridData = computed(() => {
        return buildGridData(this.aiRecords(), this.aiFields());
    });

    override ngOnInit(): void {
        super.ngOnInit();
        this.subscribeEvents();
    }

    openFieldMenu(e: Event, field: AITableField, fieldAction: HTMLElement) {
        const moreBtn = (e.target as HTMLElement)!.closest('.grid-field-action');
        this.aiTableGridFieldService.openFieldMenu(this.aiTable, {
            origin: moreBtn,
            editOrigin: fieldAction,
            fieldId: field._id,
            fieldMenus: this.fieldMenus
        });
    }
}
