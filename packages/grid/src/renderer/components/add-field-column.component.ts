import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoShape } from '../../angular-konva';
import {
    AddOutlinedPath,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    Colors
} from '../../constants';
import { AITableAddFieldConfig, AITableIconConfig } from '../../types';
import { generateTargetName } from '../../utils';
import { AITableIcon } from './icon.component';
import { isNil } from 'lodash';

@Component({
    selector: 'ai-table-add-field',
    template: `
        <ko-group [config]="{ x: x() }">
            <ko-group>
                <ko-rect [config]="rectConfig()"></ko-rect>
            </ko-group>
            <ko-group>
                @if (addIconConfig().visible) {
                    <ai-table-icon [config]="addIconConfig()"></ai-table-icon>
                }
            </ko-group>
        </ko-group>
    `,
    standalone: true,
    imports: [KoContainer, KoShape, AITableIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableAddField {
    config = input.required<AITableAddFieldConfig>();

    btnWidth = AI_TABLE_FIELD_ADD_BUTTON_WIDTH;

    x = computed(() => {
        const lastColumnWidth = this.config().coordinate.getColumnWidth(this.config().columnStopIndex);
        const lastColumnOffset = this.config().coordinate.getColumnOffset(this.config().columnStopIndex);
        return lastColumnWidth + lastColumnOffset;
    });

    rectConfig = computed<Partial<StageConfig>>(() => {
        const {
            pointPosition: { targetName },
            readonly
        } = this.config();
        const fill = targetName === AI_TABLE_FIELD_ADD_BUTTON ? Colors.gray80 : Colors.white;
        return {
            name: generateTargetName({
                targetName: AI_TABLE_FIELD_ADD_BUTTON,
                fieldId: this.config().fields[this.config().columnStopIndex]._id,
                mouseStyle: readonly ? 'default' : 'pointer'
            }),
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            width:
                this.config().coordinate.containerWidth - this.x() < this.btnWidth
                    ? this.btnWidth
                    : this.config().coordinate.containerWidth - this.x(),
            height: this.config().coordinate.rowInitSize,
            stroke: Colors.gray200,
            strokeWidth: 1,
            listening: true,
            fill
        };
    });

    addIconConfig = computed<AITableIconConfig>(() => {
        const { readonly } = this.config();
        const offsetY = (this.config().coordinate.rowInitSize - AI_TABLE_ICON_COMMON_SIZE) / 2;
        return {
            x: AI_TABLE_CELL_PADDING,
            y: offsetY,
            data: AddOutlinedPath,
            fill: Colors.gray600,
            listening: false,
            visible: isNil(readonly) ? true : !readonly
        };
    });
}
