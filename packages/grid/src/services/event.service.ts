import { Injectable, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { DBL_CLICK_EDIT_TYPE } from '../constants';
import { getRecordOrField } from '../utils';
import { AITable, AITableField, AITableFieldType, AITableRecord } from '../core';
import { GRID_CELL_EDITOR_MAP } from '../constants/editor';
import { ThyPopover } from 'ngx-tethys/popover';
import { AITableGridCellRenderSchema } from '../types';

@Injectable()
export class AITableGridEventService {
    aiTable!: AITable;

    aiFieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>;

    takeUntilDestroyed = takeUntilDestroyed();

    constructor(private thyPopover: ThyPopover) {}

    initialize(aiTable: AITable, aiFieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>) {
        this.aiTable = aiTable;
        this.aiFieldRenderers = aiFieldRenderers;
    }

    registerEvents(element: HTMLElement) {
        fromEvent<MouseEvent>(element, 'dblclick')
            .pipe(this.takeUntilDestroyed)
            .subscribe((event) => {
                this.dblClick(event as MouseEvent);
            });
    }

    private dblClick(event: MouseEvent) {
        const cellDom = (event.target as HTMLElement).closest('.grid-cell') as HTMLElement;
        const type = cellDom && cellDom.getAttribute('type')!;
        if (type && DBL_CLICK_EDIT_TYPE.includes(Number(type))) {
            this.openEdit(cellDom);
        }
    }

    private getEditorComponent(type: AITableFieldType) {
        if (this.aiFieldRenderers && this.aiFieldRenderers[type]) {
            return this.aiFieldRenderers[type]!.edit;
        }
        return GRID_CELL_EDITOR_MAP[type];
    }

    private openEdit(cellDom: HTMLElement) {
        const { x, y, width, height } = cellDom.getBoundingClientRect();
        const fieldId = cellDom.getAttribute('fieldId')!;
        const recordId = cellDom.getAttribute('recordId')!;
        const field = getRecordOrField(this.aiTable.fields, fieldId) as Signal<AITableField>;
        const record = getRecordOrField(this.aiTable.records, recordId) as Signal<AITableRecord>;
        const component = this.getEditorComponent(field().type);
        this.thyPopover.open(component, {
            origin: cellDom,
            originPosition: {
                x: x - 1,
                y: y + 1,
                width: width + 2,
                height: height + 2
            },
            width: width + 2 + 'px',
            height: height + 2 + 'px',
            placement: 'top',
            offset: -(height + 4),
            initialState: {
                field: field,
                record: record,
                aiTable: signal(this.aiTable)
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true
        });
    }
}