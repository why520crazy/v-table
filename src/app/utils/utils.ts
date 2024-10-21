import { AITableFieldType, AITableReferences, AITableSelectOptionStyle } from '@ai-table/grid';
import { AITableViewFields, AITableViewRecords } from '@ai-table/state';

export function sortDataByView(data: AITableViewRecords | AITableViewFields, activeViewId: string) {
    const hasPositions = data.every((item) => item.positions && item.positions);
    if (hasPositions) {
        return [...data].sort((a, b) => a.positions[activeViewId] - b.positions[activeViewId]);
    }
    return data;
}

export const getDefaultTrackableEntity = () => {
    const member = 'member_01';
    const time = new Date().getTime();
    return { created_by: member, created_at: time, updated_by: member, updated_at: time };
};

export function getDefaultValue() {
    const initValue: {
        records: AITableViewRecords;
        fields: AITableViewFields;
    } = {
        records: [
            {
                _id: 'row-1',
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 0,
                    view2: 1
                },
                values: {
                    'column-1': '文本 1-1',
                    'column-2': ['_id_1'],
                    'column-20': ['66b31d0c8097a908f74bcd8a'],
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8a'],
                    'column-3': 1,
                    'column-4': { timestamp: 1682235946 },
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
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 1,
                    view2: 2
                },
                values: {
                    'column-1': '文本 2-1',
                    'column-2': ['_id_2'],
                    'column-20': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-21': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-22': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-3': 10,
                    'column-4': { timestamp: 1682235946 },
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
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 2,
                    view2: 0
                },
                values: {
                    'column-1': '文本 3-1',
                    'column-2': ['_id_3'],
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
                    'column-4': { timestamp: 1682235946 },
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
                    view2: 16
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-2',
                name: '单选',
                positions: {
                    view1: 1,
                    view2: 15
                },
                type: AITableFieldType.select,
                icon: 'check-circle',
                settings: {
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
                }
            },
            {
                _id: 'column-20',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选',
                settings: {
                    is_multiple: true,
                    option_style: AITableSelectOptionStyle.dot,
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
                    ]
                },
                positions: {
                    view1: 2,
                    view2: 14
                }
            },
            {
                _id: 'column-21',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选',
                settings: {
                    is_multiple: true,
                    option_style: AITableSelectOptionStyle.dot,
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
                    ]
                },
                positions: {
                    view1: 3,
                    view2: 13
                }
            },
            {
                _id: 'column-22',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选',
                settings: {
                    is_multiple: true,
                    option_style: AITableSelectOptionStyle.piece,
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
                    ]
                },

                positions: {
                    view1: 4,
                    view2: 12
                }
            },
            {
                _id: 'column-3',
                name: '数字',
                positions: {
                    view1: 5,
                    view2: 11
                },
                type: AITableFieldType.number
            },
            {
                _id: 'column-4',
                name: '日期',
                positions: {
                    view1: 6,
                    view2: 10
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
                settings: {
                    is_multiple: true
                },
                type: AITableFieldType.member
            },
            {
                _id: 'column-6',
                name: '进度',
                positions: {
                    view1: 8,
                    view2: 8
                },
                type: AITableFieldType.progress
            },
            {
                _id: 'column-7',
                name: '评分(📌)',
                positions: {
                    view1: 9,
                    view2: 7
                },
                type: AITableFieldType.rate
            },
            {
                _id: 'column-8',
                name: '链接(📌)',
                positions: {
                    view1: 10,
                    view2: 6
                },
                type: AITableFieldType.link
            },

            {
                _id: 'column-9',
                name: '创建人',
                positions: {
                    view1: 11,
                    view2: 5
                },
                type: AITableFieldType.createdBy
            },
            {
                _id: 'column-10',
                name: '创建时间',
                positions: {
                    view1: 12,
                    view2: 4
                },
                type: AITableFieldType.createdAt
            },
            {
                _id: 'column-11',
                name: '更新人',
                positions: {
                    view1: 13,
                    view2: 3
                },
                type: AITableFieldType.updatedBy
            },
            {
                _id: 'column-12',
                name: '更新时间',
                positions: {
                    view1: 14,
                    view2: 2
                },
                type: AITableFieldType.updatedAt
            }
        ]
    };
    return initValue;
}

export function getCanvasDefaultValue() {
    const initValue: {
        records: AITableViewRecords;
        fields: AITableViewFields;
    } = {
        records: [
            {
                _id: 'row-1',
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 0,
                    view2: 1
                },
                values: {
                    'column-1':
                        '文本 1-1 column-1 - 超级长的文本，用来测试文本省略或折行, 当超出允许打最大高度时，将形成内部滚动条。KonvaJS 是一个功能强大且富有创意的 JavaScript 库，为前端开发者带来了全新的图形绘制和交互体验。KonvaJS 开启了一扇通往绚丽视觉世界的大门。它提供了丰富的工具和功能，使开发者能够轻松地在网页上创建复杂而精美的图形。无论是简单的几何形状，如矩形、圆形和三角形，还是复杂的自定义图形，KonvaJS 都能胜任。它支持多种图形操作，包括缩放、旋转和移动，让你可以轻松地变换图形的外观和位置。通过直观的 API，开发者可以快速上手，轻松地控制图形的属性和行为。',
                    'column-13':
                        '文本 1-1 column-13 - 超级长的文本，用来测试文本省略或折行, 当超出允许打最大高度时，将形成内部滚动条。KonvaJS 是一个功能强大且富有创意的 JavaScript 库，为前端开发者带来了全新的图形绘制和交互体验。KonvaJS 开启了一扇通往绚丽视觉世界的大门。它提供了丰富的工具和功能，使开发者能够轻松地在网页上创建复杂而精美的图形。无论是简单的几何形状，如矩形、圆形和三角形，还是复杂的自定义图形，KonvaJS 都能胜任。它支持多种图形操作，包括缩放、旋转和移动，让你可以轻松地变换图形的外观和位置。通过直观的 API，开发者可以快速上手，轻松地控制图形的属性和行为。',
                    'column-2': ['_id_1'],
                    'column-110': ['dot_1'],
                    'column-111': ['piece_1'],
                    'column-112': ['tag_1'],
                    'column-20': ['66b31d0c8097a908f74bcd8a'],
                    'column-3': 1,
                    'column-4': { timestamp: 1682235946 },
                    'column-5': ['member_01'],
                    'column-6': 10,
                    'column-7': 5,
                    'column-8': {
                        url: 'https://www.baidu.com',
                        text: '百度链接'
                    },
                    'column-9': ['member_01'],
                    'column-10': { timestamp: 1682235946 },
                    'column-11': ['member_02'],
                    'column-12': { timestamp: 1720490727 },
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8b', '66b31d0c8097a908f74bcd8a'],
                    'column-23': ['66b31d0c8097a908f74bcd8e', '66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b']
                }
            },
            {
                _id: 'row-2',
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 1,
                    view2: 2
                },
                values: {
                    'column-1': '文本 2-1 column-1',
                    'column-13': '文本 2-1 column-13',
                    'column-2': ['_id_2'],
                    'column-110': ['dot_2'],
                    'column-111': ['piece_2'],
                    'column-112': ['tag_2'],
                    'column-20': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                    'column-3': 10,
                    'column-4': { timestamp: 1682235946 },
                    'column-5': ['member_01', 'member_02', 'member_03', 'member_04', 'member_05', 'member_06', 'member_07', 'member_08'],
                    'column-6': 50,
                    'column-7': 4,
                    'column-8': {},
                    'column-9': ['member_01'],
                    'column-10': { timestamp: 1682235946 },
                    'column-11': ['member_02'],
                    'column-12': { timestamp: 1720490727 },
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8b', '66b31d0c8097a908f74bcd8a'],
                    'column-23': ['66b31d0c8097a908f74bcd8e', '66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b']
                }
            },
            {
                _id: 'row-3',
                ...getDefaultTrackableEntity(),
                positions: {
                    view1: 2,
                    view2: 0
                },
                values: {
                    'column-1': '文本 3-1 column-1',
                    'column-13': '文本 3-1 column-13',
                    'column-2': ['_id_3'],
                    'column-110': ['dot_3'],
                    'column-111': ['piece_3'],
                    'column-112': ['tag_3'],
                    'column-20': [
                        '66b31d0c8097a908f74bcd8a',
                        '66b31d0c8097a908f74bcd8b',
                        '66b31d0c8097a908f74bcd8c',
                        '66b31d0c8097a908f74bcd8d'
                    ],
                    'column-3': 100,
                    'column-4': { timestamp: 1682235946 },
                    'column-5': [],
                    'column-6': 100,
                    'column-7': 3,
                    'column-8': {},
                    'column-9': [],
                    'column-10': { timestamp: 1727254598 },
                    'column-11': ['member_02'],
                    'column-12': { timestamp: 1720490727 },
                    'column-21': ['66b31d0c8097a908f74bcd8a'],
                    'column-22': ['66b31d0c8097a908f74bcd8b', '66b31d0c8097a908f74bcd8a'],
                    'column-23': ['66b31d0c8097a908f74bcd8e', '66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b']
                }
            }
        ],
        fields: [
            {
                _id: 'column-13',
                name: '单行文本2',
                positions: {
                    view1: 1,
                    view2: 17
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-1',
                name: '单行文本1',
                positions: {
                    view1: 0,
                    view2: 18
                },
                type: AITableFieldType.text
            },
            {
                _id: 'column-2',
                name: '单选',
                positions: {
                    view1: 2,
                    view2: 16
                },
                type: AITableFieldType.select,
                icon: 'check-circle',
                settings: {
                    options: [
                        {
                            _id: '_id_1',
                            text: '开始',
                            color: '#5dcfff'
                        },
                        {
                            _id: '_id_2',
                            text: '进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中',
                            color: '#ffcd5d'
                        },
                        {
                            _id: '_id_3',
                            text: '已完成',
                            color: '#73d897'
                        }
                    ]
                }
            },
            {
                _id: 'column-110',
                name: 'dot单选',
                positions: {
                    view1: 3,
                    view2: 15
                },
                type: AITableFieldType.select,
                icon: 'check-circle',
                settings: {
                    option_style: AITableSelectOptionStyle.dot,
                    options: [
                        {
                            _id: 'dot_1',
                            text: '开始开始开始开始开始开始开始开始开始开始开始开始开始开始开始开始开始开始',
                            color: '#5dcfff'
                        },
                        {
                            _id: 'dot_2',
                            text: '进行中',
                            color: '#ffcd5d'
                        },
                        {
                            _id: 'dot_3',
                            text: '已完成',
                            color: '#73d897'
                        }
                    ]
                }
            },
            {
                _id: 'column-111',
                name: 'piece单选',
                positions: {
                    view1: 4,
                    view2: 14
                },
                type: AITableFieldType.select,
                icon: 'check-circle',
                settings: {
                    option_style: AITableSelectOptionStyle.piece,
                    options: [
                        {
                            _id: 'piece_1',
                            text: '开始',
                            color: '#5dcfff'
                        },
                        {
                            _id: 'piece_2',
                            text: '进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中',
                            color: '#ffcd5d'
                        },
                        {
                            _id: 'piece_3',
                            text: '已完成',
                            color: '#73d897'
                        }
                    ]
                }
            },
            {
                _id: 'column-112',
                name: 'tag单选',
                positions: {
                    view1: 5,
                    view2: 13
                },
                type: AITableFieldType.select,
                icon: 'check-circle',
                settings: {
                    option_style: AITableSelectOptionStyle.tag,
                    options: [
                        {
                            _id: 'tag_1',
                            text: '开',
                            color: '#5dcfff'
                        },
                        {
                            _id: 'tag_2',
                            text: '进行中',
                            color: '#ffcd5d'
                        },
                        {
                            _id: 'tag_3',
                            text: '已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成已完成',
                            color: '#73d897'
                        }
                    ]
                }
            },
            {
                _id: 'column-20',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选',
                settings: {
                    is_multiple: true,
                    option_style: AITableSelectOptionStyle.tag,
                    options: [
                        {
                            text: '111',
                            bg_color: '#E48483',
                            _id: '66b31d0c8097a908f74bcd8a'
                        },
                        {
                            text: '选项卡2选项卡2选项卡2选项卡2选项卡2选项卡2',
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
                    ]
                },
                positions: {
                    view1: 6,
                    view2: 12
                }
            },
            {
                _id: 'column-3',
                name: '数字',
                positions: {
                    view1: 7,
                    view2: 11
                },
                type: AITableFieldType.number
            },
            {
                _id: 'column-4',
                name: '日期',
                positions: {
                    view1: 8,
                    view2: 10
                },
                type: AITableFieldType.date
            },
            {
                _id: 'column-5',
                name: '成员',
                positions: {
                    view1: 9,
                    view2: 9
                },
                settings: {
                    is_multiple: true
                },
                type: AITableFieldType.member
            },
            {
                _id: 'column-6',
                name: '进度',
                positions: {
                    view1: 10,
                    view2: 8
                },
                type: AITableFieldType.progress
            },
            {
                _id: 'column-7',
                name: '评分',
                positions: {
                    view1: 11,
                    view2: 7
                },
                type: AITableFieldType.rate
            },
            {
                _id: 'column-8',
                name: '链接',
                positions: {
                    view1: 12,
                    view2: 6
                },
                type: AITableFieldType.link
            },
            {
                _id: 'column-9',
                name: '创建人',
                positions: {
                    view1: 13,
                    view2: 5
                },
                type: AITableFieldType.createdBy
            },
            {
                _id: 'column-10',
                name: '创建时间',
                positions: {
                    view1: 14,
                    view2: 4
                },
                type: AITableFieldType.createdAt
            },
            {
                _id: 'column-11',
                name: '更新人',
                positions: {
                    view1: 15,
                    view2: 3
                },
                type: AITableFieldType.updatedBy
            },
            {
                _id: 'column-12',
                name: '更新时间',
                positions: {
                    view1: 16,
                    view2: 2
                },
                type: AITableFieldType.updatedAt
            },
            {
                _id: 'column-21',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选 piece',
                settings: {
                    is_multiple: true,
                    option_style: AITableSelectOptionStyle.piece,
                    options: [
                        {
                            text: '111',
                            bg_color: '#E48483',
                            _id: '66b31d0c8097a908f74bcd8a'
                        },
                        {
                            text: '选项卡2选项卡2选项卡2选项卡2选项卡2选项卡2',
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
                    ]
                },
                positions: {
                    view1: 17,
                    view2: 1
                }
            },
            {
                _id: 'column-22',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选 dot',
                settings: {
                    is_multiple: true,
                    option_style: AITableSelectOptionStyle.dot,
                    options: [
                        {
                            text: '111',
                            bg_color: '#E48483',
                            _id: '66b31d0c8097a908f74bcd8a'
                        },
                        {
                            text: '选项卡2选项卡2选项卡2选项卡2选项卡2选项卡2',
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
                    ]
                },
                positions: {
                    view1: 18,
                    view2: 0
                }
            },
            {
                _id: 'column-23',
                type: AITableFieldType.select,
                icon: 'list-check',
                name: '多选 text',
                settings: {
                    is_multiple: true,
                    options: [
                        {
                            text: '111',
                            bg_color: '#E48483',
                            _id: '66b31d0c8097a908f74bcd8a'
                        },
                        {
                            text: '选项卡2选项卡2选项卡2选项卡2选项卡2选项卡2',
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
                    ]
                },
                positions: {
                    view1: 19,
                    view2: -1
                }
            }
        ]
    };
    return initValue;
}

export function getBigData() {
    const initValue: {
        records: AITableViewRecords;
        fields: AITableViewFields;
    } = {
        records: [],
        fields: []
    };

    console.time('build data');
    initValue.fields = getCanvasDefaultValue().fields;
    initValue.records = [];
    for (let index = 0; index < 500000; index++) {
        initValue.records.push({
            _id: `row-${index + 1}`,
            ...getDefaultTrackableEntity(),
            positions: { view1: index, view2: index },
            values: {
                'column-1': '文本 2-1',
                'column-13': '文本 2-1',
                'column-2': ['_id_2'],
                'column-110': ['dot_2'],
                'column-111': ['piece_2'],
                'column-112': ['tag_2'],
                'column-20': ['66b31d0c8097a908f74bcd8a', '66b31d0c8097a908f74bcd8b'],
                'column-3': 10,
                'column-4': { timestamp: 1682235946 },
                'column-5': ['member_01', 'member_02'],
                'column-6': 50,
                'column-7': 3,
                'column-8': {},
                'column-9': ['member_01'],
                'column-10': { timestamp: 1682235946 },
                'column-11': ['member_02'],
                'column-12': { timestamp: 1720490727 }
            }
        });
    }
    console.timeEnd('build data');
    return initValue;
}

export function getReferences(): AITableReferences {
    return {
        members: {
            member_01: {
                uid: 'member_01',
                display_name: 'admin',
                avatar: 'https://web.on-premises-alpha.pingcode.live/pc-avatar/c04446a4-bfcc-4a05-846c-e3241e1b68df_80x80.png'
            },
            member_02: {
                uid: 'member_02',
                display_name: 'member',
                avatar: ''
            },
            member_03: {
                uid: 'member_03',
                display_name: 'Maple13',
                avatar: ''
            },
            member_04: {
                uid: 'member_04',
                display_name: 'canvas',
                avatar: ''
            },
            member_05: {
                uid: 'member_05',
                display_name: 'svg',
                avatar: ''
            },
            member_06: {
                uid: 'member_06',
                display_name: 'html',
                avatar: ''
            },
            member_07: {
                uid: 'member_07',
                display_name: 'css',
                avatar: ''
            },
            member_08: {
                uid: 'member_08',
                display_name: 'Angular',
                avatar: ''
            }
        }
    };
}
