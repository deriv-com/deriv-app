import renderSvg2Canvas from './svg2canvas';
import { getScale } from './calculations';
import { MARKER_LINE_STYLE } from '../Constants/lines';

export const drawRing = (ctx, position, barrier, line_style = 'solid') => {
    ctx.beginPath();
    ctx.setLineDash(MARKER_LINE_STYLE[line_style]);
    ctx.arc(position.left, barrier, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
};

export const drawLine = (ctx, start, end, line_style = 'solid') => {
    ctx.beginPath();
    ctx.setLineDash(MARKER_LINE_STYLE[line_style]);
    ctx.moveTo(start.left, start.top);
    ctx.lineTo(end.left, end.top);
    ctx.stroke();
};

export const drawBarrierLine = (ctx, start, exit, barrier, line_style) => {
    drawLine(ctx, { left: start.left, top: barrier }, { left: exit.left, top: barrier }, line_style);
    drawRing(ctx, start, barrier);
    drawRing(ctx, exit, barrier);
};

export const drawVerticalLabelledLine = ({ ctx, text, icon, position: { zoom, left, top }, line_style }) => {
    // Render the label.
    const label_and_icon_offset = left - 5;
    if (icon) {
        const position = {
            zoom,
            left: label_and_icon_offset - icon.width / 2,
            top: top - 15,
        };

        renderSvg2Canvas({ ctx, icon, position });
    }

    const scale = getScale(zoom);
    const font_size = Math.floor(scale * 8);
    ctx.font = `lighter ${font_size}px IBM Plex Sans`;
    text.split(/ /).forEach((line, index) => {
        const text_width = Math.ceil(ctx.measureText(line).width);
        const text_x = label_and_icon_offset - text_width;
        const text_y = top + index * font_size + 1;
        ctx.fillText(line, text_x, text_y);
    });

    // Render the vertical line.
    drawLine(ctx, { left, top: 0 }, { left, top: ctx.canvas.height }, line_style);
};
