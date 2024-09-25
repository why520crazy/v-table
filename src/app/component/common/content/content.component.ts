import {
    Actions,
    AIFieldConfig,
    AIFieldPath,
    AIRecordPath,
    AITable,
    AITableChangeOptions,
    AITableDomGrid,
    AITableField,
    AITableGrid,
    AITableQueries,
    AITableRecord,
    DividerMenuItem,
    EditFieldPropertyItem,
    RemoveFieldItem
} from '@ai-table/grid';
import { AIViewTable, applyActionOps, withView, YjsAITable } from '@ai-table/state';
import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyLoading } from 'ngx-tethys/loading';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThySegment, ThySegmentEvent, ThySegmentItem } from 'ngx-tethys/segment';
import { withRemoveView } from '../../../plugins/view.plugin';
import { TABLE_SERVICE_MAP, TableService } from '../../../service/table.service';
import { getBigData, getCanvasDefaultValue, getDefaultValue, getReferences } from '../../../utils/utils';
import { FieldPropertyEditor } from '../field-property-editor/field-property-editor.component';

const LOCAL_STORAGE_DATA_MODE = 'ai-table-demo-data-mode';
const LOCAL_STORAGE_RENDER_MODE = 'ai-table-demo-render-mode';

@Component({
    selector: 'demo-table-content',
    standalone: true,
    imports: [
        RouterOutlet,
        ThyPopoverModule,
        FieldPropertyEditor,
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

    plugins = [withView, withRemoveView];

    aiFieldConfig: AIFieldConfig = {
        fieldPropertyEditor: FieldPropertyEditor,
        fieldMenus: [
            EditFieldPropertyItem,
            DividerMenuItem,
            {
                type: 'filterFields',
                name: '按本列筛选',
                icon: 'filter-line',
                exec: (aiTable: AITable, field: Signal<AITableField>) => {},
                hidden: (aiTable: AITable, field: Signal<AITableField>) => false,
                disabled: (aiTable: AITable, field: Signal<AITableField>) => false
            },
            DividerMenuItem,
            RemoveFieldItem
        ]
    };

    iconRegistry = inject(ThyIconRegistry);

    sanitizer = inject(DomSanitizer);

    tableService = inject(TableService);

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

    onChange(options: AITableChangeOptions) {
        if (this.tableService.sharedType) {
            if (!YjsAITable.isRemote(this.aiTable) && !YjsAITable.isUndo(this.aiTable)) {
                YjsAITable.asLocal(this.aiTable, () => {
                    applyActionOps(this.tableService.sharedType!, options.actions, this.aiTable);
                });
            }
        }
    }

    prevent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        this.aiTable.views = this.tableService.views;
        this.aiTable.activeViewId = this.tableService.activeViewId;
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
            const path = AITableQueries.findFieldPath(this.aiTable, item) as AIFieldPath;
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
            const path = AITableQueries.findRecordPath(this.aiTable, item) as AIRecordPath;
            if (path[0] < newIndex) {
                Actions.moveRecord(this.aiTable, path, [newIndex]);
                offset = 1;
            } else {
                selectedRecordsAfterNewPath.push(item);
            }
        });

        selectedRecordsAfterNewPath.reverse().forEach((item) => {
            const newPath = [newIndex + offset] as AIRecordPath;
            const path = AITableQueries.findRecordPath(this.aiTable, item) as AIRecordPath;
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
