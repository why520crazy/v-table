import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoShape, KoStage } from '../../angular-konva';
import {
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    Colors,
    DEFAULT_FONT_SIZE,
    MoreStandOutlinedPath
} from '../../constants';
import { AITableFieldHeadConfig } from '../../types';
import { generateTargetName, TextMeasure } from '../../utils';
import { AITableFieldIcon } from './field-icon.component';
import { AITableIcon } from './icon.component';
import { AITableText } from './text.component';

@Component({
    selector: 'ai-table-field-head',
    template: `
        <ko-group [config]="groupConfig()">
            <ko-rect [config]="bgConfig()"></ko-rect>
            <ko-group>
                <ai-table-field-icon [config]="fieldIconConfig()"></ai-table-field-icon>
                <ai-table-text [config]="textConfig()"></ai-table-text>
                @if (config().iconVisible) {
                    <ai-table-icon [config]="moreIconConfig()"></ai-table-icon>
                }
            </ko-group>
        </ko-group>
    `,
    standalone: true,
    imports: [KoContainer, KoShape, AITableFieldIcon, AITableText, AITableIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFieldHead {
    config = input.required<AITableFieldHeadConfig>();

    textOffset = AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE;

    textMeasure = TextMeasure();

    availableTextWidth = computed(() => {
        const { width, iconVisible } = this.config();
        return (
            width -
            (iconVisible
                ? 2 * (AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE)
                : 2 * AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE)
        );
    });

    textData = computed(() => {
        const fieldName = this.config().field.name.replace(/\r|\n/g, ' ');
        this.textMeasure.setFont({ fontSize: DEFAULT_FONT_SIZE });
        const { width, height, isOverflow } = this.textMeasure.measureText(fieldName, this.availableTextWidth(), 1);
        return {
            width: Math.min(width, this.availableTextWidth()),
            height,
            isOverflow
        };
    });

    groupConfig = computed<Partial<StageConfig>>(() => {
        return {
            x: this.config().x,
            y: this.config().y
        };
    });

    bgConfig = computed(() => {
        const { field, width, height, stroke, isSelected, iconVisible } = this.config();
        return {
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            name: generateTargetName({
                targetName: AI_TABLE_FIELD_HEAD,
                fieldId: field._id
            }),
            width: width,
            height: height,
            fill: isSelected ? Colors.headSelectedBgColor : iconVisible ? Colors.gray80 : Colors.white,
            stroke: stroke || Colors.gray200,
            strokeWidth: 1,
            opacity: 1
        };
    });

    fieldIconConfig = computed(() => {
        const { field, height } = this.config();
        return {
            field: field,
            x: AI_TABLE_CELL_PADDING,
            y: (height - AI_TABLE_ICON_COMMON_SIZE) / 2,
            width: AI_TABLE_ICON_COMMON_SIZE,
            height: AI_TABLE_ICON_COMMON_SIZE,
            fill: Colors.gray600
        };
    });

    textConfig = computed(() => {
        const { field, height } = this.config();
        return {
            x: this.textOffset,
            y: undefined,
            width: Math.max(this.textData().width, AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH),
            height: height + 2,
            text: field.name,
            lineHeight: 1.84
        };
    });

    moreIconConfig = computed(() => {
        const { field, width, height, isHoverIcon, isSelected } = this.config();
        const commonIconOffsetY = (height - AI_TABLE_ACTION_COMMON_SIZE) / 2;
        return {
            name: generateTargetName({
                targetName: AI_TABLE_FIELD_HEAD_MORE,
                fieldId: field._id
            }),
            x: width - AI_TABLE_ACTION_COMMON_SIZE,
            y: commonIconOffsetY,
            data: MoreStandOutlinedPath,
            fill: isHoverIcon ? Colors.primary : Colors.gray600,
            background: Colors.transparent,
            backgroundWidth: AI_TABLE_ACTION_COMMON_SIZE,
            backgroundHeight: AI_TABLE_ACTION_COMMON_SIZE,
            cornerRadius: 4
        };
    });
}
