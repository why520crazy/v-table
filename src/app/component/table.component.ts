import { AITableGrid } from '@ai-table/grid';
import { Actions, addView, AITableView, AITableViewFields, AITableViewRecords, removeView } from '@ai-table/state';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';
import { ThyTab, ThyTabs } from 'ngx-tethys/tabs';
import { WebsocketProvider } from 'y-websocket';
import { LOCAL_STORAGE_KEY, TableService } from '../service/table.service';

const initViews: AITableView[] = [
    {
        _id: 'view1',
        name: '表格视图',
        settings: {
            // conditions: [
            //     {
            //         field_id: 'column-1',
            //         operation: AITableFilterOperation.contain,
            //         value: '文本 2-1'
            //     }
            // ]
        }
    },
    { _id: 'view2', name: '表格视图 1' }
];

@Component({
    selector: 'demo-ai-table',
    standalone: true,
    imports: [
        RouterOutlet,
        AITableGrid,
        ThyAction,
        ThyTabs,
        ThyTab,
        ThyPopoverModule,
        FormsModule,
        ThyInputDirective,
        ThyIconModule,
        ThyAction,
        ThyDropdownModule,
        ThyEnterDirective,
        ThyAutofocusDirective
    ],
    templateUrl: './table.component.html',
    providers: [TableService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class DemoTable implements OnInit, AfterViewInit, OnDestroy {
    provider!: WebsocketProvider | null;

    room = 'share-demo-action-1';

    router = inject(Router);

    tableService = inject(TableService);

    isEdit = false;

    readonly = false;

    activeViewName!: string;

    ngOnInit(): void {
        let activeView = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
        if (!activeView || (activeView && initViews.findIndex((item) => item._id === activeView) < 0)) {
            activeView = initViews[0]._id;
        }
        this.tableService.setActiveView(activeView);
        this.router.navigate([`/${activeView}`]);
        this.tableService.initData(initViews);
    }

    ngAfterViewInit(): void {
        this.router.navigate(['/view1']);
    }

    activeTabChange(data: any) {
        this.tableService.setActiveView(data);
        this.router.navigateByUrl(`/${this.tableService.activeViewId()}`);
    }

    handleShared() {
        this.tableService.handleShared(this.room);
    }

    handleReadonlyChange(e: any) {
        this.readonly = e.target.checked;
        this.tableService.setReadonly(e.target.checked);
    }

    updateValue() {
        this.isEdit = false;
        if (this.activeViewName !== this.tableService.activeView().name) {
            Actions.setView(this.tableService.aiTable, { name: this.activeViewName }, [this.tableService.activeView()._id]);
        }
    }

    updateEditStatus() {
        this.isEdit = true;
    }

    nameChange(value: string) {
        this.activeViewName = value;
    }

    addView(type: 'add' | 'copy') {
        const newView = addView(this.tableService.aiTable, type);
        if (newView) {
            this.tableService.setActiveView(newView._id);
        }
    }

    removeView() {
        const records = this.tableService.aiTable.records() as AITableViewRecords;
        const fields = this.tableService.aiTable.fields() as AITableViewFields;
        removeView(this.tableService.aiTable, records, fields, this.tableService.activeViewId());
    }

    ngOnDestroy(): void {
        this.tableService.disconnect();
    }
}
