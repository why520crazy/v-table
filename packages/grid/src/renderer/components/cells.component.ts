import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import Konva from 'konva';
import { KoShape } from '../../angular-konva';
import { AITableCellsOptions } from '../../types';
import { createCells } from '../creations/create-cells';

@Component({
    selector: 'ai-table-cells',
    template: ` <ko-shape [config]="cellsConfig()"></ko-shape> `,
    standalone: true,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCells {
    config = input.required<AITableCellsOptions>();

    cellsConfig = computed(() => {
        const { coordinate, columnStartIndex } = this.config();
        const { frozenColumnCount } = coordinate;
        return {
            listening: false,
            perfectDrawEnabled: false,
            sceneFunc: (ctx: Konva.Context) =>
                createCells({
                    ...this.config(),
                    ctx,
                    columnStartIndex: Math.max(columnStartIndex, frozenColumnCount)
                })
        };
    });
}
