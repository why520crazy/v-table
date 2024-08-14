import { AITableFieldType, AITableReferences, AITableSelectOptionStyle } from '@ai-table/grid';
import { AITableView, AITableViewFields, AITableViewRecords, Positions } from '@ai-table/shared';

export function sortDataByView(data: AITableViewRecords | AITableViewFields, activeViewId: string) {
    const hasPositions = data.every((item) => item.positions && item.positions);
    if (hasPositions) {
        return [...data].sort((a, b) => a.positions[activeViewId] - b.positions[activeViewId]);
    }
    return data;
}

export function createDefaultPositions(views: AITableView[], index: number) {
    const positions: Positions = {};
    views.forEach((element) => {
        positions[element._id] = index;
    });
    return positions;
}

export function getDefaultValue() {
    const initValue: {
        records: AITableViewRecords;
        fields: AITableViewFields;
    } = {
        records: [
            {
                _id: 'row-1',
                positions: {
                    view1: 0,
                    view2: 1
                },
                values: {
                    'column-1': '文本 1-1',
                    'column-2': ['1'],
                    'column-20': ['66b31d0c8097a908f74bcd8a'],
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8a'],
                    'column-3': 1,
                    'column-4': 1682235946,
                    'column-5': ['member_01'],
                    'column-6': 10,
                    'column-7': 3,
                    'column-8': {
                        url: 'https://www.baidu.com',
                        text: '百度链接'
                    },
                    'column-9': ['member_01'],
                    'column-10': 1682235946,
                    'column-11': ['member_02'],
                    'column-12': 1720490727
                }
            },
            {
                _id: 'row-2',
                positions: {
                    view1: 1,
                    view2: 2
                },
                values: {
                    'column-1': '文本 2-1',
                    'column-2': ['2'],
                    'column-20': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-21': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-22': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-3': 10,
                    'column-4': 1682235946,
                    'column-5': ['member_01', 'member_02'],
                    'column-6': 50,
                    'column-7': 1,
                    'column-8': {},
                    'column-9': ['member_01'],
                    'column-10': 1682235946,
                    'column-11': ['member_02'],
                    'column-12': 1720490727
                }
            },
            {
                _id: 'row-3',
                positions: {
                    view1: 2,
                    view2: 0
                },
                values: {
                    'column-1': '文本 3-1',
                    'column-2': ['3'],
                    'column-20': [
                        '66b31d0c8097a908f74bcd8a',
                        '66b31d0c8097a908f74bcd8b',
                        '66b31d0c8097a908f74bcd8c',
                        '66b31d0c8097a908f74bcd8d'
                    ],
                    'column-21': [
                        '66b31d0c8097a908f74bcd8a',
                        '66b31d0c8097a908f74bcd8b',
                        '66b31d0c8097a908f74bcd8c',
                        '66b31d0c8097a908f74bcd8d'
                    ],
                    'column-22': [
                        '66b31d0c8097a908f74bcd8a',
                        '66b31d0c8097a908f74bcd8b',
                        '66b31d0c8097a908f74bcd8c',
                        '66b31d0c8097a908f74bcd8d'
                    ],
                    'column-3': 100,
                    'column-4': 1682235946,
                    'column-5': [],
                    'column-6': 100,
                    'column-7': 1,
                    'column-8': {},
                    'column-9': [],
                    'column-10': 1682235946,
                    'column-11': ['member_02'],
                    'column-12': 1720490727
                }
            }
        ],
        fields: [
            {
                _id: 'column-1',
                name: '单行文本',
                positions: {
                    view1: 0,
                    view2: 1
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-2',
                name: '单选',
                positions: {
                    view1: 1,
                    view2: 2
                },
                type: AITableFieldType.select,
                icon: 'check-circle',
                options: [
                    {
                        _id: '1',
                        text: '开始',
                        color: '#5dcfff'
                    },
                    {
                        _id: '2',
                        text: '进行中',
                        color: '#ffcd5d'
                    },
                    {
                        _id: '3',
                        text: '已完成',
                        color: '#73d897'
                    }
                ]
            },
            {
                _id: 'column-20',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选',
                isMultiple: true,
                optionStyle: AITableSelectOptionStyle.tag,
                options: [
                    {
                        text: '111',
                        bg_color: '#E48483',
                        _id: '66b31d0c8097a908f74bcd8a'
                    },
                    {
                        text: '222',
                        bg_color: '#E0B75D',
                        _id: '66b31d0c8097a908f74bcd8b'
                    },
                    {
                        text: '333',
                        bg_color: '#69B1E4',
                        _id: '66b31d0c8097a908f74bcd8c'
                    },
                    {
                        text: '444',
                        bg_color: '#77C386',
                        _id: '66b31d0c8097a908f74bcd8d'
                    },
                    {
                        text: '555',
                        bg_color: '#6EC4C4',
                        _id: '66b31d0c8097a908f74bcd8e'
                    },
                    {
                        text: '666',
                        bg_color: '#E581D4',
                        _id: '66b31d0c8097a908f74bcd8f'
                    },
                    {
                        text: '777',
                        bg_color: '#B0C774',
                        _id: '66b31d0c8097a908f74bcd90'
                    }
                ],
                positions: {
                    view1: 2,
                    view2: 3
                }
            },
            {
                _id: 'column-21',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选',
                isMultiple: true,
                optionStyle: AITableSelectOptionStyle.dot,
                options: [
                    {
                        text: '111',
                        bg_color: '#E48483',
                        _id: '66b31d0c8097a908f74bcd8a'
                    },
                    {
                        text: '222',
                        bg_color: '#E0B75D',
                        _id: '66b31d0c8097a908f74bcd8b'
                    },
                    {
                        text: '333',
                        bg_color: '#69B1E4',
                        _id: '66b31d0c8097a908f74bcd8c'
                    },
                    {
                        text: '444',
                        bg_color: '#77C386',
                        _id: '66b31d0c8097a908f74bcd8d'
                    },
                    {
                        text: '555',
                        bg_color: '#6EC4C4',
                        _id: '66b31d0c8097a908f74bcd8e'
                    },
                    {
                        text: '666',
                        bg_color: '#E581D4',
                        _id: '66b31d0c8097a908f74bcd8f'
                    },
                    {
                        text: '777',
                        bg_color: '#B0C774',
                        _id: '66b31d0c8097a908f74bcd90'
                    }
                ],
                positions: {
                    view1: 3,
                    view2: 4
                }
            },
            {
                _id: 'column-22',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选',
                isMultiple: true,
                optionStyle: AITableSelectOptionStyle.piece,
                options: [
                    {
                        text: '111',
                        bg_color: '#E48483',
                        _id: '66b31d0c8097a908f74bcd8a'
                    },
                    {
                        text: '222',
                        bg_color: '#E0B75D',
                        _id: '66b31d0c8097a908f74bcd8b'
                    },
                    {
                        text: '333',
                        bg_color: '#69B1E4',
                        _id: '66b31d0c8097a908f74bcd8c'
                    },
                    {
                        text: '444',
                        bg_color: '#77C386',
                        _id: '66b31d0c8097a908f74bcd8d'
                    },
                    {
                        text: '555',
                        bg_color: '#6EC4C4',
                        _id: '66b31d0c8097a908f74bcd8e'
                    },
                    {
                        text: '666',
                        bg_color: '#E581D4',
                        _id: '66b31d0c8097a908f74bcd8f'
                    },
                    {
                        text: '777',
                        bg_color: '#B0C774',
                        _id: '66b31d0c8097a908f74bcd90'
                    }
                ],
                positions: {
                    view1: 4,
                    view2: 5
                }
            },
            {
                _id: 'column-3',
                name: '数字',
                positions: {
                    view1: 5,
                    view2: 7
                },
                type: AITableFieldType.number
            },
            {
                _id: 'column-4',
                name: '日期',
                positions: {
                    view1: 6,
                    view2: 8
                },
                type: AITableFieldType.date
            },
            {
                _id: 'column-5',
                name: '成员(📌)',
                positions: {
                    view1: 7,
                    view2: 9
                },
                isMultiple: true,
                type: AITableFieldType.member
            },
            {
                _id: 'column-6',
                name: '进度',
                positions: {
                    view1: 8,
                    view2: 10
                },
                type: AITableFieldType.progress
            },
            {
                _id: 'column-7',
                name: '评分(📌)',
                positions: {
                    view1: 9,
                    view2: 11
                },
                type: AITableFieldType.rate
            },
            {
                _id: 'column-8',
                name: '链接(📌)',
                positions: {
                    view1: 10,
                    view2: 12
                },
                type: AITableFieldType.link
            },

            {
                _id: 'column-9',
                name: '创建人',
                positions: {
                    view1: 11,
                    view2: 13
                },
                type: AITableFieldType.createdBy
            },
            {
                _id: 'column-10',
                name: '创建时间',
                positions: {
                    view1: 12,
                    view2: 14
                },
                type: AITableFieldType.createdAt
            },
            {
                _id: 'column-11',
                name: '更新人',
                positions: {
                    view1: 13,
                    view2: 15
                },
                type: AITableFieldType.updatedBy
            },
            {
                _id: 'column-12',
                name: '更新时间',
                positions: {
                    view1: 14,
                    view2: 16
                },
                type: AITableFieldType.updatedAt
            }
        ]
    };

    // console.time('build data');
    // initValue.fields = [];
    // for (let index = 0; index < 5; index++) {
    //     initValue.fields.push({
    //         _id: `column-${index}`,
    //         name: '文本',
    //         positions: { view1: index, view2: index },
    //         type: AITableFieldType.text
    //     });
    // }
    // initValue.records = [];
    // for (let index = 0; index < 40 * 3 * 2 * 30; index++) {
    //     const value: any = {};
    //     initValue.fields.forEach((column, columnIndex) => {
    //         value[`${column._id}`] = `name-${index}-${columnIndex}`;
    //     });
    //     initValue.records.push({
    //         _id: `row-${index + 1}`,
    //         positions: { view1: index, view2: index },
    //         values: value
    //     });
    // }
    // console.timeEnd('build data');
    return initValue;
}

export function getReferences(): AITableReferences {
    return {
        members: {
            member_01: {
                uid: 'member_01',
                display_name: 'admin',
                avatar: ''
            },
            member_02: {
                uid: 'member_02',
                display_name: 'member',
                avatar: ''
            }
        }
    };
}

export function getCanvasDefaultValue() {
    const initValue: {
        records: AITableViewRecords;
        fields: AITableViewFields;
    } = {
        records: [
            {
                _id: 'row-1',
                positions: {
                    view1: 0,
                    view2: 1
                },
                values: {
                    'column-1': '文本 1-1',
                    'column-2': '文本 2-1',
                    'column-3': '文本 3-1',
                    'column-4': '文本 4-1',
                    'column-5': '文本 5-1',
                    'column-6': '文本 6-1',
                    'column-7': '文本 7-1',
                    'column-8': '文本 8-1',
                    'column-9': '文本 9-1',
                    'column-10': '1682235946',
                    'column-11': '1720490727'
                }
            },
            {
                _id: 'row-2',
                positions: {
                    view1: 1,
                    view2: 2
                },
                values: {
                    'column-1': '文本 1-2',
                    'column-2': '文本 2-2',
                    'column-3': '文本 3-2',
                    'column-4': '文本 4-2',
                    'column-5': '文本 5-2',
                    'column-6': '文本 6-2',
                    'column-7': '文本 7-2',
                    'column-8': '文本 8-2',
                    'column-9': '文本 9-2'
                }
            },
            {
                _id: 'row-3',
                positions: {
                    view1: 2,
                    view2: 0
                },
                values: {
                    'column-1': '文本 1-3',
                    'column-2': '文本 2-3',
                    'column-3': '文本 3-3',
                    'column-4': '文本 4-3',
                    'column-5': '文本 5-3',
                    'column-6': '文本 6-3',
                    'column-7': '文本 7-3',
                    'column-8': '文本 8-3',
                    'column-9': '文本 9-3'
                }
            }
        ],
        fields: [
            {
                _id: 'column-1',
                name: '单行文本1',
                positions: {
                    view1: 0,
                    view2: 1
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-2',
                name: '单行文本2',
                positions: {
                    view1: 1,
                    view2: 2
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-3',
                name: '单行文本3',
                positions: {
                    view1: 2,
                    view2: 3
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-4',
                name: '单行文本4',
                positions: {
                    view1: 3,
                    view2: 4
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-5',
                name: '单行文本5',
                positions: {
                    view1: 4,
                    view2: 5
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-6',
                name: '单行文本6',
                positions: {
                    view1: 5,
                    view2: 6
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-7',
                name: '单行文本7',
                positions: {
                    view1: 6,
                    view2: 7
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-8',
                name: '单行文本8',
                positions: {
                    view1: 7,
                    view2: 8
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-9',
                name: '单行文本9',
                positions: {
                    view1: 8,
                    view2: 9
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-10',
                name: '创建时间',
                positions: {
                    view1: 9,
                    view2: 10
                },
                type: AITableFieldType.createdAt
            },
            {
                _id: 'column-11',
                name: '更新时间',
                positions: {
                    view1: 10,
                    view2: 11
                },
                type: AITableFieldType.updatedAt
            }
        ]
    };
    return initValue;
}
