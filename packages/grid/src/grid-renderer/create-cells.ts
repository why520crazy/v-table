import Konva from 'konva';
import { AITableCellsOptions } from '../types';
import { cellsDrawer } from './cell/cells-drawer';

export const createCells = (options: AITableCellsOptions) => {
    const { instance, columnStartIndex } = options;
    const { frozenColumnCount } = instance;

    // 冻结列
    const frozenCells = new Konva.Shape({
        listening: false,
        perfectDrawEnabled: false,
        sceneFunc: (ctx: Konva.Context) =>
            cellsDrawer({
                ...options,
                ctx,
                columnStartIndex: 0,
                columnStopIndex: frozenColumnCount - 1
            })
    });

    // 非冻结列
    const cells = new Konva.Shape({
        listening: false,
        perfectDrawEnabled: false,
        sceneFunc: (ctx: Konva.Context) =>
            cellsDrawer({
                ...options,
                ctx,
                columnStartIndex: Math.max(columnStartIndex, frozenColumnCount)
            })
    });

    return {
        frozenCells,
        cells
    };
};
