import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AITableColumnHeadsConfig } from '../../types';
import { createColumnHeads } from '../creations/create-heads';
import { AITableFieldHead } from './field-head.component';

@Component({
    selector: 'ai-table-column-heads',
    template: `
        @for (config of headConfigs(); track $index) {
            <ai-table-field-head [config]="config"></ai-table-field-head>
        }
    `,
    standalone: true,
    imports: [AITableFieldHead],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableColumnHeads {
    config = input.required<AITableColumnHeadsConfig>();

    headConfigs = computed(() => {
        const { coordinate, columnStartIndex } = this.config();
        const { frozenColumnCount } = coordinate;
        return createColumnHeads({
            ...this.config(),
            columnStartIndex: Math.max(columnStartIndex, frozenColumnCount)
        });
    });
}
