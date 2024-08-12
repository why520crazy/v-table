import { AITable } from '@ai-table/grid';
import * as Y from 'yjs';
import { AITableSharedAction, AITableSharedView, SharedAITable, SharedType, ViewActionName } from '../types';
import { toTablePath } from '../utils';

export default function translateMapEvent(aiTable: AITable, event: Y.YMapEvent<unknown>): AITableSharedAction[] {
    const isViewTranslate = event.path.includes('views');
    if (isViewTranslate) {
        let [targetPath] = toTablePath(event.path) as [number];
        const targetSyncElement = event.target as SharedType;
        const targetElement = (aiTable as SharedAITable).views()[targetPath];
        const keyChanges: [string, { action: 'add' | 'update' | 'delete'; oldValue: any }][] = Array.from(event.changes.keys.entries());
        const newProperties: Partial<AITableSharedView> = {};
        const properties: Partial<AITableSharedView> = {};

        const entries: [string, any][] = keyChanges.map(([key, info]) => {
            const value = targetSyncElement.get(key);
            return [key, info.action === 'delete' ? null : value instanceof Y.AbstractType ? value.toJSON() : value];
        });

        for (const [key, value] of entries) {
            const k = key as keyof AITableSharedView;
            newProperties[k] = value;
        }

        const oldEntries = keyChanges.map(([key]) => [key, (targetElement as any)[key]]);

        for (const [key, value] of oldEntries) {
            const k = key as keyof AITableSharedView;
            properties[k] = value;
        }

        return [{ type: ViewActionName.setView, view: properties, newView: newProperties, path: [targetPath] }];
    }
    return [];
}
