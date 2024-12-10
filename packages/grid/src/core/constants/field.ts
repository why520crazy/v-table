import { AITableFieldOption, AITableFieldType } from '../types';

export const FieldOptions: AITableFieldOption[] = [
    {
        type: AITableFieldType.text,
        name: '单行文本',
        icon: 'font',
        width: 200
    },
    // 多行文本
    {
        type: AITableFieldType.select,
        name: '单选',
        icon: 'check-circle',
        width: 200
    },
    {
        type: AITableFieldType.select,
        name: '多选',
        icon: 'list-check',
        width: 200,
        settings: {
            is_multiple: true
        }
    },
    {
        type: AITableFieldType.number,
        name: '数字',
        icon: 'hashtag',
        width: 200
    },
    {
        type: AITableFieldType.date,
        name: '日期',
        icon: 'calendar',
        width: 200
    },
    {
        type: AITableFieldType.member,
        name: '单个成员',
        icon: 'user',
        width: 200
    },
    {
        type: AITableFieldType.member,
        name: '多个成员',
        icon: 'user',
        width: 200,
        settings: {
            is_multiple: true
        }
    },
    // 级联单选
    // 级联多选
    {
        type: AITableFieldType.progress,
        name: '进度',
        icon: 'progress',
        width: 200
    },
    {
        type: AITableFieldType.rate,
        name: '评分',
        icon: 'star-circle',
        width: 200
    },
    {
        type: AITableFieldType.link,
        name: '链接',
        icon: 'link-insert',
        width: 300
    },
    {
        type: AITableFieldType.createdBy,
        name: '创建人',
        icon: 'user',
        width: 200
    },
    {
        type: AITableFieldType.createdAt,
        name: '创建时间',
        icon: 'calendar',
        width: 200
    },
    {
        type: AITableFieldType.updatedBy,
        name: '更新人',
        icon: 'user',
        width: 200
    },
    {
        type: AITableFieldType.updatedAt,
        name: '更新时间',
        icon: 'calendar',
        width: 200
    }
];