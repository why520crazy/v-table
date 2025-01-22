import _ from 'lodash';
import {
    AI_TABLE_CELL_ADD_ITEM_BUTTON_SIZE,
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE,
    AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET,
    AI_TABLE_CELL_EMOJI_PADDING,
    AI_TABLE_CELL_EMOJI_SIZE,
    AI_TABLE_CELL_MAX_ROW_COUNT,
    AI_TABLE_CELL_MEMBER_ITEM_HEIGHT,
    AI_TABLE_CELL_MEMBER_ITEM_PADDING,
    AI_TABLE_CELL_MULTI_DOT_RADIUS,
    AI_TABLE_CELL_MULTI_ITEM_MARGIN_TOP,
    AI_TABLE_CELL_MULTI_ITEM_MIN_WIDTH,
    AI_TABLE_CELL_MULTI_PADDING_LEFT,
    AI_TABLE_CELL_MULTI_PADDING_TOP,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_COMMON_FONT_SIZE,
    AI_TABLE_DOT_RADIUS,
    AI_TABLE_MEMBER_AVATAR_SIZE,
    AI_TABLE_MEMBER_ITEM_AVATAR_MARGIN_RIGHT,
    AI_TABLE_MEMBER_ITEM_PADDING_RIGHT,
    AI_TABLE_MIN_TEXT_WIDTH,
    AI_TABLE_OFFSET,
    AI_TABLE_OPTION_ITEM_FONT_SIZE,
    AI_TABLE_OPTION_ITEM_HEIGHT,
    AI_TABLE_OPTION_ITEM_PADDING,
    AI_TABLE_OPTION_ITEM_RADIUS,
    AI_TABLE_PIECE_RADIUS,
    AI_TABLE_PIECE_WIDTH,
    AI_TABLE_PROGRESS_BAR_HEIGHT,
    AI_TABLE_PROGRESS_BAR_RADIUS,
    AI_TABLE_PROGRESS_TEXT_Width,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AI_TABLE_TAG_FONT_SIZE,
    AI_TABLE_TAG_PADDING,
    AI_TABLE_TEXT_GAP,
    Colors,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_WEIGHT,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_ALIGN_RIGHT,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_LINE_HEIGHT,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    FONT_SIZE_SM,
    StarFill
} from '../../constants';
import { AITable, AITableField, AITableFieldType, AITableSelectOptionStyle, MemberSettings, RateFieldValue } from '../../core';
import { AITableAvatarSize, AITableAvatarType, AITableMemberType, AITableRender, AITableSelectField } from '../../types';
import { getAvatarBgColor, getAvatarShortName, getTextWidth } from '../../utils';
import { Drawer } from './drawer';

/**
 * 处理和渲染表格单元格的内容
 */
export class CellDrawer extends Drawer {
    // 样式初始化
    public initStyle(field: AITableField, styleProps: { fontWeight: any }): void | null {
        const { type: fieldType } = field;
        const { fontWeight = DEFAULT_FONT_WEIGHT } = styleProps;

        switch (fieldType) {
            case AITableFieldType.text:
            case AITableFieldType.date:
            case AITableFieldType.createdAt:
            case AITableFieldType.updatedAt:
            case AITableFieldType.rate:
            case AITableFieldType.progress:
            case AITableFieldType.member:
            case AITableFieldType.createdBy:
            case AITableFieldType.updatedBy:
                return this.setStyle({ fontSize: DEFAULT_FONT_SIZE, fontWeight });
            default:
                return null;
        }
    }

    // 单元格渲染
    public renderCell(render: AITableRender, ctx?: CanvasRenderingContext2D | undefined) {
        const { field } = render;
        const fieldType = field.type;

        switch (fieldType) {
            case AITableFieldType.text:
            case AITableFieldType.number:
            case AITableFieldType.link:
                return this.renderCellText(render, ctx);
            case AITableFieldType.select:
                return this.renderCellSelect(render, ctx);
            case AITableFieldType.date:
            case AITableFieldType.createdAt:
            case AITableFieldType.updatedAt:
                return this.renderCellDate(render, ctx);
            case AITableFieldType.rate:
                return this.renderCellRate(render, ctx);
            case AITableFieldType.progress:
                return this.renderCellProgress(render, ctx);
            case AITableFieldType.member:
            case AITableFieldType.createdBy:
            case AITableFieldType.updatedBy:
                return this.renderCellMember(render, ctx);
            default:
                return null;
        }
    }

    private renderCellText(render: AITableRender, ctx?: any) {
        const { x, y, transformValue, field, columnWidth, style } = render;
        const fieldType = field.type;
        let renderText: string | null = fieldType === AITableFieldType.link ? transformValue.text : transformValue;
        if (renderText == null) {
            return;
        }
        const isSingleLine = !columnWidth;
        const isTextField = fieldType === AITableFieldType.text;
        const isNumberField = fieldType === AITableFieldType.number;

        if (isTextField && isSingleLine) {
            renderText = renderText.replace(/\r|\n/g, ' ');
        }

        const color = style?.color || this.colors.gray800;
        const textAlign = style?.textAlign || DEFAULT_TEXT_ALIGN_LEFT;
        const fontWeight = style?.fontWeight;
        const textMaxWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
        const renderX = textAlign === DEFAULT_TEXT_ALIGN_RIGHT ? x + columnWidth - AI_TABLE_CELL_PADDING : x + AI_TABLE_CELL_PADDING;
        const renderY = y + AI_TABLE_ROW_BLANK_HEIGHT / 2;
        const textDecoration = DEFAULT_TEXT_DECORATION;

        if (isNumberField) {
            renderText = String(renderText);
            const { text } = this.textEllipsis({
                text: renderText,
                maxWidth: columnWidth && textMaxWidth,
                fontWeight
            });
            if (ctx) {
                let pureText = text;
                this.text({
                    x: renderX,
                    y: renderY,
                    text: pureText,
                    textAlign,
                    fillStyle: color,
                    fontWeight,
                    textDecoration,
                    verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
                });
            }
        } else {
            this.wrapText({
                x: renderX,
                y: renderY,
                text: renderText,
                maxWidth: textMaxWidth,
                maxRow: AI_TABLE_CELL_MAX_ROW_COUNT,
                lineHeight: DEFAULT_TEXT_LINE_HEIGHT,
                textAlign,
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
                fillStyle: fieldType === AITableFieldType.link ? Colors.primary : color,
                fontWeight,
                textDecoration,
                fieldType,
                needDraw: true
            });
        }
    }

    private renderCellSelect(render: AITableRender, ctx?: any) {
        const { field } = render;
        if ((field as AITableSelectField).settings?.is_multiple) {
            this.renderCellMultiSelect(render, ctx);
        } else {
            this.renderSingleSelectCell(render, ctx);
        }
    }

    private renderCellMultiSelect(render: AITableRender, ctx?: any) {
        const { x, y, field, transformValue, columnWidth } = render;
        if (!transformValue?.length || !Array.isArray(transformValue)) return;
        let currentX = x + AI_TABLE_CELL_PADDING;
        const maxContainerWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
        const optionStyle = (field as AITableSelectField).settings.option_style;
        const fontStyle = `${DEFAULT_FONT_WEIGHT} ${AI_TABLE_OPTION_ITEM_FONT_SIZE}px ${DEFAULT_FONT_FAMILY}`;
        const isDotOrPiece = optionStyle === AITableSelectOptionStyle.dot || optionStyle === AITableSelectOptionStyle.piece;

        let totalWidth = 0;
        const cellItemInfoMap = new Map();
        let drawableIndex = 0;
        transformValue.forEach((optionId, index) => {
            const item = (field as AITableSelectField).settings.options?.find((option) => option._id === optionId);
            const textWidth = getTextWidth(ctx, item?.text as string, fontStyle);
            totalWidth += textWidth + 2 * AI_TABLE_CELL_PADDING;
            if (index < transformValue.length - 1) {
                totalWidth += AI_TABLE_CELL_MULTI_PADDING_LEFT;
            }
            if (isDotOrPiece) {
                totalWidth += AI_TABLE_CELL_MULTI_DOT_RADIUS * 2 + AI_TABLE_CELL_MULTI_PADDING_LEFT;
            }
            if (totalWidth < maxContainerWidth || totalWidth === maxContainerWidth) {
                drawableIndex = index;
            }
            cellItemInfoMap.set(optionId, { textWidth, item, offset: totalWidth });
        });

        const baseWidth = AI_TABLE_MIN_TEXT_WIDTH + AI_TABLE_CELL_PADDING * 2;
        const minWidth = isDotOrPiece ? baseWidth + AI_TABLE_CELL_MULTI_DOT_RADIUS * 2 + AI_TABLE_CELL_MULTI_PADDING_LEFT : baseWidth;

        if (transformValue[drawableIndex + 1]) {
            const { offset: currentOffset } = cellItemInfoMap.get(transformValue[drawableIndex]);
            const canDrawerNext = maxContainerWidth - currentOffset > minWidth;
            drawableIndex = canDrawerNext ? drawableIndex + 1 : drawableIndex;
            // 上面过程是  没有 +数字  的情况下最大能放几个；
            const number = transformValue.length - (drawableIndex + 1);

            if (number > 0) {
                // 说明有 +数字，重新计算
                const circleWidth = getTextWidth(ctx, `+{number}`, fontStyle) + 2 * AI_TABLE_CELL_PADDING;
                const max = maxContainerWidth - AI_TABLE_CELL_MULTI_PADDING_LEFT - circleWidth;
                // 如果当前已经超出了，看是否能容下当前的，不能就减去  1；
                const currentItemHasOver = currentOffset > max;
                if (currentItemHasOver) {
                    const lastOffset = drawableIndex === 0 ? 0 : cellItemInfoMap.get(transformValue[drawableIndex - 1]);
                    drawableIndex = max - lastOffset > minWidth ? drawableIndex : drawableIndex - 1;
                } else {
                    // 还有剩余空间, 看是否能多渲染一个
                    drawableIndex = max - currentOffset > minWidth ? drawableIndex + 1 : drawableIndex;
                }
            }
        }

        const circleText = `+${transformValue.length - (drawableIndex + 1)}`;
        const circleWidth =
            transformValue.length - (drawableIndex + 1) > 0 ? getTextWidth(ctx, circleText, fontStyle) + 2 * AI_TABLE_CELL_PADDING : 0;
        // 剩余空间
        let remainSpace = maxContainerWidth - circleWidth - (circleWidth > 0 ? AI_TABLE_CELL_MULTI_PADDING_LEFT : 0);

        for (let index = 0; index < transformValue.length; index++) {
            const optionId = transformValue[index];
            const bgConfig = {
                x: currentX,
                y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_HEIGHT) / 2,
                height: AI_TABLE_OPTION_ITEM_HEIGHT,
                radius: AI_TABLE_PIECE_RADIUS,
                fill: Colors.gray100,
                width: 0
            };

            const commonItem = (optionStyle: AITableSelectOptionStyle, shape: string) => {
                const baseWidth = isDotOrPiece
                    ? AI_TABLE_CELL_MULTI_DOT_RADIUS * 2 + AI_TABLE_CELL_MULTI_PADDING_LEFT + AI_TABLE_CELL_PADDING * 2
                    : AI_TABLE_CELL_PADDING * 2;
                if (remainSpace < minWidth) {
                    return;
                }
                const { textWidth, item } = cellItemInfoMap.get(optionId);
                const completeWidth = baseWidth + textWidth;
                if (index !== transformValue.length - 1) {
                    remainSpace -= AI_TABLE_CELL_MULTI_PADDING_LEFT;
                }
                const bgWidth = remainSpace > completeWidth ? completeWidth : remainSpace;
                bgConfig.width = bgWidth;
                if (isDotOrPiece) {
                    this.rect(bgConfig);
                    if (shape === 'rect') {
                        this.rect({
                            x: bgConfig.x + AI_TABLE_CELL_PADDING,
                            y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_CELL_MULTI_DOT_RADIUS * 2) / 2,
                            width: AI_TABLE_CELL_MULTI_DOT_RADIUS * 2,
                            height: AI_TABLE_CELL_MULTI_DOT_RADIUS * 2,
                            radius: AI_TABLE_PIECE_RADIUS,
                            fill: item?.bg_color ?? item?.color ?? Colors.primary
                        });
                    } else if (shape === 'arc') {
                        this.arc({
                            x: bgConfig.x + AI_TABLE_CELL_PADDING,
                            y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_CELL_MULTI_DOT_RADIUS * 2) / 2 + AI_TABLE_CELL_MULTI_DOT_RADIUS,
                            radius: AI_TABLE_CELL_MULTI_DOT_RADIUS,
                            fill: item?.bg_color ?? item?.color ?? Colors.primary
                        });
                    }

                    this.text({
                        x: bgConfig.x + AI_TABLE_CELL_PADDING + AI_TABLE_CELL_MULTI_DOT_RADIUS * 2 + AI_TABLE_CELL_MULTI_PADDING_LEFT,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: this.textEllipsis({
                            text: item.text,
                            maxWidth: bgWidth - baseWidth,
                            fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE
                        }).text,
                        fillStyle: Colors.gray700,
                        fontSize: AI_TABLE_OPTION_ITEM_FONT_SIZE
                    });
                } else if (optionStyle === AITableSelectOptionStyle.tag) {
                    this.tag({
                        x: bgConfig.x,
                        y: bgConfig.y,
                        width: bgConfig.width,
                        text: this.textEllipsis({
                            text: item.text,
                            maxWidth: bgWidth - baseWidth,
                            fontSize: AI_TABLE_TAG_FONT_SIZE
                        }).text,
                        radius: AI_TABLE_OPTION_ITEM_RADIUS,
                        fontSize: AI_TABLE_TAG_FONT_SIZE,
                        height: bgConfig.height,
                        color: Colors.white,
                        padding: AI_TABLE_CELL_PADDING,
                        background: item?.bg_color ?? item?.color ?? Colors.primary
                    });
                } else {
                    this.rect(bgConfig);
                    this.text({
                        x: bgConfig.x + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_TAG_FONT_SIZE) / 2,
                        text: this.textEllipsis({
                            text: item.text,
                            maxWidth: bgWidth - baseWidth,
                            fontSize: AI_TABLE_TAG_FONT_SIZE
                        }).text,
                        fillStyle: Colors.gray700,
                        fontSize: AI_TABLE_TAG_FONT_SIZE
                    });
                }
                const currentWidth = bgConfig.width;
                remainSpace -= currentWidth;
                currentX += currentWidth + AI_TABLE_CELL_MULTI_PADDING_LEFT;
            };

            switch (optionStyle) {
                case AITableSelectOptionStyle.dot:
                    commonItem(AITableSelectOptionStyle.dot, 'arc');
                    break;
                case AITableSelectOptionStyle.piece:
                    commonItem(AITableSelectOptionStyle.piece, 'rect');
                    break;
                case AITableSelectOptionStyle.tag:
                    commonItem(AITableSelectOptionStyle.tag, '');
                    break;
                default:
                    commonItem(AITableSelectOptionStyle.text, '');
                    break;
            }
        }

        if (circleWidth > 0) {
            if (optionStyle === AITableSelectOptionStyle.tag) {
                this.tag({
                    x: currentX,
                    y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_HEIGHT) / 2,
                    width: circleWidth,
                    height: AI_TABLE_OPTION_ITEM_HEIGHT,
                    text: circleText,
                    background: Colors.gray100,
                    color: Colors.gray700,
                    radius: AI_TABLE_OPTION_ITEM_RADIUS,
                    padding: AI_TABLE_CELL_PADDING,
                    fontSize: AI_TABLE_TAG_FONT_SIZE
                });
            } else {
                this.rect({
                    x: currentX,
                    y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_HEIGHT) / 2,
                    width: circleWidth,
                    height: AI_TABLE_OPTION_ITEM_HEIGHT,
                    fill: Colors.gray100,
                    radius: AI_TABLE_PIECE_RADIUS
                });
                this.text({
                    x: currentX + AI_TABLE_CELL_PADDING,
                    y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_TAG_FONT_SIZE) / 2,
                    text: circleText,
                    fillStyle: Colors.gray700,
                    fontSize: AI_TABLE_TAG_FONT_SIZE
                });
            }
        }
    }

    private renderSingleSelectCell(render: AITableRender, ctx?: any) {
        const { x, y, transformValue, field, columnWidth, isActive } = render;
        const isValid = transformValue && Array.isArray(transformValue);
        if (!isValid || transformValue.length === 0) {
            return;
        }
        if (!transformValue[0]) {
            console.warn(`single select field unexpected value: ${transformValue[0]}`);
        }
        const isOperating = isActive;
        const item = (field as AITableSelectField).settings.options?.find((option) => option._id === transformValue[0]);
        const itemName = item?.text || '';
        const getTextEllipsis = (maxTextWidth: number, fontSize: number = AI_TABLE_COMMON_FONT_SIZE) => {
            maxTextWidth -= isOperating ? AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE - AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET : 0;
            return this.textEllipsis({
                text: itemName,
                maxWidth: columnWidth && maxTextWidth,
                fontSize: fontSize
            });
        };
        if (ctx) {
            ctx.save();
            ctx.globalAlpha = 1;
            const colors = AITable.getColors();
            const optionStyle = (field as AITableSelectField).settings.option_style;
            let background = item?.bg_color ?? item?.color ?? colors.primary;
            const dotMaxTextWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_PIECE_WIDTH - AI_TABLE_TEXT_GAP;
            const borderWidth = 1;
            switch (optionStyle) {
                case AITableSelectOptionStyle.dot:
                    // 这里的 AI_TABLE_OFFSET 偏移不确定是为啥（包括 piece 的），只是为了保持和编辑组件中的对齐
                    this.arc({
                        x: x + AI_TABLE_CELL_PADDING + AI_TABLE_DOT_RADIUS,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_PIECE_WIDTH) / 2 + AI_TABLE_DOT_RADIUS - AI_TABLE_OFFSET,
                        radius: AI_TABLE_DOT_RADIUS,
                        fill: background
                    });
                    this.text({
                        x: x + AI_TABLE_PIECE_WIDTH + AI_TABLE_TEXT_GAP + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: getTextEllipsis(dotMaxTextWidth).text,
                        fillStyle: colors.gray800
                    });
                    break;
                case AITableSelectOptionStyle.piece:
                    this.rect({
                        x: x + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_PIECE_WIDTH) / 2 - AI_TABLE_OFFSET,
                        width: AI_TABLE_PIECE_WIDTH,
                        height: AI_TABLE_PIECE_WIDTH,
                        radius: AI_TABLE_PIECE_RADIUS,
                        fill: background
                    });
                    this.text({
                        x: x + AI_TABLE_PIECE_WIDTH + AI_TABLE_TEXT_GAP + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: getTextEllipsis(dotMaxTextWidth).text,
                        fillStyle: colors.gray800
                    });
                    break;

                case AITableSelectOptionStyle.tag:
                    const maxTextWidth = columnWidth - 2 * (AI_TABLE_CELL_PADDING + AI_TABLE_TAG_PADDING);
                    const { textWidth, text } = getTextEllipsis(maxTextWidth, AI_TABLE_TAG_FONT_SIZE);
                    const width = Math.max(textWidth + 2 * AI_TABLE_TAG_PADDING, AI_TABLE_CELL_MULTI_ITEM_MIN_WIDTH);
                    this.tag({
                        x: x + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_HEIGHT) / 2,
                        width,
                        height: AI_TABLE_OPTION_ITEM_HEIGHT,
                        text,
                        background,
                        color: colors.white,
                        radius: AI_TABLE_OPTION_ITEM_RADIUS,
                        padding: AI_TABLE_OPTION_ITEM_PADDING,
                        fontSize: AI_TABLE_TAG_FONT_SIZE,
                        stroke: background
                    });
                    break;
                default:
                    const textMaxTextWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
                    this.text({
                        x: x + AI_TABLE_CELL_PADDING,
                        y: y + (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_OPTION_ITEM_FONT_SIZE) / 2,
                        text: getTextEllipsis(textMaxTextWidth).text,
                        fillStyle: colors.gray800
                    });
                    break;
            }

            ctx.restore();
        }
    }

    private renderCellDate(render: AITableRender, ctx?: any) {
        const { x, y, transformValue, columnWidth, style } = render;
        const colors = AITable.getColors();
        let cellText = transformValue;

        if (cellText == null || !_.isString(cellText)) {
            return;
        }

        const textMaxWidth = columnWidth - 2 * AI_TABLE_CELL_PADDING;
        const { text } = this.textEllipsis({ text: cellText, maxWidth: columnWidth && textMaxWidth });
        if (ctx) {
            const color = style?.color || colors.gray800;
            this.text({
                x: x + AI_TABLE_CELL_PADDING,
                y: y + AI_TABLE_ROW_BLANK_HEIGHT / 2,
                text,
                fillStyle: color,
                fontWeight: style?.fontWeight,
                verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
            });
        }
    }

    private renderCellRate(render: AITableRender, ctx?: CanvasRenderingContext2D | undefined) {
        const { x, y, transformValue: _cellValue } = render;
        const max = 5;
        const cellValue = (_cellValue as RateFieldValue) || 0;
        const size = AI_TABLE_CELL_EMOJI_SIZE;

        return [...Array(max).keys()].map((item, index) => {
            const value = index + 1;
            const checked = value <= cellValue;
            const iconX = index * size + AI_TABLE_CELL_PADDING + index * AI_TABLE_CELL_EMOJI_PADDING;
            const iconY = (AI_TABLE_ROW_BLANK_HEIGHT - size) / 2;

            if (ctx && checked) {
                this.path({
                    x: x + iconX,
                    y: y + iconY,
                    size: 22,
                    data: StarFill,
                    fill: this.colors.waring,
                    scaleX: 1.14,
                    scaleY: 1.14
                });
            }
        });
    }

    private renderCellProgress(render: AITableRender, ctx?: any) {
        const { x, y, transformValue, columnWidth, style } = render;
        const colors = AITable.getColors();
        const cellText = transformValue;

        if (cellText == null || !_.isNumber(cellText)) {
            return;
        }

        const width = columnWidth - 2 * AI_TABLE_CELL_PADDING - AI_TABLE_PROGRESS_TEXT_Width;
        const height = AI_TABLE_PROGRESS_BAR_HEIGHT;
        const textHeight = AI_TABLE_COMMON_FONT_SIZE;
        const offsetX = AI_TABLE_CELL_PADDING;
        const offsetY = (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_PROGRESS_BAR_HEIGHT) / 2;
        const textOffsetY = (AI_TABLE_ROW_BLANK_HEIGHT - textHeight) / 2;

        // 绘制背景
        this.rect({
            x: x + offsetX,
            y: y + offsetY,
            width,
            height,
            radius: AI_TABLE_PROGRESS_BAR_RADIUS,
            fill: colors.gray200
        });

        // 计算并绘制进度
        const progressWidth = (transformValue / 100) * width;
        this.rect({
            x: x + offsetX,
            y: y + offsetY,
            width: progressWidth,
            height,
            radius: AI_TABLE_PROGRESS_BAR_RADIUS,
            fill: colors.success
        });

        this.text({
            x: x + offsetX + width + AI_TABLE_TEXT_GAP,
            y: y + textOffsetY,
            text: `${transformValue}%`,
            fillStyle: colors.gray800
        });
    }

    private renderCellMember(render: AITableRender, ctx?: CanvasRenderingContext2D | undefined) {
        const { references, x, y, field, transformValue: _cellValue, rowHeight, columnWidth, isActive } = render;
        const cellValue = _cellValue;

        if (!cellValue?.length || !references) {
            return;
        }
        const settings = field.settings as MemberSettings;
        const avatarSize = AI_TABLE_MEMBER_AVATAR_SIZE;
        const itemHeight = AI_TABLE_CELL_MEMBER_ITEM_HEIGHT;
        const isOperating = isActive;
        const isMulti = settings?.is_multiple;

        let currentX = AI_TABLE_CELL_PADDING;
        let currentY = (AI_TABLE_ROW_BLANK_HEIGHT - avatarSize) / 2;
        const itemOtherWidth = avatarSize + AI_TABLE_MEMBER_ITEM_PADDING_RIGHT + AI_TABLE_MEMBER_ITEM_AVATAR_MARGIN_RIGHT;
        const maxHeight = isActive ? 130 - AI_TABLE_CELL_MULTI_PADDING_TOP : rowHeight - AI_TABLE_CELL_MULTI_PADDING_TOP;
        const maxTextWidth = isOperating
            ? columnWidth - 2 * AI_TABLE_CELL_PADDING - itemOtherWidth - AI_TABLE_CELL_DELETE_ITEM_BUTTON_SIZE - 12
            : columnWidth - 2 * AI_TABLE_CELL_PADDING - itemOtherWidth;

        const listCount = cellValue.length;
        let isOverflow = false;

        for (let index = 0; index < listCount; index++) {
            const userInfo = references?.members[cellValue[index]];
            if (!userInfo) continue;

            const { uid, display_name, avatar } = userInfo;
            const itemWidth = AITableAvatarSize.size24 + (isMulti ? AI_TABLE_CELL_MEMBER_ITEM_PADDING : 0);

            currentX = AI_TABLE_CELL_PADDING + index * itemWidth;

            let realMaxTextWidth = maxTextWidth < 0 ? 0 : maxTextWidth;
            if (index === 0 && isOperating) {
                const operatingMaxWidth = maxTextWidth - (AI_TABLE_CELL_ADD_ITEM_BUTTON_SIZE + 4);
                // item No space to display, then perform a line feed
                if (operatingMaxWidth <= 20) {
                    currentX = AI_TABLE_CELL_PADDING;
                    currentY += AI_TABLE_OPTION_ITEM_HEIGHT + AI_TABLE_CELL_MULTI_ITEM_MARGIN_TOP;
                } else {
                    realMaxTextWidth = operatingMaxWidth;
                }
            }

            let isMore = currentX + itemWidth > columnWidth - 2 * AI_TABLE_CELL_PADDING;
            if (columnWidth != null) {
                // 在非活动状态下，当超出列宽时，不会渲染后续内容
                if (currentX >= columnWidth - 2 * AI_TABLE_CELL_PADDING) {
                    break;
                }
                // 如果不是非活动状态的最后一行，则换行渲染溢出内容
                if (currentX > columnWidth - 2 * AI_TABLE_CELL_PADDING) {
                    currentX = AI_TABLE_CELL_PADDING;
                }
                if (currentX + itemWidth > columnWidth - AI_TABLE_CELL_PADDING) {
                    currentX = AI_TABLE_CELL_PADDING;
                    currentY += itemHeight;
                }
                if (currentY >= maxHeight) {
                    isOverflow = true;
                }
            }

            if (ctx) {
                this.avatar({
                    x: x + currentX,
                    y: y + currentY,
                    url: avatar!,
                    id: uid!,
                    title: getAvatarShortName(display_name),
                    bgColor: getAvatarBgColor(display_name!),
                    type: AITableAvatarType.member,
                    size: AITableAvatarSize.size24
                });

                if (isMore) {
                    ctx.save();
                    ctx.globalAlpha = 0.3;
                    this.rect({
                        x: x + currentX,
                        y: y + currentY,
                        width: AITableAvatarSize.size24,
                        height: AITableAvatarSize.size24,
                        radius: 24,
                        fill: this.colors.black
                    });
                    ctx.restore();
                    this.text({
                        x: x + currentX + FONT_SIZE_SM / 2,
                        y: y + AI_TABLE_ROW_BLANK_HEIGHT / 2,
                        fillStyle: this.colors.white,
                        fontSize: FONT_SIZE_SM,
                        text: `+${listCount - index - 1}`,
                        verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE
                    });
                }
            }
        }
    }
}

export const cellDrawer = new CellDrawer();
