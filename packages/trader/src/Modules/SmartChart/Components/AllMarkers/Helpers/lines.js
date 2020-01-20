import Svg2Canvas            from './svg2canvas';
import { calc_scale }        from './calculations';
import { MARKER_LINE_STYLE } from '../Constants/lines';

export const draw_arc = ({
    ctx,
    position,
    barrier,
    line_style = 'solid',
}) => {
    ctx.beginPath();
    ctx.setLineDash(MARKER_LINE_STYLE[line_style]);
    ctx.arc(position.left, barrier, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
};

export const draw_line = ({
    ctx,
    start,
    end,
    line_style = 'solid',
}) => {
    ctx.beginPath();
    ctx.setLineDash(MARKER_LINE_STYLE[line_style]);
    ctx.moveTo(start.left, start.top);
    ctx.lineTo(end.left, end.top);
    ctx.stroke();
};

export const draw_barrier_line_to_icon = ({
    ctx,
    exit,
    barrier,
    icon,
}) => {
    const start = { left: exit.left, top: barrier };

    draw_line({ ctx, start, end: exit, line_style: 'dashed' });
    Svg2Canvas.render({ ctx, icon, position: exit });
};

export const draw_barrier_line = ({
    ctx,
    start,
    exit,
    barrier,
    line_style,
}) => {
    draw_line({
        ctx,
        start: { left: start.left, top: barrier },
        end  : { left: exit.left, top: barrier },
        line_style,
    });
    draw_arc({ ctx, position: start, barrier });
    draw_arc({ ctx, position: exit, barrier });
};

export const draw_vertical_labelled_line = ({
    ctx,
    text,
    icon,
    position: {
        zoom,
        left,
        top,
    },
    line_style,
}) => {
    // Render the label.
    const label_and_icon_offset = left - 5;
    if (icon) {
        const position = {
            zoom,
            left: label_and_icon_offset - (icon.width / 2),
            top : top - 15,
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
    draw_line({
        ctx,
        start: { left, top: 0 },
        end  : { left, top: ctx.canvas.height },
        line_style,
    });
};
