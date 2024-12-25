import { FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyAbstractInternalOverlayRef } from 'ngx-tethys/core';
import { ThyPopover, ThyPopoverRef } from 'ngx-tethys/popover';
import { debounceTime, fromEvent, Subject } from 'rxjs';
import { AbstractEditCellEditor } from '../components';
import { GRID_CELL_EDITOR_MAP } from '../constants';
import { AITable, AITableFieldType } from '../core';
import { AITableContextMenuOptions, AITableGridCellRenderSchema, AITableOpenEditOptions } from '../types';
import { getCellHorizontalPosition, getEditorBoxOffset, getEditorSpace, getHoverEditorBoxOffset, getHoverEditorSpace } from '../utils';
import { AITableContextMenu } from '../components/context-menu/context-menu.component';

@Injectable()
export class AITableGridEventService {
    aiTable!: AITable;

    aiFieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>;

    dblClickEvent$ = new Subject<MouseEvent>();

    mousedownEvent$ = new Subject<MouseEvent>();

    mouseoverEvent$ = new Subject<MouseEvent>();

    globalMouseoverEvent$ = new Subject<MouseEvent>();

    globalMousedownEvent$ = new Subject<MouseEvent>();

    private cellEditorPopoverRef!: ThyPopoverRef<AbstractEditCellEditor<any>> | null;

    private destroyRef = inject(DestroyRef);

    private thyPopover = inject(ThyPopover);

    initialize(aiTable: AITable, aiFieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>) {
        this.aiTable = aiTable;
        this.aiFieldRenderers = aiFieldRenderers;
    }

    registerEvents(element: HTMLElement) {
        fromEvent<MouseEvent>(element, 'dblclick', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.dblClickEvent$.next(event);
            });

        fromEvent<MouseEvent>(element, 'mouseover', { passive: true })
            .pipe(debounceTime(80), takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.mouseoverEvent$.next(event);
            });

        fromEvent<MouseEvent>(document, 'mouseover', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.globalMouseoverEvent$.next(event);
            });

        fromEvent<MouseEvent>(element, 'mousedown', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.mousedownEvent$.next(event);
            });

        fromEvent<MouseEvent>(document, 'mousedown', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.globalMousedownEvent$.next(event as MouseEvent);
            });
    }

    private getEditorComponent(type: AITableFieldType) {
        if (this.aiFieldRenderers && this.aiFieldRenderers[type]) {
            return this.aiFieldRenderers[type]!.editor;
        }
        return GRID_CELL_EDITOR_MAP[type];
    }

    openEdit(cellDom: HTMLElement) {
        const { x, y, width, height } = cellDom.getBoundingClientRect();
        const fieldId = cellDom.getAttribute('fieldId')!;
        const recordId = cellDom.getAttribute('recordId')!;
        const component = this.getEditorComponent(this.aiTable.fieldsMap()[fieldId].type);
        const ref = this.thyPopover.open(component, {
            origin: cellDom,
            originPosition: {
                x: x - 1,
                y: y + 1,
                width: width + 2,
                height: height + 2
            },
            width: width + 1 + 'px',
            height: height + 2 + 'px',
            placement: 'top',
            offset: -(height + 4),
            minWidth: width,
            initialState: {
                fieldId: fieldId,
                recordId: recordId,
                aiTable: this.aiTable
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true,
            autoAdaptive: true
        });
        return ref;
    }

    getOriginPosition(aiTable: AITable, options: AITableOpenEditOptions) {
        const { container, coordinate, recordId, fieldId, isHoverEdit } = options;
        const { scrollState } = aiTable.context!;
        const { rowHeight, columnCount } = coordinate;
        const { rowIndex, columnIndex } = AITable.getCellIndex(aiTable, { recordId, fieldId })!;
        const originX = coordinate.getColumnOffset(columnIndex);
        const originY = coordinate.getRowOffset(rowIndex);
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const { width: originWidth, offset: originOffset } = getCellHorizontalPosition({
            columnWidth,
            columnIndex,
            columnCount
        });
        const originRect = container!.getBoundingClientRect();
        const originPosition = {
            x: originX + originOffset - scrollState().scrollLeft + originRect.x,
            y: originY - scrollState().scrollTop + originRect.y,
            width: originWidth,
            height: rowHeight
        };
        let x = originPosition.x + getEditorBoxOffset();
        let y = originPosition.y + getEditorBoxOffset();
        let width = getEditorSpace(originPosition.width);
        let height = getEditorSpace(originPosition.height);
        // hover 编辑组件无边框
        if (isHoverEdit) {
            x = originPosition.x + getHoverEditorBoxOffset();
            y = originPosition.y + getHoverEditorBoxOffset();
            width = getHoverEditorSpace(originPosition.width);
            height = getHoverEditorSpace(originPosition.height);
        }
        return {
            ...originPosition,
            x: x,
            y: y,
            width: width,
            height: height
        };
    }

    openCellEditor(aiTable: AITable, options: AITableOpenEditOptions) {
        const { container, recordId, fieldId, isHoverEdit, references } = options;
        const component = this.getEditorComponent(this.aiTable.fieldsMap()[fieldId].type);
        const offsetOriginPosition = this.getOriginPosition(aiTable, options);
        this.cellEditorPopoverRef = this.thyPopover.open(component, {
            origin: container!,
            originPosition: offsetOriginPosition,
            width: offsetOriginPosition.width + 'px',
            height: offsetOriginPosition.height + 'px',
            minWidth: offsetOriginPosition.width + 'px',
            placement: 'bottom',
            offset: -offsetOriginPosition.height,
            initialState: {
                fieldId: fieldId,
                recordId: recordId,
                references,
                aiTable: aiTable
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true,
            autoAdaptive: true
        });

        if (this.cellEditorPopoverRef) {
            const wheelEvent = fromEvent<WheelEvent>(
                this.cellEditorPopoverRef.componentInstance.elementRef.nativeElement,
                'wheel'
            ).subscribe((event: WheelEvent) => {
                event.preventDefault();
                this.aiTable.context?.scrollAction({
                    deltaX: event.deltaX,
                    deltaY: event.deltaY,
                    shiftKey: event.shiftKey,
                    callback: () => {
                        const originPosition = this.getOriginPosition(aiTable, options);
                        const positionStrategy = (this.cellEditorPopoverRef as ThyAbstractInternalOverlayRef<any, any, any>)
                            .getOverlayRef()
                            .getConfig().positionStrategy as FlexibleConnectedPositionStrategy;
                        positionStrategy.setOrigin(originPosition);
                        positionStrategy.apply();
                    }
                });
            });
            this.cellEditorPopoverRef.afterClosed().subscribe(() => {
                wheelEvent.unsubscribe();
                this.cellEditorPopoverRef = null;
            });
            (this.cellEditorPopoverRef.componentInstance as AbstractEditCellEditor<any>).updateFieldValue.subscribe((value) => {
                options.updateFieldValue(value);
            });
        }
        return this.cellEditorPopoverRef;
    }

    closeCellEditor() {
        if (this.cellEditorPopoverRef) {
            this.cellEditorPopoverRef.close();
            this.cellEditorPopoverRef = null;
        }
    }

    getCurrentEditCell() {
        if (this.cellEditorPopoverRef) {
            const recordId = this.cellEditorPopoverRef.componentInstance?.recordId;
            const fieldId = this.cellEditorPopoverRef.componentInstance?.fieldId;

            if (recordId && fieldId) {
                return {
                    recordId,
                    fieldId
                };
            }
            return null;
        }
        return null;
    }

    openContextMenu(aiTable: AITable, options: AITableContextMenuOptions) {
        const { origin, position, menuItems, targetName, viewContainerRef } = options;
        const ref = this.thyPopover.open(AITableContextMenu, {
            origin: origin as HTMLElement,
            originPosition: position,
            placement: 'bottomLeft',
            insideClosable: true,
            viewContainerRef,
            initialState: {
                aiTable,
                menuItems,
                targetName,
                position
            }
        });
        return ref;
    }
}
