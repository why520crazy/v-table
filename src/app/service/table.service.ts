import {
    AITableView,
    AITableViewFields,
    AITableViewRecords,
    AIViewTable,
    applyYjsEvents,
    buildFieldsByView,
    buildRecordsByView,
    createSharedType,
    getSharedTypeByData,
    getDataBySharedType,
    SharedType,
    YjsAITable
} from '@ai-table/state';
import { computed, inject, Injectable, isDevMode, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketProvider } from 'y-websocket';
import { getProvider } from '../provider';
import { getCanvasDefaultValue, sortDataByView } from '../utils/utils';
import { AITableValue } from '@ai-table/grid';

export const LOCAL_STORAGE_KEY = 'ai-table-active-view-id';
const LOCAL_STORAGE_AI_TABLE_SHARED_DATA = 'ai-table-demo-shared-data';

export const TABLE_SERVICE_MAP = new WeakMap<AIViewTable, TableService>();

@Injectable()
export class TableService {
    views!: WritableSignal<AITableView[]>;

    readonly: WritableSignal<boolean> = signal(false);

    records!: WritableSignal<AITableViewRecords>;

    fields!: WritableSignal<AITableViewFields>;

    aiTable!: AIViewTable;

    provider!: WebsocketProvider | null;

    sharedType!: SharedType | null;

    activeViewId: WritableSignal<string> = signal('');

    router = inject(Router);

    activeView = computed(() => {
        return this.views().find((view) => view._id === this.activeViewId()) as AITableView;
    });

    activeViewShortId = computed(() => {
        return this.activeView().short_id;
    });

    renderRecords = computed(() => {
        return buildRecordsByView(this.aiTable, this.records(), this.fields(), this.activeView()) as AITableViewRecords;
    });

    renderFields = computed(() => {
        return buildFieldsByView(this.aiTable, this.fields(), this.activeView()) as AITableViewFields;
    });

    aiBuildRenderDataFn: Signal<() => AITableValue> = computed(() => {
        return () => {
            return {
                records: this.renderRecords(),
                fields: this.renderFields()
            };
        };
    });

    initData(views: AITableView[]) {
        this.views = signal(views);
    }

    setReadonly(readonly: boolean) {
        this.readonly.set(readonly);
    }

    setActiveView(activeViewId: string) {
        this.activeViewId.set(activeViewId);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, activeViewId);
    }

    setAITable(aiTable: AIViewTable) {
        this.aiTable = aiTable;
    }

    buildRenderRecords(records?: AITableViewRecords) {
        this.records = signal(sortDataByView(records ?? this.records(), this.activeViewId()) as AITableViewRecords);
    }

    buildRenderFields(fields?: AITableViewFields) {
        this.fields = signal(sortDataByView(fields ?? this.fields(), this.activeViewId()) as AITableViewFields);
    }

    handleShared(room: string) {
        if (this.provider) {
            this.disconnect();
            return;
        }

        let isInitialized = false;
        if (!this.sharedType) {
            this.sharedType = createSharedType();
            this.sharedType.observeDeep((events: any) => {
                if (!YjsAITable.isLocal(this.aiTable)) {
                    if (!isInitialized) {
                        const data = getDataBySharedType(this.sharedType!);
                        this.views.set(data.views);
                        this.buildRenderFields(data.fields);
                        this.buildRenderRecords(data.records);
                        isInitialized = true;
                    } else {
                        applyYjsEvents(this.aiTable, this.sharedType!, events);
                    }
                }
                localStorage.setItem(LOCAL_STORAGE_AI_TABLE_SHARED_DATA, JSON.stringify(this.sharedType!.toJSON()));
            });
        }
        this.provider = getProvider(this.sharedType.doc!, room, isDevMode());
        this.provider.connect();
        this.provider.once('synced', () => {
            if (this.provider!.synced && [...this.sharedType!.doc!.store.clients.keys()].length === 0) {
                console.log('init shared type');
                const value = getCanvasDefaultValue();
                getSharedTypeByData(this.sharedType!.doc!, {
                    records: value.records,
                    fields: value.fields,
                    views: this.views()
                });
            }
        });
    }

    disconnect() {
        if (this.provider) {
            this.provider.disconnect();
            this.provider = null;
            this.sharedType = null;
        }
    }
}
