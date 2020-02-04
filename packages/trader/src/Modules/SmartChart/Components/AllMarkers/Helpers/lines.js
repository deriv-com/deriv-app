import Svg2Canvas from './svg2canvas';
import { calc_scale } from './calculations';
import { MARKER_LINE_STYLE } from '../Constants/lines';

export const draw_ring = (ctx, position, barrier, line_style = 'solid') => {
    ctx.beginPath();
    ctx.setLineDash(MARKER_LINE_STYLE[line_style]);
    ctx.arc(position.left, barrier, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
};

export const draw_line = (ctx, start, end, line_style = 'solid') => {
    ctx.beginPath();
    ctx.setLineDash(MARKER_LINE_STYLE[line_style]);
    ctx.moveTo(start.left, start.top);
    ctx.lineTo(end.left, end.top);
    ctx.stroke();
};

export const draw_barrier_line = (ctx, start, exit, barrier, line_style) => {
    draw_line(ctx, { left: start.left, top: barrier }, { left: exit.left, top: barrier }, line_style);
    draw_ring(ctx, start, barrier);
    draw_ring(ctx, exit, barrier);
};

export const draw_vertical_labelled_line = ({ ctx, text, icon, position: { zoom, left, top }, line_style }) => {
    // Render the label.
    const label_and_icon_offset = left - 5;
    if (icon) {
        const position = {
            zoom,
            left: label_and_icon_offset - icon.width / 2,
            top: top - 15,
        };

        Svg2Canvas.render({ ctx, icon, position });
    }

    const scale = calc_scale(zoom);
    const font_size = Math.floor(scale * 8);
    ctx.font = `lighter ${font_size}px IBM Plex Sans`;
    text.split(/\n/).forEach((line, index) => {
        const text_width = Math.ceil(ctx.measureText(line).width);
        const text_x = label_and_icon_offset - text_width;
        const text_y = top + index * font_size + 1;
        ctx.fillText(line, text_x, text_y);
    });

    // Render the vertical line.
    draw_line(ctx, { left, top: 0 }, { left, top: ctx.canvas.height }, line_style);
};
