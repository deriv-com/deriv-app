import { getScale } from './calculations';

/** @param {CanvasRenderingContext2D} ctx */
const renderSvg2Canvas = ({ ctx, icon, position: { zoom, top, left } }) => {
    ctx.save();
    const scale = getScale(zoom);

    ctx.translate(left - (icon.width * scale) / 2, top - (icon.height * scale) / 2);

    ctx.scale(scale, scale);

    icon.paths.forEach(({ points, fill, stroke }) => {
        if (fill) {
            ctx.fillStyle = fill;
        }
        if (stroke) {
            ctx.strokeStyle = stroke;
        }
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
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    });
    ctx.scale(1, 1);
    ctx.restore();
};

export default renderSvg2Canvas;
