import GraphemeSplitter from 'grapheme-splitter';
import {
    AI_TABLE_OFFSET,
    AI_TABLE_TAG_FONT_SIZE,
    AI_TABLE_TAG_PADDING,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_WEIGHT,
    DEFAULT_TEXT_ALIGN_CENTER,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_DECORATION,
    DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
    DEFAULT_TEXT_VERTICAL_ALIGN_TOP,
    DEFAULT_WRAP_TEXT_MAX_ROW,
    FONT_SIZE_SM,
    WebOutlinedPath
} from '../../constants';
import { AITable } from '../../core';
import {
    AITableArc,
    AITableAvatarSize,
    AITableAvatarType,
    AITableCtxStyle,
    AITableImage,
    AITableLabel,
    AITableLine,
    AITableRect,
    AITableText,
    AITableTextEllipsis,
    AITableWrapText,
    AITableWrapTextData
} from '../../types';
import { getTextWidth, imageCache, textDataCache, TextMeasure } from '../../utils';

// 用于正确地分割字符串，包括表情符号
export const graphemeSplitter = new GraphemeSplitter();

/**
 * 用于在 Canvas 上进行的各种绘图操作，包含了文本绘制、矩形绘制、路径绘制以及一些几何计算等功能
 */
export class Drawer {
    ctx: CanvasRenderingContext2D = TextMeasure().context!;
    needDraw = false;
    colors = AITable.getColors();

    public initCtx(ctx: CanvasRenderingContext2D) {
        this.needDraw = Boolean(ctx);
        this.ctx = ctx || TextMeasure().context!;
        /**
         * textBaseline 指定为 middle，兼容浏览器差异
         */
        this.ctx.textBaseline = DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE;
    }

    // 设置样式
    public setStyle(options: AITableCtxStyle) {
        const { fontSize, fontWeight, fillStyle, strokeStyle } = options;

        if (fontSize || fontWeight) {
            this.ctx.font = `${fontWeight || DEFAULT_FONT_WEIGHT} ${fontSize || DEFAULT_FONT_SIZE}px ${DEFAULT_FONT_FAMILY}`;
        }
        if (fillStyle) {
            this.ctx.fillStyle = fillStyle;
        }
        if (strokeStyle) {
            this.ctx.strokeStyle = strokeStyle;
        }
    }

    // 文本省略
    public textEllipsis(options: AITableTextEllipsis) {
        const { text, maxWidth, fontSize = DEFAULT_FONT_SIZE, fontWeight = DEFAULT_FONT_WEIGHT } = options;

        if (text == null)
            return {
                text: '',
                textWidth: 0,
                isEllipsis: false
            };
        const fontStyle = `${fontWeight} ${fontSize}px ${DEFAULT_FONT_FAMILY}`;

        if (!maxWidth) {
            return {
                text,
                textWidth: getTextWidth(this.ctx, text, fontStyle),
                isEllipsis: false
            };
        }

        const ellipsis = '…';
        const textSize = text.length;
        // 预先确定传入文本的阈值宽度
        let guessSize = Math.ceil(maxWidth / fontSize);
        let guessText = text.substr(0, guessSize);
        let guessWidth = getTextWidth(this.ctx, guessText, fontStyle);

        while (guessWidth <= maxWidth) {
            if (textSize <= guessSize) {
                return {
                    text,
                    textWidth: guessWidth,
                    isEllipsis: false
                };
            }
            guessSize++;
            guessText = text.substr(0, guessSize);
            guessWidth = getTextWidth(this.ctx, guessText, fontStyle);
        }

        const ellipsisWidth = getTextWidth(this.ctx, ellipsis, fontStyle);
        while (guessSize >= 0 && guessWidth + ellipsisWidth > maxWidth) {
            guessSize--;
            guessText = text.substr(0, guessSize);
            guessWidth = getTextWidth(this.ctx, guessText, fontStyle);
        }

        return {
            text: `${guessText || text[0]}${ellipsis}`,
            textWidth: maxWidth,
            isEllipsis: true
        };
    }

    // 绘制线段
    public line(options: AITableLine) {
        const { x, y, points, stroke, closed = false } = options;
        const length = points.length;

        this.ctx.save();
        this.ctx.beginPath();
        if (stroke) this.ctx.strokeStyle = stroke;
        this.ctx.lineWidth = 1;
        this.ctx.translate(x, y);
        this.ctx.moveTo(points[0], points[1]);

        for (let n = 2; n < length; n += 2) {
            this.ctx.lineTo(points[n], points[n + 1]);
        }

        if (closed) {
            this.ctx.closePath();
        }
        this.ctx.stroke();
        this.ctx.restore();
    }

    // 绘制圆
    public arc(options: AITableArc) {
        const { x, y, stroke, fill, radius } = options;
        this.ctx.beginPath();
        if (fill) this.setStyle({ fillStyle: fill });
        if (stroke) this.setStyle({ strokeStyle: stroke });
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        if (fill) {
            this.ctx.fill();
        }
        if (stroke) {
            this.ctx.stroke();
        }
    }

    // 绘制矩形
    public rect(options: AITableRect) {
        const { x, y, width, height, radius, fill, stroke } = options;

        this.ctx.beginPath();
        if (fill) this.setStyle({ fillStyle: fill });
        if (stroke) this.setStyle({ strokeStyle: stroke });

        if (!radius) {
            this.ctx.rect(x, y, width, height);
        } else {
            let topLeft = 0;
            let topRight = 0;
            let bottomLeft = 0;
            let bottomRight = 0;

            if (typeof radius === 'number') {
                topLeft = topRight = bottomLeft = bottomRight = Math.min(radius, width / 2, height / 2);
            } else {
                topLeft = Math.min(radius[0] || 0, width / 2, height / 2);
                topRight = Math.min(radius[1] || 0, width / 2, height / 2);
                bottomRight = Math.min(radius[2] || 0, width / 2, height / 2);
                bottomLeft = Math.min(radius[3] || 0, width / 2, height / 2);
            }

            this.ctx.moveTo(x + topLeft, y);
            this.ctx.lineTo(x + width - topRight, y);
            this.ctx.arc(x + width - topRight, y + topRight, topRight, (Math.PI * 3) / 2, 0, false);
            this.ctx.lineTo(x + width, y + height - bottomRight);
            this.ctx.arc(x + width - bottomRight, y + height - bottomRight, bottomRight, 0, Math.PI / 2, false);
            this.ctx.lineTo(x + bottomLeft, y + height);
            this.ctx.arc(x + bottomLeft, y + height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
            this.ctx.lineTo(x, y + topLeft);
            this.ctx.arc(x + topLeft, y + topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
        }

        this.ctx.closePath();

        if (fill) {
            this.ctx.fill();
        }
        if (stroke) {
            this.ctx.stroke();
        }
    }

    public customRect(options: AITableRect) {
        const { x, y, width, height, fill, strokes } = options;
        if (fill) this.setStyle({ fillStyle: fill });
        this.ctx.fillRect(x, y, width, height);
        if (strokes) {
            const { top, right, bottom, left } = strokes;
            // 上边框
            this.ctx.beginPath();
            this.setStyle({ strokeStyle: top ?? this.colors.transparent });
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + width, y);
            this.ctx.stroke();
            // 右边框
            this.ctx.beginPath();
            this.setStyle({ strokeStyle: right ?? this.colors.transparent });
            this.ctx.moveTo(x + width, y);
            this.ctx.lineTo(x + width, y + height);
            this.ctx.stroke();
            // 下边框
            this.ctx.beginPath();
            this.setStyle({ strokeStyle: bottom ?? this.colors.transparent });
            this.ctx.moveTo(x, y + height);
            this.ctx.lineTo(x + width, y + height);
            this.ctx.stroke();
            // 左边框
            this.ctx.beginPath();
            this.setStyle({ strokeStyle: left ?? this.colors.transparent });
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + height);
            this.ctx.stroke();
        }
    }

    // 换行文本绘制
    public wrapText(options: AITableWrapText) {
        const {
            x,
            y,
            text,
            maxWidth,
            lineHeight,
            maxRow = DEFAULT_WRAP_TEXT_MAX_ROW,
            fontSize = DEFAULT_FONT_SIZE,
            fillStyle = this.colors.gray800,
            textAlign = DEFAULT_TEXT_ALIGN_LEFT,
            verticalAlign = DEFAULT_TEXT_VERTICAL_ALIGN_TOP,
            fontWeight = DEFAULT_FONT_WEIGHT,
            textDecoration = DEFAULT_TEXT_DECORATION,
            fieldType,
            needDraw = false
        } = options;
        let offsetX = 0;
        let offsetY = 0;
        const fontStyle = `${fontWeight} ${fontSize}px ${DEFAULT_FONT_FAMILY}`;
        const baselineOffset = verticalAlign === DEFAULT_TEXT_VERTICAL_ALIGN_TOP ? fontSize / 2 : 0;
        const fontStyleKey = `${fontWeight}-${fontSize}px`;
        const isUnderline = textDecoration === 'underline';
        this.ctx.font = fontStyle;
        const textRenderer = (textDataList: any[]) => {
            textDataList.forEach((data) => {
                const { offsetX, offsetY, text, width, linkUrl } = data;
                this.ctx.fillText(text, x + offsetX, y + offsetY + baselineOffset);
                if (linkUrl || isUnderline) {
                    this.line({
                        x: x + offsetX,
                        y: y + offsetY + AI_TABLE_OFFSET,
                        points: [0, fontSize, width, fontSize],
                        stroke: fillStyle
                    });
                }
            });
        };

        if (fillStyle) this.setStyle({ fillStyle });
        this.ctx.textAlign = textAlign;
        const cacheKey = `${fontStyleKey}-${maxRow}-${maxWidth || 0}-${fieldType}-${text}`;
        const cacheTextData = textDataCache.get(cacheKey);
        if (cacheTextData) {
            if (this.needDraw && needDraw) {
                textRenderer(cacheTextData.data);
            }
            return cacheTextData;
        }

        const resultData: AITableWrapTextData = [];
        // 准确切分包含表情符号的字符串
        const arrText = graphemeSplitter.splitGraphemes(text);
        const textLength = arrText.length;
        const ellipsisWidth = this.ctx.measureText('…').width;
        let showText = ''; // 每个片段显示的文本
        let showTextWidth = 0; // 每段的宽度
        let showLineWidth = 0; // 当前每行显示文字的宽度
        let rowCount = 0;

        const isEllipsis = this.textEllipsis({ text, maxWidth: maxWidth }).isEllipsis;

        for (let n = 0; n < textLength; n++) {
            const curText = arrText[n];
            const isLineBreak = ['\n', '\r'].includes(curText);
            const singleText = isLineBreak ? '' : curText;
            const composeText = showText + singleText;
            const isLimitRow = maxRow ? rowCount >= maxRow - 1 : false;
            const singleTextWidth = isLineBreak ? 0 : this.ctx.measureText(singleText).width;
            showLineWidth += singleTextWidth;
            const diffWidth = isLimitRow ? showLineWidth + (isEllipsis ? ellipsisWidth : 0) : showLineWidth;
            const isLineEnd = diffWidth > maxWidth;

            // 遇到换行符或行尾
            if ((isLineEnd || isLineBreak) && rowCount < maxRow) {
                const isLastLetter = n === arrText.length - 1;
                resultData.push({
                    offsetX,
                    offsetY,
                    width: Math.ceil(showTextWidth),
                    text: isLimitRow ? (isLastLetter ? composeText : `${showText}…`) : showText
                });
                showText = singleText;
                offsetX = 0;
                showTextWidth = singleTextWidth;
                showLineWidth = singleTextWidth;

                if (isLimitRow) {
                    showText = '';
                    break;
                }
                rowCount++;
                offsetY += lineHeight;
                continue;
            }

            showText = composeText;
            showTextWidth += singleTextWidth;
        }

        if (showText) {
            resultData.push({
                offsetX,
                offsetY,
                width: Math.ceil(showTextWidth),
                text: showText
            });
        }

        if (this.needDraw && needDraw) {
            textRenderer(resultData);
        }

        const res = {
            height: rowCount < maxRow ? offsetY + lineHeight : offsetY,
            data: resultData
        };

        textDataCache.set(cacheKey, res);
        return res;
    }

    // 绘制单行文本
    public text(options: AITableText) {
        const {
            x,
            y,
            text,
            fontSize = DEFAULT_FONT_SIZE,
            fillStyle = this.colors.gray800,
            textAlign = DEFAULT_TEXT_ALIGN_LEFT,
            verticalAlign = DEFAULT_TEXT_VERTICAL_ALIGN_TOP,
            fontWeight = DEFAULT_FONT_WEIGHT,
            textDecoration = DEFAULT_TEXT_DECORATION
        } = options;

        const fontStyle = `${fontWeight} ${fontSize}px ${DEFAULT_FONT_FAMILY}`;

        if (textDecoration === 'underline') {
            const textWidth = getTextWidth(this.ctx, text, fontStyle);
            this.line({
                x: x,
                y: y + AI_TABLE_OFFSET,
                points: [0, fontSize, textWidth, fontSize],
                stroke: fillStyle
            });
        }

        const baselineOffset = verticalAlign === DEFAULT_TEXT_VERTICAL_ALIGN_TOP ? fontSize / 2 : 0;
        if (fillStyle) this.setStyle({ fillStyle });
        this.ctx.textAlign = textAlign;
        console.log(`set: ${fontStyle}`);
        this.ctx.font = fontStyle;
        this.ctx.fillText(text, x, y + baselineOffset);
    }

    // 绘制标签
    public tag(options: AITableLabel): { width: number; height: number } {
        const {
            x,
            y,
            width,
            height,
            text,
            radius,
            background,
            color = this.colors.gray800,
            fontSize = AI_TABLE_TAG_FONT_SIZE,
            fontWeight = DEFAULT_FONT_WEIGHT,
            stroke
        } = options;

        // 背景
        this.rect({
            x,
            y,
            width,
            height,
            radius,
            fill: background,
            stroke
        });

        this.text({
            x: x + AI_TABLE_TAG_PADDING,
            y: y + (height - fontSize) / 2,
            text,
            fillStyle: color,
            fontSize,
            fontWeight
        });

        return {
            width,
            height
        };
    }

    public image(options: AITableImage, crossOrigin?: boolean, allowDefault?: boolean) {
        const { x, y, url, width, height, opacity = 1, clipFunc } = options;
        const colors = AITable.getColors();
        if (!url) {
            return;
        }
        const image = imageCache.getImage(url);
        // Not loaded successfully
        if (image === false) {
            if (allowDefault) {
                this.path({
                    x,
                    y: y + 2,
                    data: WebOutlinedPath,
                    size: 16,
                    fill: colors.gray600
                });
            }
            return;
        }
        // Unloaded
        if (image == null) {
            return imageCache.loadImage(url, url, { crossOrigin });
        }
        const isOrigin = opacity === 1;

        if (!clipFunc && isOrigin) {
            return this.ctx.drawImage(image, x, y, width, height);
        }

        if (!clipFunc && !isOrigin) {
            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            this.ctx.drawImage(image, x, y, width, height);
            this.ctx.restore();
            return;
        }

        if (clipFunc) {
            this.ctx.save();
            this.ctx.beginPath();
            clipFunc(this.ctx);
            this.ctx.clip();
            this.ctx.globalAlpha = opacity;
            this.ctx.drawImage(image, x, y, width, height);
            this.ctx.restore();
        }
    }

    public avatar(options: {
        x: number;
        y: number;
        url: string;
        id: string;
        title: string;
        type?: AITableAvatarType;
        size?: AITableAvatarSize;
        opacity?: number;
        bgColor?: string;
    }) {
        const {
            x = 0,
            y = 0,
            id,
            url,
            title,
            bgColor = this.colors.white,
            size = AITableAvatarSize.size36,
            type = AITableAvatarType.member,
            opacity = 1
        } = options;

        if (title == null || id == null) return null;
        const colors = AITable.getColors();
        const avatarSrc = url || '';
        const avatarName = title;
        const avatarBg = avatarSrc ? colors.white : bgColor;

        switch (type) {
            case AITableAvatarType.member: {
                const radius = size / 2;
                if (!avatarSrc) {
                    this.ctx.fillStyle = avatarBg;
                    this.ctx.beginPath();
                    this.ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
                    this.ctx.closePath();
                    this.ctx.fill();
                    return this.text({
                        x: x + radius,
                        y: y + radius,
                        text: avatarName,
                        textAlign: DEFAULT_TEXT_ALIGN_CENTER,
                        verticalAlign: DEFAULT_TEXT_VERTICAL_ALIGN_MIDDLE,
                        fontSize: FONT_SIZE_SM,
                        fillStyle: colors.white
                    });
                }
                return this.image({
                    name: avatarSrc,
                    x,
                    y,
                    url: avatarSrc,
                    width: size,
                    height: size,
                    clipFunc: (ctx) => {
                        ctx.fillStyle = avatarBg;
                        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
                        ctx.fill();
                    },
                    opacity
                });
            }
        }
    }

    /**
     * 方法将椭圆弧的端点参数化形式转换为中心参数化形式
     * 接受弧线的端点参数，并计算出弧线的中心点坐标、起始角度、终止角度等参数
     * 返回值：一个包含中心点坐标、半径、旋转角度、起始角度以及角度差的对象，这些参数可以直接用于绘制椭圆弧
     * @returns [cx, cy, rx, ry, theta, dTheta, psi, fs]
     */
    private convertEndpointToCenterParameterization(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        fa: any,
        fs: number,
        rx: number,
        ry: number,
        psiDeg: number
    ) {
        const psi = psiDeg * (Math.PI / 180.0);
        const xp = (Math.cos(psi) * (x1 - x2)) / 2.0 + (Math.sin(psi) * (y1 - y2)) / 2.0;
        const yp = (-1 * Math.sin(psi) * (x1 - x2)) / 2.0 + (Math.cos(psi) * (y1 - y2)) / 2.0;

        const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        let f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) / (rx * rx * (yp * yp) + ry * ry * (xp * xp)));

        if (fa === fs) {
            f *= -1;
        }
        if (isNaN(f)) {
            f = 0;
        }

        const cxp = (f * rx * yp) / ry;
        const cyp = (f * -ry * xp) / rx;

        const cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        const cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

        const vMag = function (v: number[]) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        const vRatio = function (u: number[], v: number[]) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        const vAngle = function (u: number[], v: number[]) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        };
        const theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
        const u = [(xp - cxp) / rx, (yp - cyp) / ry];
        const v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        let dTheta = vAngle(u, v);

        if (vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if (vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if (fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if (fs === 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    }

    /**
     * 计算两个点 (x1, y1) 和 (x2, y2) 之间的直线距离
     * @returns 两个点 (x1, y1) 和 (x2, y2) 之间的直线距离，单位与输入的坐标值相同
     */
    private getLineLength(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    /**
     * 计算三次贝塞尔曲线上给定参数 t 对应的点的坐标.
     * 可以在指定的 t 参数下计算出曲线上精确的一个点，这个点可以用于绘制平滑曲线的一部分
     * @param pct - 0 到 1 之间的参数，用于指定曲线上的点的位置
     * @param P1x - 曲线的起点 x 坐标
     * @param P1y - 曲线的起点 y 坐标
     * @param P2x - 曲线的第一个控制点 x 坐标
     * @param P2y - 曲线的第一个控制点 y 坐标
     * @param P3x - 曲线的第二个控制点 x 坐标
     * @param P3y - 曲线的第二个控制点 y 坐标
     * @param P4x - 曲线的终点 x 坐标
     * @param P4y - 曲线的终点 y 坐标
     * @returns
     */
    private getPointOnCubicBezier(
        pct: number,
        P1x: number,
        P1y: number,
        P2x: number,
        P2y: number,
        P3x: number,
        P3y: number,
        P4x: number,
        P4y: number
    ) {
        function CB1(t: number) {
            return t * t * t;
        }

        function CB2(t: number) {
            return 3 * t * t * (1 - t);
        }

        function CB3(t: number) {
            return 3 * t * (1 - t) * (1 - t);
        }

        function CB4(t: number) {
            return (1 - t) * (1 - t) * (1 - t);
        }

        const x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
        const y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);

        return {
            x: x,
            y: y
        };
    }

    /**
     * 计算二次贝塞尔曲线上给定参数 t 对应的点的坐标
     * @param pct - 0 到 1 之间的参数，用于指定曲线上的点的位置
     * @param P1x - 曲线的起点 x 坐标
     * @param P1y - 曲线的起点 y 坐标
     * @param P2x - 曲线的控制点 x 坐标
     * @param P2y - 曲线的控制点 y 坐标
     * @param P3x - 曲线的终点 x 坐标
     * @param P3y - 曲线的终点 y 坐标
     * @returns
     */
    private getPointOnQuadraticBezier(pct: number, P1x: number, P1y: number, P2x: number, P2y: number, P3x: number, P3y: number) {
        function QB1(t: number) {
            return t * t;
        }

        function QB2(t: number) {
            return 2 * t * (1 - t);
        }

        function QB3(t: number) {
            return (1 - t) * (1 - t);
        }

        const x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
        const y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);

        return {
            x: x,
            y: y
        };
    }

    /**
     * 计算椭圆弧上给定角度 θ 对应的点的坐标
     * @param cx - 椭圆的中心点 x 坐标
     * @param cy - 椭圆的中心点 y 坐标
     * @param rx - 椭圆的 x 轴半径
     * @param ry - 椭圆的 y 轴半径
     * @param theta - 椭圆弧的起始角度
     * @param psi - 椭圆弧的旋转角度
     * @returns
     */
    private getPointOnEllipticalArc(cx: number, cy: number, rx: number, ry: number, theta: number, psi: number) {
        const cosPsi = Math.cos(psi);
        const sinPsi = Math.sin(psi);
        const pt = {
            x: rx * Math.cos(theta),
            y: ry * Math.sin(theta)
        };
        return {
            x: cx + (pt.x * cosPsi - pt.y * sinPsi),
            y: cy + (pt.x * sinPsi + pt.y * cosPsi)
        };
    }

    /**
     * 计算基于不同路径命令的长度
     * @param x - 起点 x 坐标
     * @param y - 起点 y 坐标
     * @param cmd - 路径命令
     * @param points - 与路径命令相关的点的坐标或控制参数
     * @returns
     */
    private calcLength(x: number, y: number, cmd: string, points: number[]) {
        let len, p1, p2, t;

        switch (cmd) {
            case 'L':
                return this.getLineLength(x, y, points[0], points[1]);
            case 'C':
                len = 0.0;
                p1 = this.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                for (t = 0.01; t <= 1; t += 0.01) {
                    p2 = this.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                    len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'Q':
                len = 0.0;
                p1 = this.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
                for (t = 0.01; t <= 1; t += 0.01) {
                    p2 = this.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
                    len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'A':
                len = 0.0;
                const start = points[4];
                const dTheta = points[5];
                const end = points[4] + dTheta;
                let inc = Math.PI / 180.0;
                if (Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                p1 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
                if (dTheta < 0) {
                    for (t = start - inc; t > end; t -= inc) {
                        p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                } else {
                    for (t = start + inc; t < end; t += inc) {
                        p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
                len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
                return len;
        }
        return 0;
    }

    /**
     * 解析 SVG 路径数据字符串，将其转换为一个包含路径命令和坐标点的数组对象
     * @param data - SVG 路径数据字符串
     * @returns
     */
    private parsePathData(data: string) {
        if (!data) {
            return [];
        }

        let cs = data;
        const cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];

        cs = cs.replace(new RegExp(' ', 'g'), ',');
        for (let n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        const arr = cs.split('|');
        const ca: any = [];
        const coords: any = [];
        let cpx = 0;
        let cpy = 0;

        const re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
        let match: RegExpExecArray | null;
        for (let n = 1; n < arr.length; n++) {
            let str = arr[n];
            let c = str.charAt(0);
            str = str.slice(1);

            coords.length = 0;
            while ((match = re.exec(str))) {
                coords.push(match[0]);
            }

            const p: any = [];

            for (let j = 0, jlen = coords.length; j < jlen; j++) {
                if (coords[j] === '00') {
                    p.push(0, 0);
                    continue;
                }
                const parsed = parseFloat(coords[j]);
                if (!isNaN(parsed)) {
                    p.push(parsed);
                } else {
                    p.push(0);
                }
            }

            while (p.length > 0) {
                if (isNaN(p[0])) {
                    break;
                }

                let cmd: string | null = null;
                let points: any = [];
                const startX = cpx;
                const startY = cpy;
                let prevCmd, ctlPtx, ctlPty;
                let rx, ry, psi, fa, fs, x1, y1;

                switch (c) {
                    case 'l':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'L':
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'm':
                        const dx = p.shift();
                        const dy = p.shift();
                        cpx += dx;
                        cpy += dy;
                        cmd = 'M';
                        if (ca.length > 2 && ca[ca.length - 1].command === 'z') {
                            for (let idx = ca.length - 2; idx >= 0; idx--) {
                                if (ca[idx].command === 'M') {
                                    cpx = ca[idx].points[0] + dx;
                                    cpy = ca[idx].points[1] + dy;
                                    break;
                                }
                            }
                        }
                        points.push(cpx, cpy);
                        c = 'l';
                        break;
                    case 'M':
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'L';
                        break;

                    case 'h':
                        cpx += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'H':
                        cpx = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'v':
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'V':
                        cpy = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'C':
                        points.push(p.shift(), p.shift(), p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'c':
                        points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'S':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 's':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'Q':
                        points.push(p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'q':
                        points.push(cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(cpx, cpy);
                        break;
                    case 'T':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    case 'a':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                }

                ca.push({
                    command: cmd || c,
                    points: points,
                    start: {
                        x: startX,
                        y: startY
                    },
                    pathLength: this.calcLength(startX, startY, cmd || c, points)
                });
            }

            if (c === 'z' || c === 'Z') {
                ca.push({
                    command: 'z',
                    points: [],
                    start: undefined,
                    pathLength: 0
                });
            }
        }

        return ca;
    }

    /**
     * 根据传入的路径数据 data 在画布上绘制路径
     * @param options
     */
    public path(options: { x: number; y: number; data: string; size?: number; scaleX?: number; scaleY?: number; fill: string }) {
        const { x, y, scaleX = 1, scaleY = 1, data, fill } = options;
        const dataArray = this.parsePathData(data);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = fill;
        this.ctx.translate(x, y);
        this.ctx.scale(scaleX, scaleY);
        let isClosed = false;
        for (let n = 0; n < dataArray.length; n++) {
            const c = dataArray[n].command;
            const p = dataArray[n].points;
            switch (c) {
                case 'L':
                    this.ctx.lineTo(p[0], p[1]);
                    break;
                case 'M':
                    this.ctx.moveTo(p[0], p[1]);
                    break;
                case 'C':
                    this.ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                    break;
                case 'Q':
                    this.ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                    break;
                case 'A':
                    const cx = p[0];
                    const cy = p[1];
                    const rx = p[2];
                    const ry = p[3];
                    const theta = p[4];
                    const dTheta = p[5];
                    const psi = p[6];
                    const fs = p[7];
                    const r = rx > ry ? rx : ry;
                    const scaleX = rx > ry ? 1 : rx / ry;
                    const scaleY = rx > ry ? ry / rx : 1;

                    this.ctx.translate(cx, cy);
                    this.ctx.rotate(psi);
                    this.ctx.scale(scaleX, scaleY);
                    this.ctx.arc(0, 0, r, theta, theta + dTheta, (1 - fs) as any);
                    this.ctx.scale(1 / scaleX, 1 / scaleY);
                    this.ctx.rotate(-psi);
                    this.ctx.translate(-cx, -cy);

                    break;
                case 'z':
                    isClosed = true;
                    this.ctx.closePath();
                    break;
            }
        }

        if (!isClosed) {
            this.ctx.stroke();
        } else {
            this.ctx.fill();
        }
        this.ctx.restore();
    }
}

export const drawer = new Drawer();
