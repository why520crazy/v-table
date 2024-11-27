import {
    AddFieldOptions,
    AddRecordOptions,
    AIFieldConfig,
    AITable,
    AITableDomGrid,
    AITableField,
    AITableFieldMenuItem,
    AITableFieldType,
    AITableGrid,
    AITableQueries,
    AITableRecord,
    DateFieldValue,
    NumberPath,
    UpdateFieldValueOptions
} from '@ai-table/grid';
import {
    Actions,
    addFields,
    addRecords,
    AITableView,
    AIViewTable,
    applyActionOps,
    buildRemoveFieldItem,
    DividerMenuItem,
    EditFieldPropertyItem,
    updateFieldValue,
    withState,
    YjsAITable
} from '@ai-table/state';
import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { DateHelperService, ThyDatePickerFormatPipe } from 'ngx-tethys/date-picker';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyLoading } from 'ngx-tethys/loading';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThySegment, ThySegmentEvent, ThySegmentItem } from 'ngx-tethys/segment';
import { withRemoveView } from '../../../plugins/view.plugin';
import { TABLE_SERVICE_MAP, TableService } from '../../../service/table.service';
import { getBigData, getCanvasDefaultValue, getDefaultValue, getReferences } from '../../../utils/utils';

const LOCAL_STORAGE_DATA_MODE = 'ai-table-demo-data-mode';
const LOCAL_STORAGE_RENDER_MODE = 'ai-table-demo-render-mode';
const LOCAL_STORAGE_AI_TABLE_DATA = 'ai-table-demo-data';

@Component({
    selector: 'demo-table-content',
    standalone: true,
    imports: [
        RouterOutlet,
        ThyPopoverModule,
        ThyAction,
        FormsModule,
        ThyInputDirective,
        ThySegment,
        ThySegmentItem,
        ThyLoading,
        AITableGrid,
        AITableDomGrid
    ],
    templateUrl: './content.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class DemoTableContent {
    aiTable!: AIViewTable;

    plugins = [withState, withRemoveView];

    aiFieldConfig: Signal<AIFieldConfig> = computed(() => {
        const defaultFieldMenus: AITableFieldMenuItem[] = [
            {
                type: 'filterFields',
                name: '按本列筛选',
                icon: 'filter-line',
                exec: (aiTable: AITable, field: Signal<AITableField>) => {},
                hidden: (aiTable: AITable, field: Signal<AITableField>) => false,
                disabled: (aiTable: AITable, field: Signal<AITableField>) => false
            }
        ];
        const fieldMenus = defaultFieldMenus;
        if (!this.tableService.readonly()) {
            fieldMenus.unshift(EditFieldPropertyItem as any, DividerMenuItem);
            fieldMenus.push(
                DividerMenuItem,
                buildRemoveFieldItem(() => {
                    const member = 'member_03';
                    const time = new Date().getTime();
                    return { updated_at: time, updated_by: member };
                })
            );
        }
        return {
            fieldRenderers: {
                [AITableFieldType.date]: {
                    transform: (field: AITableField, value: DateFieldValue) => {
                        const datePickerFormatPipe = new ThyDatePickerFormatPipe(this.dateHelperService);
                        return datePickerFormatPipe.transform(value.timestamp as any);
                    }
                },
                [AITableFieldType.createdAt]: {
                    transform: (field: AITableField, value: DateFieldValue) => {
                        const datePickerFormatPipe = new ThyDatePickerFormatPipe(this.dateHelperService);
                        return datePickerFormatPipe.transform(value.timestamp as any);
                    }
                },
                [AITableFieldType.updatedAt]: {
                    transform: (field: AITableField, value: DateFieldValue) => {
                        const datePickerFormatPipe = new ThyDatePickerFormatPipe(this.dateHelperService);
                        return datePickerFormatPipe.transform(value.timestamp as any);
                    }
                }
            },
            fieldMenus
        };
    });

    iconRegistry = inject(ThyIconRegistry);

    sanitizer = inject(DomSanitizer);

    tableService = inject(TableService);

    dateHelperService = inject(DateHelperService);

    references = signal(getReferences());

    renderMode = signal<'dom' | 'canvas'>('canvas');

    dateMode = signal<'default' | 'big-data'>('default');

    renderModeActiveIndex = computed(() => (this.renderMode() === 'canvas' ? 0 : 1));

    dateModeActiveIndex = computed(() => (this.dateMode() === 'default' ? 0 : 1));

    constructor() {
        this.registryIcon();
    }

    ngOnInit(): void {
        if (this.tableService.sharedType) {
            this.tableService.buildRenderRecords();
            this.tableService.buildRenderFields();
        } else {
            this.renderMode.set(this.getLocalRenderMode(LOCAL_STORAGE_RENDER_MODE) || 'canvas');
            this.dateMode.set(this.getLocalDataMode(LOCAL_STORAGE_DATA_MODE) || 'default');
            this.setValue();
        }
        console.time('render');
    }

    ngAfterViewInit() {
        console.timeEnd('render');
    }

    registryIcon() {
        this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/defs/svg/sprite.defs.svg'));
    }

    setValue() {
        const value =
            this.dateMode() === 'default' ? (this.renderMode() === 'canvas' ? getCanvasDefaultValue() : getDefaultValue()) : getBigData();
        this.tableService.buildRenderRecords(value.records);
        this.tableService.buildRenderFields(value.fields);
    }

    changeRenderMode(e: ThySegmentEvent<any>) {
        this.renderMode.set(e.value);
        this.setLocalStorage(LOCAL_STORAGE_RENDER_MODE, e.value);
        this.setValue();
    }

    changeDataMode(e: ThySegmentEvent<any>) {
        this.dateMode.set(e.value);
        this.setLocalStorage(LOCAL_STORAGE_DATA_MODE, e.value);
        this.setValue();
    }

    addRecord(data: AddRecordOptions) {
        const member = 'member_01';
        const time = new Date().getTime();
        addRecords(this.aiTable, data, { created_by: member, created_at: time, updated_by: member, updated_at: time });
    }

    updateFieldValue(value: UpdateFieldValueOptions) {
        const member = 'member_02';
        const time = new Date().getTime();
        updateFieldValue(this.aiTable, value, { updated_by: member, updated_at: time });
    }

    addField(data: AddFieldOptions) {
        const member = 'member_02';
        const time = new Date().getTime();
        addFields(this.aiTable, data, { updated_by: member, updated_at: time });
    }

    prevent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        this.aiTable.views = this.tableService.views;
        this.aiTable.activeViewId = this.tableService.activeViewId;
        this.aiTable.viewsMap = computed(() => {
            return this.tableService.views().reduce(
                (object, item) => {
                    object[item._id] = item;
                    return object;
                },
                {} as { [kay: string]: AITableView }
            );
        });
        this.aiTable.onChange = () => {
            this.setLocalStorage(
                LOCAL_STORAGE_AI_TABLE_DATA,
                JSON.stringify({
                    records: this.aiTable.records(),
                    fields: this.aiTable.fields(),
                    views: this.aiTable.views(),
                    actions: this.aiTable.actions
                })
            );
            if (this.tableService.sharedType) {
                if (!YjsAITable.isRemote(this.aiTable) && !YjsAITable.isUndo(this.aiTable)) {
                    YjsAITable.asLocal(this.aiTable, () => {
                        applyActionOps(this.aiTable, this.tableService.sharedType!, this.aiTable.actions);
                    });
                }
            }
        };
        TABLE_SERVICE_MAP.set(this.aiTable, this.tableService);
        this.tableService.setAITable(this.aiTable);
    }

    removeRecord() {
        const recordIds = [...this.aiTable.selection().selectedRecords.keys()];
        recordIds.forEach((id) => {
            Actions.removeRecord(this.aiTable, [id]);
        });
    }

    moveField() {
        const newIndex = 2;
        const selectedFieldIds = [...this.aiTable.selection().selectedFields.keys()];
        const selectedFields = this.aiTable.fields().filter((item) => selectedFieldIds.includes(item._id));
        selectedFields.forEach((item) => {
            const path = AITableQueries.findFieldPath(this.aiTable, item) as NumberPath;
            Actions.moveField(this.aiTable, path, [newIndex]);
        });
    }

    moveRecord() {
        const selectedRecordIds = [...this.aiTable.selection().selectedRecords.keys()];
        const selectedRecords = this.aiTable.records().filter((item) => selectedRecordIds.includes(item._id));
        const selectedRecordsAfterNewPath: AITableRecord[] = [];
        let offset = 0;
        const newIndex = 2;
        selectedRecords.forEach((item) => {
            const path = AITableQueries.findRecordPath(this.aiTable, item) as NumberPath;
            if (path[0] < newIndex) {
                Actions.moveRecord(this.aiTable, path, [newIndex]);
                offset = 1;
            } else {
                selectedRecordsAfterNewPath.push(item);
            }
        });

        selectedRecordsAfterNewPath.reverse().forEach((item) => {
            const newPath = [newIndex + offset] as NumberPath;
            const path = AITableQueries.findRecordPath(this.aiTable, item) as NumberPath;
            Actions.moveRecord(this.aiTable, path, newPath);
        });
    }

    getLocalRenderMode(key: string) {
        const value = localStorage.getItem(key) as 'dom' | 'canvas';
        return value ? value : null;
    }

    getLocalDataMode(key: string) {
        const value = localStorage.getItem(key) as 'default' | 'big-data';
        return value ? value : null;
    }

    setLocalStorage(key: string, mode: string) {
        localStorage.setItem(key, mode);
    }
}
