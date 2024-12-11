import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import Konva from 'konva';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoEventObject, KoShape, KoStage } from '../angular-konva';
import { AI_TABLE_FIELD_ADD_BUTTON_WIDTH, AI_TABLE_ROW_HEAD_WIDTH } from '../constants';
import { AITable } from '../core';
import { AITableRendererConfig } from '../types';
import { getVisibleRangeInfo } from '../utils';
import {
    AITableAddField,
    AITableCells,
    AITableColumnHeads,
    AITableFieldHead,
    AITableFrozenCells,
    AITableFrozenColumnHeads,
    AITableFrozenPlaceholderCells,
    AITableHoverRowHeads,
    AITableIcon,
    AITableOtherRows,
    AITablePlaceholderCells
} from './components';
import { createActiveCellBorder } from './creations/create-active-cell-border';

Konva.pixelRatio = 2;

@Component({
    selector: 'ai-table-renderer',
    templateUrl: './renderer.component.html',
    standalone: true,
    imports: [
        KoContainer,
        KoStage,
        KoShape,
        AITableColumnHeads,
        AITableFrozenColumnHeads,
        AITableCells,
        AITableFrozenCells,
        AITableFrozenPlaceholderCells,
        AITablePlaceholderCells,
        AITableAddField,
        AITableHoverRowHeads,
        AITableOtherRows
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableRenderer {
    config = input.required<AITableRendererConfig>();

    koMousemove = output<KoEventObject<MouseEvent>>();

    koMousedown = output<KoEventObject<MouseEvent>>();

    koContextmenu = output<KoEventObject<MouseEvent>>();

    koWheel = output<KoEventObject<WheelEvent>>();

    koClick = output<KoEventObject<MouseEvent>>();

    koDblclick = output<KoEventObject<MouseEvent>>();

    fields = computed(() => {
        return AITable.getVisibleFields(this.config().aiTable);
    });

    readonly = computed(() => {
        return this.config()?.readonly;
    });

    coordinate = computed(() => {
        return this.config()?.coordinate;
    });

    containerWidth = computed<number>(() => {
        return this.config().containerWidth;
    });

    containerHeight = computed<number>(() => {
        return this.config().containerHeight;
    });

    scrollState = computed(() => {
        return this.config()?.aiTable!.context!.scrollState();
    });

    visibleRangeInfo = computed(() => {
        return getVisibleRangeInfo(this.coordinate()!, this.scrollState()!);
    });

    frozenAreaWidth = computed(() => {
        return AI_TABLE_ROW_HEAD_WIDTH + this.coordinate()!.frozenColumnWidth!;
    });

    lastColumnWidth = computed(() => {
        return this.coordinate()!.getColumnWidth(this.visibleRangeInfo().columnStopIndex);
    });

    lastColumnOffset = computed(() => {
        return this.coordinate()!.getColumnOffset(this.visibleRangeInfo().columnStopIndex);
    });

    cellGroupClipWidth = computed(() => {
        return this.containerWidth() - this.frozenAreaWidth();
    });

    stageConfig = computed<Partial<StageConfig>>(() => {
        const { isScrolling } = this.scrollState()!;
        return {
            width: this.containerWidth(),
            height: this.containerHeight(),
            listening: isScrolling ? false : true
        };
    });

    gridGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: 0,
            clipY: 0,
            clipWidth: this.containerWidth(),
            clipHeight: this.containerHeight()
        };
    });

    commonGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: this.frozenAreaWidth() + 1,
            clipY: 0,
            clipWidth: this.cellGroupClipWidth(),
            clipHeight: this.containerHeight()
        };
    });

    attachGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: this.frozenAreaWidth() - 1,
            clipY: this.coordinate()!.rowInitSize - 1,
            clipWidth: this.containerWidth() - this.frozenAreaWidth(),
            clipHeight: this.containerHeight() - this.coordinate()!.rowInitSize
        };
    });

    frozenAttachGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: 0,
            clipY: this.coordinate()!.rowInitSize - 1,
            clipWidth: this.frozenAreaWidth() + 4,
            clipHeight: this.containerHeight() - this.coordinate()!.rowInitSize
        };
    });

    offsetYConfig = computed<Partial<StageConfig>>(() => {
        const { scrollTop } = this.scrollState()!;
        return {
            offsetY: scrollTop
        };
    });

    offsetXConfig = computed<Partial<StageConfig>>(() => {
        const { scrollLeft } = this.scrollState()!;
        return {
            offsetX: scrollLeft
        };
    });

    offsetConfig = computed<Partial<StageConfig>>(() => {
        const { scrollLeft, scrollTop } = this.scrollState()!;
        return {
            offsetX: scrollLeft,
            offsetY: scrollTop
        };
    });

    columnHeadOrAddFieldConfig = computed(() => {
        const { columnStartIndex, columnStopIndex } = this.visibleRangeInfo();
        const { aiTable, coordinate, readonly } = this.config();
        const { pointPosition } = aiTable.context!;
        const fields = this.fields();
        return {
            aiTable,
            coordinate,
            fields,
            columnStartIndex,
            columnStopIndex,
            pointPosition: pointPosition(),
            readonly
        };
    });

    cellsConfig = computed(() => {
        const { aiTable, coordinate, references } = this.config();
        const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = this.visibleRangeInfo();
        return {
            aiTable,
            coordinate,
            references,
            rowStartIndex,
            rowStopIndex,
            columnStartIndex,
            columnStopIndex
        };
    });

    activeCellBorderConfig = computed(() => {
        return createActiveCellBorder(this.cellsConfig());
    });

    stageMousemove(e: KoEventObject<MouseEvent>) {
        this.koMousemove.emit(e as KoEventObject<MouseEvent>);
    }

    stageMousedown(e: KoEventObject<MouseEvent>) {
        this.koMousedown.emit(e as KoEventObject<MouseEvent>);
    }

    stageContextmenu(e: KoEventObject<MouseEvent>) {
        this.koContextmenu.emit(e as KoEventObject<MouseEvent>);
    }

    stageClick(e: KoEventObject<MouseEvent>) {
        this.koClick.emit(e as KoEventObject<MouseEvent>);
    }

    stageDblclick(e: KoEventObject<MouseEvent>) {
        this.koDblclick.emit(e as KoEventObject<MouseEvent>);
    }
}
