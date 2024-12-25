import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    Signal,
    signal,
    viewChild,
    ViewContainerRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent } from 'rxjs';
import { KoEventObject } from './angular-konva';
import {
    AI_TABLE_CELL,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_PROHIBIT_CLEAR_SELECTION_CLASS,
    AI_TABLE_ROW_ADD_BUTTON,
    AI_TABLE_ROW_HEAD_WIDTH,
    AI_TABLE_ROW_SELECT_CHECKBOX,
    DBL_CLICK_EDIT_TYPE,
    DEFAULT_POINT_POSITION,
    DEFAULT_SCROLL_STATE,
    MOUSEOVER_EDIT_TYPE
} from './constants';
import { AITable, Coordinate, RendererContext, UpdateFieldValueOptions } from './core';
import { AITableGridBase } from './grid-base.component';
import { AITableRenderer } from './renderer/renderer.component';
import { AITableGridEventService } from './services/event.service';
import { AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { AITableMouseDownType, AITableRendererConfig, ScrollActionOptions } from './types';
import { buildGridLinearRows, getColumnIndicesMap, getDetailByTargetName, handleMouseStyle, isWindows } from './utils';
import { getMousePosition } from './utils/position';
import { AITableGridMatchCellService } from './services/match-cell.service';

@Component({
    selector: 'ai-table-grid',
    templateUrl: './grid.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid'
    },
    imports: [AITableRenderer],
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService, AITableGridMatchCellService]
})
export class AITableGrid extends AITableGridBase implements OnInit, OnDestroy {
    private viewContainerRef = inject(ViewContainerRef);

    timer!: number | null;

    resizeObserver!: ResizeObserver;

    fieldHeadHeight = AI_TABLE_FIELD_HEAD_HEIGHT;

    containerRect = signal({ width: 0, height: 0 });

    hasContainerRect = computed(() => {
        return this.containerRect().width > 0 && this.containerRect().height > 0;
    });

    container = viewChild<ElementRef>('container');

    verticalBarRef = viewChild<ElementRef>('verticalBar');

    horizontalBarRef = viewChild<ElementRef>('horizontalBar');

    linearRows = computed(() => {
        return buildGridLinearRows(this.gridData().records, !this.aiReadonly());
    });

    visibleColumnsMap = computed(() => {
        const columns = AITable.getVisibleFields(this.aiTable);
        return new Map(columns?.map((item, index) => [item._id, index]));
    });

    visibleRowsIndexMap = computed(() => {
        return new Map(this.linearRows().map((row, index) => [row._id, index]));
    });

    containerElement = computed(() => {
        return this.container()!.nativeElement;
    });

    rendererConfig: Signal<AITableRendererConfig> = computed(() => {
        const fields = AITable.getVisibleFields(this.aiTable);
        const coordinate = new Coordinate({
            container: this.containerElement(),
            rowHeight: AI_TABLE_FIELD_HEAD_HEIGHT,
            rowCount: this.linearRows().length,
            columnCount: fields.length,
            rowInitSize: AI_TABLE_FIELD_HEAD_HEIGHT,
            columnInitSize: AI_TABLE_ROW_HEAD_WIDTH,
            rowIndicesMap: {},
            columnIndicesMap: getColumnIndicesMap(fields),
            frozenColumnCount: 1
        });
        return {
            aiTable: this.aiTable,
            container: this.containerElement(),
            coordinate: coordinate,
            containerWidth: this.containerRect().width,
            containerHeight: this.containerRect().height,
            references: this.aiReferences(),
            readonly: this.aiReadonly()
        };
    });

    coordinate = computed(() => {
        return this.rendererConfig().coordinate;
    });

    scrollTotalHeight = computed(() => {
        return Math.max(this.coordinate().totalHeight, this.containerRect().height - this.fieldHeadHeight);
    });

    scrollbarWidth = computed(() => {
        return this.coordinate().totalWidth + AI_TABLE_FIELD_ADD_BUTTON_WIDTH;
    });

    constructor() {
        super();
        afterNextRender(() => {
            this.setContainerRect();
            this.bindGlobalMousedown();
            this.containerResizeListener();
            this.bindWheel();
        });
        effect(() => {
            if (this.hasContainerRect() && this.horizontalBarRef() && this.verticalBarRef()) {
                this.bindScrollBarScroll();
            }
        });
        effect(() => {
            if (!this.aiReadonly() && this.aiTable.context?.pointPosition()) {
                this.toggleHoverCellEditor();
            }
        });
        effect(
            () => {
                this.aiTableGridMatchCellService.findMatchedCells(this.aiKeywords()!, this.aiReferences());
            },
            { allowSignalWrites: true }
        );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initContext();
    }

    ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
    }

    private initContext() {
        this.aiTable.context = new RendererContext({
            linearRows: this.linearRows,
            visibleColumnsMap: this.visibleColumnsMap,
            visibleRowsIndexMap: this.visibleRowsIndexMap,
            pointPosition: signal(DEFAULT_POINT_POSITION),
            scrollState: signal(DEFAULT_SCROLL_STATE),
            scrollAction: this.scrollAction
        });
    }

    stageMousemove(e: KoEventObject<MouseEvent>) {
        if (this.timer) {
            cancelAnimationFrame(this.timer);
        }
        this.timer = requestAnimationFrame(() => {
            const targetName = e.event.target.name();
            const gridStage = e.event.currentTarget.getStage();
            const pos = gridStage?.getPointerPosition();
            if (pos == null) return;
            const { context } = this.aiTable;
            const { x, y } = pos;
            const curMousePosition = getMousePosition(
                x,
                y,
                this.coordinate(),
                AITable.getVisibleFields(this.aiTable),
                context!,
                targetName
            );
            handleMouseStyle(curMousePosition.realTargetName, curMousePosition.areaType, this.containerElement());
            context!.setPointPosition(curMousePosition);
            this.timer = null;
        });
    }

    stageMousedown(e: KoEventObject<MouseEvent>) {
        const mouseEvent = e.event.evt;
        const _targetName = e.event.target.name();

        const { targetName, fieldId, recordId } = getDetailByTargetName(_targetName);
        if (
            mouseEvent.button === AITableMouseDownType.Right &&
            recordId &&
            fieldId &&
            this.aiTable.selection().selectedRecords.has(recordId)
        ) {
            return;
        }

        switch (targetName) {
            case AI_TABLE_FIELD_HEAD:
                mouseEvent.preventDefault();
                if (!fieldId) return;
                this.aiTableGridSelectionService.selectField(fieldId);
                return;
            case AI_TABLE_CELL:
                if (!recordId || !fieldId) return;
                this.aiTableGridEventService.closeCellEditor();
                this.aiTableGridSelectionService.selectCell(recordId, fieldId);
                return;
            case AI_TABLE_ROW_ADD_BUTTON:
            case AI_TABLE_FIELD_ADD_BUTTON:
            case AI_TABLE_ROW_SELECT_CHECKBOX:
            case AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX:
                return;
            default:
                this.aiTableGridSelectionService.clearSelection();
        }
    }

    stageContextmenu(e: KoEventObject<MouseEvent>) {
        const mouseEvent = e.event.evt;
        mouseEvent.preventDefault();

        if (this.aiReadonly()) {
            return;
        }

        const targetName = e.event.target.name();
        const { fieldId, recordId } = getDetailByTargetName(targetName);
        if (!recordId || !fieldId) {
            return;
        }

        const position = {
            x: mouseEvent.x,
            y: mouseEvent.y
        };
        const menuItems = this.aiContextMenuItems();
        if (!menuItems.length || menuItems.every((item) => !!(item.hidden && item.hidden(this.aiTable, targetName, position)))) {
            return;
        }

        this.aiTableGridEventService.openContextMenu(this.aiTable, {
            origin: this.containerElement(),
            menuItems,
            position,
            targetName,
            viewContainerRef: this.viewContainerRef
        });
    }

    stageClick(e: KoEventObject<MouseEvent>) {
        const mouseEvent = e.event.evt;
        mouseEvent.preventDefault();
        const { context } = this.aiTable;
        const { targetName, rowIndex: pointRowIndex } = context!.pointPosition();
        if (mouseEvent.button !== AITableMouseDownType.Left || (targetName !== AI_TABLE_FIELD_HEAD_MORE && this.aiReadonly())) return;
        switch (targetName) {
            case AI_TABLE_ROW_ADD_BUTTON: {
                this.aiTableGridSelectionService.clearSelection();
                this.addRecord();
                return;
            }
            case AI_TABLE_ROW_SELECT_CHECKBOX: {
                const pointRecordId = context!.linearRows()[pointRowIndex]?._id;
                this.selectRecord(pointRecordId);
                return;
            }
            case AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX: {
                const isChecked = this.aiTable.selection().selectedRecords.size === this.aiTable.records().length;
                this.toggleSelectAll(!isChecked);
                return;
            }
            case AI_TABLE_FIELD_ADD_BUTTON: {
                this.aiTableGridSelectionService.clearSelection();
                const fieldGroupRect = e.event.target.getParent()?.getClientRect()!;
                const containerRect = this.containerElement().getBoundingClientRect();
                this.addField(this.containerElement(), {
                    x: fieldGroupRect.x + containerRect.x,
                    y: containerRect.y + fieldGroupRect.y + fieldGroupRect.height
                });
                return;
            }
            case AI_TABLE_FIELD_HEAD_MORE:
                mouseEvent.preventDefault();
                const _targetName = e.event.target.name();
                const { fieldId } = getDetailByTargetName(_targetName);
                if (fieldId) {
                    const moreRect = e.event.target.getClientRect();
                    const fieldGroupRect = e.event.target.getParent()?.getParent()?.getClientRect()!;
                    const containerRect = this.containerElement().getBoundingClientRect();

                    const position = {
                        x: containerRect.x + moreRect.x,
                        y: containerRect.y + moreRect.y + moreRect.height
                    };
                    const editFieldPosition = {
                        x: containerRect.x + fieldGroupRect.x - AI_TABLE_CELL_PADDING,
                        y: containerRect.y + fieldGroupRect.y + fieldGroupRect.height
                    };

                    const editOrigin = this.containerElement().querySelector('.konvajs-content') as HTMLElement;
                    this.aiTableGridFieldService.openFieldMenu(this.aiTable, {
                        fieldId: fieldId,
                        fieldMenus: this.fieldMenus(),
                        origin: this.containerElement(),
                        position,
                        editOrigin: editOrigin,
                        editFieldPosition
                    });
                }
                return;
        }
    }

    stageDblclick(e: KoEventObject<MouseEvent>) {
        if (this.aiReadonly()) {
            return;
        }
        const _targetName = e.event.target.name();
        const { fieldId, recordId } = getDetailByTargetName(_targetName);
        if (!recordId || !fieldId) {
            return;
        }
        const field = this.aiTable.fieldsMap()[fieldId];
        const fieldType = field.type;
        if (!DBL_CLICK_EDIT_TYPE.includes(fieldType)) {
            return;
        }
        setTimeout(() => {
            this.aiTableGridEventService.openCellEditor(this.aiTable, {
                container: this.containerElement(),
                coordinate: this.coordinate(),
                fieldId: fieldId!,
                recordId: recordId!,
                references: this.aiReferences(),
                updateFieldValue: (value: UpdateFieldValueOptions<any>) => {
                    this.aiUpdateFieldValue.emit(value);
                }
            });
        }, 0);
    }

    private bindWheel() {
        fromEvent<WheelEvent>(this.containerElement(), 'wheel', { passive: false })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e: WheelEvent) => {
                e.preventDefault();
                this.aiTableGridEventService.closeCellEditor();
                this.scrollAction({ deltaX: e.deltaX, deltaY: e.deltaY, shiftKey: e.shiftKey });
            });
    }

    scrollAction = (options: ScrollActionOptions) => {
        if (this.timer) {
            cancelAnimationFrame(this.timer);
        }
        this.timer = requestAnimationFrame(() => {
            const { deltaX, deltaY, shiftKey } = options;
            const fixedDeltaY = shiftKey && isWindows ? 0 : deltaY;
            const fixedDeltaX = shiftKey && isWindows ? deltaY : deltaX;
            const horizontalBar = this.horizontalBarRef()?.nativeElement;
            const verticalBar = this.verticalBarRef()?.nativeElement;
            if (horizontalBar) {
                horizontalBar.scrollLeft = horizontalBar.scrollLeft + fixedDeltaX;
            }
            if (verticalBar) {
                verticalBar.scrollTop = verticalBar.scrollTop + fixedDeltaY;
            }
            options.callback && options.callback();
            this.timer = null;
        });
    };

    private bindScrollBarScroll() {
        fromEvent<WheelEvent>(this.horizontalBarRef()!.nativeElement, 'scroll', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e) => {
                this.horizontalScroll(e);
            });

        fromEvent<WheelEvent>(this.verticalBarRef()!.nativeElement, 'scroll', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e) => {
                this.verticalScroll(e);
            });
    }

    private bindGlobalMousedown() {
        fromEvent<MouseEvent>(document, 'mousedown', { passive: true })
            .pipe(
                filter(
                    (e) =>
                        e.target instanceof Element &&
                        !this.containerElement().contains(e.target) &&
                        !(e.target.closest(AI_TABLE_PROHIBIT_CLEAR_SELECTION_CLASS) && this.aiTable.selection().selectedRecords.size > 0)
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.aiTableGridSelectionService.clearSelection();
            });
    }

    private resetScrolling = () => {
        this.aiTable.context!.setScrollState({
            isScrolling: false
        });
    };

    private horizontalScroll = (e: any) => {
        const { scrollLeft } = e.target;
        this.aiTable.context!.setScrollState({
            scrollLeft,
            isScrolling: true
        });
        this.resetScrolling();
    };

    private verticalScroll(e: any) {
        const { scrollTop } = e.target;
        this.aiTable.context!.setScrollState({
            scrollTop,
            isScrolling: true
        });
        this.resetScrolling();
    }

    private setContainerRect() {
        this.containerRect.set({
            width: this.containerElement().offsetWidth,
            height: this.containerElement().offsetHeight
        });
    }

    private containerResizeListener() {
        this.resizeObserver = new ResizeObserver(() => {
            const containerWidth = this.containerElement().offsetWidth;
            const totalWidth = this.coordinate().totalWidth + AI_TABLE_FIELD_ADD_BUTTON_WIDTH;
            this.setContainerRect();
            if (containerWidth >= totalWidth) {
                this.aiTable.context!.setScrollState({ scrollLeft: 0 });
                return;
            }
        });
        this.resizeObserver.observe(this.containerElement());
    }

    private toggleHoverCellEditor() {
        const { realTargetName } = this.aiTable.context?.pointPosition()!;
        const { targetName, fieldId, recordId } = getDetailByTargetName(realTargetName!);
        const editingCell = this.aiTableGridEventService.getCurrentEditCell();

        if (targetName === AI_TABLE_CELL && recordId && fieldId) {
            const field = this.aiTable.fieldsMap()[fieldId];

            if (!field) {
                return;
            }

            const fieldType = field.type;
            const editingFieldType = editingCell ? this.aiTable.fieldsMap()[editingCell.fieldId].type : null;
            const isEditingFieldTypeHovered = editingFieldType ? MOUSEOVER_EDIT_TYPE.includes(editingFieldType) : false;
            const isFieldTypeHovered = MOUSEOVER_EDIT_TYPE.includes(fieldType);

            if (editingCell && isEditingFieldTypeHovered) {
                this.aiTableGridEventService.closeCellEditor();
            }

            if (!editingCell && !isFieldTypeHovered) {
                this.aiTableGridEventService.closeCellEditor();
                return;
            }

            if (editingCell && ((!isEditingFieldTypeHovered && isFieldTypeHovered) || !isFieldTypeHovered)) {
                return;
            }

            setTimeout(() => {
                this.aiTableGridEventService.openCellEditor(this.aiTable, {
                    container: this.containerElement(),
                    coordinate: this.coordinate(),
                    fieldId: fieldId!,
                    recordId: recordId!,
                    references: this.aiReferences(),
                    isHoverEdit: true,
                    updateFieldValue: (value: UpdateFieldValueOptions<any>) => {
                        this.aiUpdateFieldValue.emit(value);
                    }
                });
            });
        } else {
            // 鼠标位于非单元格区域时，如果当前有 mouseover 编辑元素，则结束编辑
            if (editingCell && MOUSEOVER_EDIT_TYPE.includes(this.aiTable.fieldsMap()[editingCell.fieldId].type)) {
                this.aiTableGridEventService.closeCellEditor();
            }
        }
    }
}
