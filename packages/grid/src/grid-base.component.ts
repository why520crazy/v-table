import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    model,
    NgZone,
    OnInit,
    output,
    Signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { mergeWith } from 'rxjs';
import { DBL_CLICK_EDIT_TYPE, MOUSEOVER_EDIT_TYPE } from './constants';
import {
    AddFieldOptions,
    AddRecordOptions,
    AIPlugin,
    AITable,
    AITableFields,
    AITableFieldType,
    AITableRecords,
    AITableSelectOptionStyle,
    AITableValue,
    createAITable,
    createDefaultField,
    UpdateFieldValueOptions
} from './core';
import { AITableGridEventService } from './services/event.service';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP, AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { AIFieldConfig, AITableFieldMenuItem, AITableContextMenuItem, AITableReferences } from './types';
import { AITableFieldPropertyEditor } from './components';
import { AITableGridMatchCellService } from './services/match-cell.service';

@Component({
    selector: 'ai-table-grid-base',
    template: '',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableGridBase implements OnInit {
    aiRecords = model.required<AITableRecords>();

    aiFields = model.required<AITableFields>();

    aiContextMenuItems = input<AITableContextMenuItem[]>([]);

    aiFieldConfig = input<AIFieldConfig>();

    aiReadonly = input<boolean>();

    aiPlugins = input<AIPlugin[]>();

    aiReferences = input.required<AITableReferences>();

    aiBuildRenderDataFn = input<(aiTable: AITable) => AITableValue>();

    aiKeywords = input<string>();

    AITableFieldType = AITableFieldType;

    AITableSelectOptionStyle = AITableSelectOptionStyle;

    aiTable!: AITable;

    isSelectedAll = computed(() => {
        return this.aiTable.selection().selectedRecords.size === this.aiRecords().length;
    });

    aiTableInitialized = output<AITable>();

    aiAddRecord = output<AddRecordOptions>();

    aiAddField = output<AddFieldOptions>();

    aiUpdateFieldValue = output<UpdateFieldValueOptions>();

    fieldMenus: Signal<AITableFieldMenuItem[]> = computed(() => {
        return this.aiFieldConfig()?.fieldMenus || [];
    });

    mouseoverRef!: ThyPopoverRef<any>;

    gridData = computed(() => {
        if (this.aiBuildRenderDataFn && this.aiBuildRenderDataFn() && this.aiTable) {
            return this.aiBuildRenderDataFn()!(this.aiTable);
        }
        return {
            records: this.aiRecords(),
            fields: this.aiFields()
        };
    });

    protected ngZone = inject(NgZone);
    protected elementRef = inject(ElementRef);
    protected destroyRef = inject(DestroyRef);
    protected aiTableGridFieldService = inject(AITableGridFieldService);
    protected aiTableGridEventService = inject(AITableGridEventService);
    protected aiTableGridSelectionService = inject(AITableGridSelectionService);
    protected aiTableGridMatchCellService = inject(AITableGridMatchCellService);

    ngOnInit(): void {
        this.initAITable();
        this.initService();
    }

    initAITable() {
        this.aiTable = createAITable(this.aiRecords, this.aiFields);
        this.aiPlugins()?.forEach((plugin) => {
            this.aiTable = plugin(this.aiTable);
        });
        this.aiTableInitialized.emit(this.aiTable);
    }

    initService() {
        this.aiTableGridEventService.initialize(this.aiTable, this.aiFieldConfig()?.fieldPropertyEditor);
        this.aiTableGridSelectionService.initialize(this.aiTable);
        this.aiTableGridMatchCellService.initialize(this.aiTable);
        this.aiTableGridEventService.registerEvents(this.elementRef.nativeElement);
        this.aiTableGridFieldService.initAIFieldConfig(this.aiFieldConfig());
        AI_TABLE_GRID_FIELD_SERVICE_MAP.set(this.aiTable, this.aiTableGridFieldService);
    }

    addRecord() {
        const records = this.gridData().records;
        const recordCount = records.length;
        this.aiAddRecord.emit({
            originId: recordCount > 0 ? records[records.length - 1]._id : ''
        });
    }

    selectRecord(recordId: string) {
        this.aiTableGridSelectionService.selectRecord(recordId);
    }

    toggleSelectAll(checked: boolean) {
        this.aiTableGridSelectionService.toggleSelectAll(checked);
    }

    addField(gridColumnBlank?: HTMLElement, position?: { x: number; y: number }) {
        const field = createDefaultField(this.aiTable, AITableFieldType.text);
        const popoverRef = this.aiTableGridFieldService.editFieldProperty(this.aiTable, {
            field,
            isUpdate: false,
            origin: gridColumnBlank!,
            position
        });
        if (popoverRef && !this.aiFieldConfig()?.fieldPropertyEditor) {
            (popoverRef.componentInstance as AITableFieldPropertyEditor).addField.subscribe((defaultValue) => {
                const fields = this.gridData().fields;
                const fieldCount = fields.length;
                this.aiAddField.emit({
                    originId: fieldCount > 0 ? fields[fields.length - 1]._id : '',
                    defaultValue
                });
            });
        }
    }

    public subscribeEvents() {
        this.ngZone.runOutsideAngular(() => {
            this.aiTableGridEventService.dblClickEvent$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
                this.dblClick(event);
            });
            this.aiTableGridEventService.mousedownEvent$
                .pipe(mergeWith(this.aiTableGridEventService.globalMousedownEvent$), takeUntilDestroyed(this.destroyRef))
                .subscribe((event) => {
                    this.aiTableGridSelectionService.updateSelect(event);
                });

            this.aiTableGridEventService.mouseoverEvent$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
                this.mouseoverHandle(event);
            });
            this.aiTableGridEventService.globalMouseoverEvent$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
                this.closeHoverCellEditor(event);
            });
        });
    }

    private dblClick(event: MouseEvent) {
        const cellDom = (event.target as HTMLElement).closest('.grid-cell') as HTMLElement;
        const type = cellDom && (cellDom.getAttribute('type')! as AITableFieldType);
        if (type && DBL_CLICK_EDIT_TYPE.includes(type)) {
            this.aiTableGridEventService.openEdit(cellDom);
        }
    }

    private mouseoverHandle(event: MouseEvent) {
        if (this.mouseoverRef) {
            this.mouseoverRef?.close();
        }
        const cellDom = (event.target as HTMLElement).closest('.grid-cell') as HTMLElement;
        const type = cellDom && (cellDom.getAttribute('type')! as AITableFieldType);
        if (type && MOUSEOVER_EDIT_TYPE.includes(type)) {
            this.mouseoverRef = this.aiTableGridEventService.openEdit(cellDom);
        }
    }

    private closeHoverCellEditor(e: MouseEvent) {
        if (this.mouseoverRef) {
            const hasGrid = e.target && (e.target as HTMLElement).closest('.ai-table-grid');
            const hasCellEditor = e.target && (e.target as HTMLElement).closest('.grid-cell-editor');
            if (!hasGrid && !hasCellEditor) {
                this.mouseoverRef.close();
            }
        }
    }
}
