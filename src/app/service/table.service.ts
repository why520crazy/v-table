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
import { AITableFieldType, AITableValue } from '@ai-table/grid';

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
        const settings = {
            condition_logical: 'and',
            conditions: [
                // 评分
                // {
                //     field_id: 'column-7',
                //     operation: 'nin', //in 、nin 、exists、empty
                //     value: [3, '4']
                // }
                // 链接
                // {
                //     field_id: 'column-8',
                //     operation: 'contain', // 'exists', //'empty',
                //     value: '百'
                // }
                // 更新时间（系统日期）
                // {
                //     field_id: 'column-12',
                //     operation: 'exists', // empty 、 exists
                //     value: null
                // }
                // {
                //     field_id: 'column-12',
                //     operation: 'between',
                //     value: [1734513044, 1734685844] // 2024-12-18 ~2024-12-20
                // }
                // {
                //     field_id: 'column-12',
                //     operation: 'gt', // eq、gt、lt
                //     // value: 1734376927 // 2024/12/17
                //     value: 1734463327 // 2024/12/18
                //     // value: 1734549727 // 2024/12/19
                // }
                // 自定义日期
                // {
                //     field_id: 'column-4',
                //     operation: 'lt',
                //     value: 1734636127 // 2024/12/20
                // }
                // {
                //     field_id: 'column-4',
                //     operation: 'empty',
                //     value: null
                // }
                // {
                //     field_id: 'column-4',
                //     operation: 'between',
                //     value: [1733944927, 1734722527] // 2024-12-12 ~2024-12-21
                // }
                // 更新人（外部数据，不在内部处理）
                // {
                //     field_id: 'column-11',
                //     operation: 'in',
                //     value: [
                //         // 角色
                //         {
                //             data: { _id: '00000000000000000000000000000000', name: '当前用户', avatar: '' },
                //             id: '00000000000000000000000000000000',
                //             type: 4
                //         },
                //         // 成员
                //         {
                //             data: {
                //                 avatar: '',
                //                 change_status_at: 1734081536,
                //                 change_status_by: '1bac4cf15df049fab7aec61f8be0aadc',
                //                 created_at: 1734081502,
                //                 department_id: null,
                //                 display_name: '虾米',
                //                 display_name_pinyin: 'xm,xiami',
                //                 employee_number: '',
                //                 job_id: null,
                //                 name: 'xiami',
                //                 need_reset_password: 0,
                //                 role_ids: [],
                //                 short_code: '',
                //                 status: 1,
                //                 team: '637ae6b5022821d7a3c197b5',
                //                 uid: '1bac4cf15df049fab7aec61f8be0aadc'
                //             },
                //             id: '1bac4cf15df049fab7aec61f8be0aadc',
                //             type: 1
                //         },
                //         // 部门
                //         {
                //             data: {
                //                 admin_uids: [],
                //                 avatar: '',
                //                 created_at: 1734406540,
                //                 description: '',
                //                 has_admin: false,
                //                 is_system: 0,
                //                 members: [
                //                     {
                //                         avatar: '',
                //                         change_status_at: 1734081536,
                //                         change_status_by: '1bac4cf15df049fab7aec61f8be0aadc',
                //                         created_at: 1734081502,
                //                         department_id: null,
                //                         display_name: '虾米',
                //                         display_name_pinyin: 'xm,xiami',
                //                         employee_number: '',
                //                         job_id: null,
                //                         name: 'xiami',
                //                         need_reset_password: 0,
                //                         role_ids: [],
                //                         short_code: '',
                //                         status: 1,
                //                         team: '637ae6b5022821d7a3c197b5',
                //                         uid: '1bac4cf15df049fab7aec61f8be0aadc'
                //                     },
                //                     {
                //                         avatar: '',
                //                         change_status_at: 1721204669,
                //                         change_status_by: '2aaa1dc584e2420f8b2bf7bc2364e4ab',
                //                         created_at: 1721204627,
                //                         department_id: null,
                //                         display_name: 'admin',
                //                         display_name_pinyin: 'admin,admin',
                //                         employee_number: '',
                //                         job_id: null,
                //                         name: 'admin',
                //                         need_reset_password: 0,
                //                         role_ids: [
                //                             '000000000000000000000004',
                //                             '211000000000000000000000',
                //                             '215100000000000000000000',
                //                             '215200000000000000000000',
                //                             '220000000000000000000000',
                //                             '221000000000000000000000',
                //                             '223000000000000000000000',
                //                             '224000000000000000000000',
                //                             '65e974929532f65f2301a677',
                //                             '66b575b19f7714a53649057e',
                //                             '66b575b19f7714a53649057f',
                //                             '66b575b19f7714a536490580',
                //                             '66b575b19f7714a536490581',
                //                             '66b575b19f7714a536490582',
                //                             '66b575b19f7714a536490583',
                //                             '66b575b19f7714a536490584',
                //                             '66b575b19f7714a536490585',
                //                             '66b575b19f7714a536490586',
                //                             '66b575b19f7714a536490587',
                //                             '66b575b19f7714a536490588',
                //                             '66b575b19f7714a536490589',
                //                             '66b575b19f7714a53649058a',
                //                             '66b575b19f7714a53649058b',
                //                             '66b575b19f7714a53649058c',
                //                             '66b575b19f7714a53649058d',
                //                             '66b575b19f7714a53649058e'
                //                         ],
                //                         short_code: '',
                //                         status: 1,
                //                         team: '637ae6b5022821d7a3c197b5',
                //                         uid: '2aaa1dc584e2420f8b2bf7bc2364e4ab'
                //                     }
                //                 ],
                //                 name: '团队A',
                //                 name_pinyin: 'tdA,tuanduiA',
                //                 node_id: '6760f18c960dc421d47e6d3e',
                //                 position: 65536,
                //                 section_id: null,
                //                 type: 'category',
                //                 uids: ['1bac4cf15df049fab7aec61f8be0aadc', '2aaa1dc584e2420f8b2bf7bc2364e4ab'],
                //                 visibility: 2,
                //                 _id: '6760f18c960dc421d47e6d3e'
                //             },
                //             id: '6760f18c960dc421d47e6d3e',
                //             type: 2
                //         }
                //     ]
                // }
                // 更新人 string
                // {
                //     field_id: 'column-11',
                //     operation: 'in', // nin, in, exists, empty
                //     value: ['member_03']
                // }
                // 自定义成员
                // {
                //     field_id: 'column-5',
                //     operation: 'in', // nin, in, exists, empty
                //     value: ['member_05', 'member_07']
                // }
            ],
            is_keep_sort: true,
            sorts: [{ direction: 1, sort_by: 'column-5' }], // 自定义成员：column-5， 更新人：column-11， 下拉单选：column-111，多选：column-22
            keywords: '' // 链接
        };
        const view = this.views().find((view) => view._id === this.activeViewId()) as AITableView;
        return { ...view, settings };
    });

    activeViewShortId = computed(() => {
        return this.activeView().short_id;
    });

    sortKeysMap: Partial<Record<AITableFieldType, string>> = {
        [AITableFieldType.createdBy]: 'display_name_pinyin',
        [AITableFieldType.updatedBy]: 'display_name_pinyin',
        [AITableFieldType.member]: 'display_name_pinyin'
    };

    renderRecords = computed(() => {
        return buildRecordsByView(
            this.aiTable,
            this.records(),
            this.fields(),
            this.activeView() as AITableView,
            this.sortKeysMap
        ) as AITableViewRecords;
    });

    renderFields = computed(() => {
        return buildFieldsByView(this.aiTable, this.fields(), this.activeView() as AITableView) as AITableViewFields;
    });

    keywords = computed(() => {
        return this.activeView().settings?.keywords;
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
        this.provider.once('sync', () => {
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
