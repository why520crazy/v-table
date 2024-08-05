import { computed, Injectable, isDevMode, signal, WritableSignal } from '@angular/core';
import { createSharedType, initSharedType, SharedType } from '../share/shared';
import { WebsocketProvider } from 'y-websocket';
import { getProvider } from '../share/provider';
import { DemoAIField, DemoAIRecord } from '../types';
import { getDefaultValue, sortDataByView } from '../utils/utils';
import { applyYjsEvents } from '../share/apply-to-table';
import { translateSharedTypeToTable } from '../share/utils/translate-to-table';
import { YjsAITable } from '../share/yjs-table';
import { AITable } from '@ai-table/grid';
import { AITableView } from '../types/view';

@Injectable()
export class TableService {
    views!: WritableSignal<AITableView[]>;

    records!: WritableSignal<DemoAIRecord[]>;

    fields!: WritableSignal<DemoAIField[]>;

    aiTable!: AITable;

    provider!: WebsocketProvider | null;

    sharedType!: SharedType | null;

    activeView = computed(() => {
        return this.views().find((view) => view?.isActive) as AITableView;
    });

    initData(views: AITableView[]) {
        this.views = signal(views);
    }

    updateActiveView(activeViewId: string) {
        this.views.update((value) => {
            value.forEach((item) => {
                if (item.isActive && item.id !== activeViewId) {
                    item.isActive = false;
                }
                if (!item.isActive && item.id === activeViewId) {
                    item.isActive = true;
                }
            });
            return [...value];
        });
    }

    setAITable(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    buildRenderRecords(records?: DemoAIRecord[]) {
        this.records = signal(sortDataByView(records ?? this.records(), this.activeView().id) as DemoAIRecord[]);
    }

    buildRenderFields(fields?: DemoAIField[]) {
        this.fields = signal(sortDataByView(fields ?? this.fields(), this.activeView().id) as DemoAIField[]);
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
                        const data = translateSharedTypeToTable(this.sharedType!);
                        this.buildRenderRecords(data.records);
                        this.buildRenderFields(data.fields);
                        isInitialized = true;
                    } else {
                        applyYjsEvents(this.aiTable, events);
                    }
                }
            });
        }
        this.provider = getProvider(this.sharedType.doc!, room, isDevMode());
        this.provider.connect();
        this.provider.once('synced', () => {
            if (this.provider!.synced && [...this.sharedType!.doc!.store.clients.keys()].length === 0) {
                console.log('init shared type');
                const value = getDefaultValue();
                initSharedType(this.sharedType!.doc!, {
                    records: value.records,
                    fields: value.fields
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