import React          from 'react';
import { FastMarker, RawMarker } from 'smartcharts-beta';
import * as ICONS from './icons';

const RawMarkerMaker = (draw_callback) => {
    const Marker = ({ epoch_array, ...rest }) => (
        <RawMarker
            epoch_array={epoch_array}
            draw_callback={args => draw_callback({ ...args, ...rest })}
        />
    );
    return Marker;
};

export const FastMarkerMaker = children => {
    const Marker = ({ epoch, price, calculate_price, draw_callback, ...rest }) => {
        const onRef = ref => {
            if (ref) {
                ref.setPosition({ epoch, price, calculate_price, draw_callback });
            }
        };
        return (
            <FastMarker markerRef={onRef}>
                {children(rest)}
            </FastMarker>
        );
    };
    return Marker;
};

/** @param {CanvasRenderingContext2D} ctx */
const draw_path = (ctx, { top, left, paths }) => {
    ctx.save();
    ctx.translate(left, top);

    paths.forEach(({ points, fill, stroke }) => {
        if (fill) { ctx.fillStyle = fill; }
        if (stroke) { ctx.strokeStyle = stroke; }
        ctx.beginPath();
        let prev_x, prev_y;
        for (let idx = 0; idx < points.length; idx++) {
            let x, y, cx1, cx2, cy1, cy2;
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
            }
            prev_x = x;
            prev_y = y;
        }
        ctx.closePath();
        if (fill) { ctx.fill(); }
        if (stroke) { ctx.stroke(); }
    });

    ctx.restore();
};

const SpotMarker = RawMarkerMaker(({
    ctx: context,
    points: [st, ...ticks], // st = start_time tick
    contract_info: {
        contract_type,
        exit_tick_time,
        status,
        profit,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const colors = {
        open: '#2196F3',
        won : '#2D9F93',
        lost: '#EC3F3F',
    };
    let color = colors[status || 'open'];
    if (status === 'open' && profit && ticks.length >= 2) {
        color = colors[profit > 0 ? 'won' : 'lost'];
    }
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    if (ticks.length <= 1 && st.visible) {
        ctx.fillText('Start Time', st.left + 5, 21);
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(st.left, 0);
        ctx.lineTo(st.left, ctx.canvas.height);
        ctx.stroke();
    }
    if (!ticks.length) {
        ctx.restore();
        return;
    }
    const first = ticks[0];
    const last = ticks[ticks.length - 1];
    // horizontal dashed line
    if (st.visible || first.visible) {
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(st.left, first.top);
        ctx.lineTo(first.left, first.top);
        ctx.stroke();
    }
    // barrier solid line
    if (
        (first.visible && last.visible && last.left - first.left > 16) ||
        first.visible !== last.visible
    ) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(first.left, first.top);
        ctx.lineTo(last.left, first.top);
        ctx.stroke();
    }
    // entry spot
    if (first.visible) {
        ctx.beginPath();
        ctx.arc(first.left, first.top, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    // start-time marker
    if (st.visible) {
        draw_path(ctx, {
            top  : first.top - 8,
            left : st.left - 8,
            paths: ICONS[contract_type]
                .paths
                .map(({ points, fill, stroke }) => ({
                    points,
                    stroke,
                    fill: fill !== 'white' ? color : fill,
                })),
        });
    }
    // status marker
    if (
        last.visible &&
        last.left - first.left > 16 &&
        last.epoch * 1 === exit_tick_time * 1 &&
        status !== 'open'
    ) {
        draw_path(ctx, {
            top  : first.top - 8,
            left : last.left - 8,
            paths: ICONS[status.toUpperCase()].paths,
        });
    }
    ctx.restore();
});

export default {
    SpotMarker,
};
