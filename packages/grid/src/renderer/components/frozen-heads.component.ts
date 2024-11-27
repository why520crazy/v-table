import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoShape, KoContainer } from '../../angular-konva';
import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_HEAD_WIDTH,
    Colors
} from '../../constants';
import { AITableCheckType, AITableColumnHeadsConfig } from '../../types';
import { createColumnHeads } from '../creations/create-heads';
import { AITableFieldHead } from './field-head.component';
import { AITableIcon } from './icon.component';

@Component({
    selector: 'ai-table-frozen-column-heads',
    template: `
        <ko-rect [config]="numberHeadBgConfig()"></ko-rect>
        <ko-line [config]="topLineConfig"></ko-line>
        <ko-line [config]="bottomLineConfig()"></ko-line>
        <ko-group>
            <ai-table-icon [config]="iconConfig()"></ai-table-icon>
        </ko-group>
        @for (config of headConfigs(); track $index) {
            <ai-table-field-head [config]="config"></ai-table-field-head>
        }
        <ko-rect [config]="headBgConfig()"></ko-rect>
    `,
    standalone: true,
    imports: [KoShape, AITableFieldHead, AITableIcon, KoContainer],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFrozenColumnHeads {
    config = input.required<AITableColumnHeadsConfig>();

    coordinate = computed(() => {
        return this.config().coordinate;
    });

    isChecked = computed(() => {
        const { selection, records } = this.config().aiTable;
        return selection().selectedRecords.size === records().length;
    });

    fieldHeadHeight = computed(() => {
        return this.coordinate().rowInitSize;
    });

    headConfigs = computed(() => {
        return createColumnHeads({
            ...this.config(),
            columnStartIndex: 0,
            columnStopIndex: this.coordinate().frozenColumnCount - 1
        });
    });

    numberHeadBgConfig = computed<Partial<StageConfig>>(() => {
        return {
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            width: AI_TABLE_ROW_HEAD_WIDTH,
            height: this.fieldHeadHeight(),
            fill: Colors.white,
            listening: false
        };
    });

    topLineConfig = {
        x: AI_TABLE_OFFSET,
        y: AI_TABLE_OFFSET,
        points: [0, 0, AI_TABLE_ROW_HEAD_WIDTH, 0],
        stroke: Colors.gray200,
        strokeWidth: 1,
        listening: false
    };

    bottomLineConfig = computed(() => {
        return {
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            points: [AI_TABLE_ROW_HEAD_WIDTH, this.fieldHeadHeight(), 0, this.fieldHeadHeight()],
            stroke: Colors.gray200,
            strokeWidth: 1,
            listening: false
        };
    });

    iconConfig = computed(() => {
        return {
            name: AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
            x: AI_TABLE_CELL_PADDING,
            y: (this.fieldHeadHeight() - AI_TABLE_ICON_COMMON_SIZE) / 2,
            type: this.isChecked() ? AITableCheckType.checked : AITableCheckType.unchecked,
            fill:
                this.isChecked() || (this.config().pointPosition.targetName === AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX && !this.isChecked())
                    ? Colors.primary
                    : Colors.gray300
        };
    });

    headBgConfig = computed(() => {
        const { frozenColumnWidth } = this.coordinate();
        return {
            x: AI_TABLE_ROW_HEAD_WIDTH,
            y: AI_TABLE_OFFSET,
            width: frozenColumnWidth + AI_TABLE_OFFSET,
            height: this.fieldHeadHeight(),
            stroke: Colors.gray200,
            strokeWidth: 1,
            fill: Colors.transparent,
            listening: false
        };
    });
}
