import { calculateScale, calculateHexOpacity } from './calculations';

const BasicCanvasElements = (() => {
    const MARKER_LINE_STYLE = {
        dashed: [2, 2],
        solid: [],
    };

    /**
        @param {CanvasRenderingContext2D} ctx
        @param {Array} coordinates [x1, y1, x2, y2]
        @param {String} line_style
    */
    const Line = (ctx, points, line_style, stroke_style) => {
        ctx.beginPath();
        ctx.setLineDash(MARKER_LINE_STYLE[line_style]);
        ctx.moveTo(points[0], points[1]);
        ctx.lineTo(points[2], points[3]);
        if (stroke_style) ctx.strokeStyle = stroke_style;
        ctx.stroke();
    };

    const Circle = (ctx, points, radius, line_style, stroke_style, fill_style) => {
        ctx.beginPath();
        ctx.setLineDash(MARKER_LINE_STYLE[line_style]);
        ctx.arc(points[0], points[1], radius, 0, Math.PI * 2);
        if (stroke_style) ctx.strokeStyle = stroke_style;
        if (fill_style) ctx.fillStyle = fill_style;
        ctx.fill();
        ctx.stroke();
    };

    const Shade = (ctx, points, color) => {
        const shade_height = 120;
        const should_shade_be_above = points[1] > points[3];

        const gradient = ctx.createLinearGradient(
            points[0],
            points[1],
            points[0],
            should_shade_be_above ? points[1] - shade_height : points[1] + shade_height
        );

        gradient.addColorStop(0, `${color}${calculateHexOpacity(0.16)}`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;

        ctx.fillRect(
            points[0],
            should_shade_be_above ? points[1] - shade_height : points[1],
            points[2] - points[0],
            shade_height
        );
    };

    const Text = (ctx, points, text, scale, fill_style) => {
        ctx.textAlign = 'center';
        ctx.font = `bold ${Math.floor(scale * 10)}px IBM Plex Sans`;
        if (fill_style) ctx.fillStyle = fill_style;
        ctx.fillText(text, points[0], points[1]);
    };

    const SVG = (ctx, icon, svg_points, zoom) => {
        ctx.save();

        const scale = calculateScale(zoom);
        ctx.translate(svg_points[0] - (icon.width * scale) / 2, svg_points[1] - (icon.height * scale) / 2);
        ctx.scale(scale, scale);

        icon.paths.forEach(({ points, fill, stroke }) => {
            if (fill) ctx.fillStyle = fill;
            if (stroke) ctx.strokeStyle = stroke;

            ctx.beginPath();
            let prev_x, prev_y;
            for (let idx = 0; idx < points.length; idx++) {
                let x, y, cx1, cx2, cy1, cy2, r;
                if (points[idx] === 'M') {
                    x = points[++idx];
                    y = points[++idx];
                    ctx.moveTo(x, y);
                } else if (points[idx] === 'L') {
                    x = points[++idx];
                    y = points[++idx];
                    ctx.lineTo(x, y);
                } else if (points[idx] === 'V') {
                    y = points[++idx];
                    ctx.lineTo(prev_x, y);
                } else if (points[idx] === 'H') {
                    x = points[++idx];
                    ctx.lineTo(x, prev_y);
                } else if (points[idx] === 'Q') {
                    cx1 = points[++idx];
                    cy1 = points[++idx];
                    x = points[++idx];
                    y = points[++idx];
                    ctx.quadraticCurveTo(cx1, cy1, x, y);
                } else if (points[idx] === 'C') {
                    cx1 = points[++idx];
                    cy1 = points[++idx];
                    cx2 = points[++idx];
                    cy2 = points[++idx];
                    x = points[++idx];
                    y = points[++idx];
                    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
                } else if (points[idx] === 'A') {
                    x = points[++idx];
                    y = points[++idx];
                    r = points[++idx];
                    const start_a = points[++idx];
                    const end_a = points[++idx];
                    ctx.arc(x, y, r, start_a, end_a);
                }
                prev_x = x;
                prev_y = y;
            }

            ctx.closePath();

            if (fill) ctx.fill();
            if (stroke) ctx.stroke();
        });

        ctx.scale(1, 1);
        ctx.restore();
    };

    // not really basic but we put them here for now
    const BarrierLine = (ctx, points, line_style, stroke_style, fill_style) => {
        Line(ctx, points, line_style, stroke_style);
        Circle(ctx, [points[0], points[1]], 2, 'solid', stroke_style, fill_style);
        Circle(ctx, [points[2], points[3]], 2, 'solid', stroke_style, fill_style);
    };

    const VerticalLabelledLine = (ctx, points, zoom, text, icon, line_style, stroke_style, fill_style) => {
        const label_and_icon_offset = points[0] - 5;
        if (icon) {
            SVG(ctx, icon, [label_and_icon_offset - icon.width / 2, points[1] - 15], zoom);
        }

        const scale = calculateScale(zoom);
        const font_size = Math.floor(scale * 8);

        if (fill_style) ctx.fillStyle = fill_style;
        ctx.font = `lighter ${font_size}px IBM Plex Sans`;
        text.split(/ /).forEach((line, index) => {
            const text_width = Math.ceil(ctx.measureText(line).width);
            const text_x = label_and_icon_offset - text_width;
            const text_y = points[1] + index * font_size + 1;
            ctx.fillText(line, text_x, text_y);
        });

        Line(ctx, [points[0], 0, points[0], ctx.canvas.height], line_style, stroke_style);
    };

    return {
        Line,
        Circle,
        Shade,
        Text,
        SVG,
        BarrierLine,
        VerticalLabelledLine,
    };
})();

export default BasicCanvasElements;
