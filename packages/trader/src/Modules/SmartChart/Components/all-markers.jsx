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

function get_color({ status, profit }) {
    const colors = {
        open: '#2196F3',
        won : '#2D9F93',
        lost: '#EC3F3F',
    };
    let color = colors[status || 'open'];
    if (status === 'open' && profit) {
        color = colors[profit > 0 ? 'won' : 'lost'];
    }
    return color;
}

/** @param {CanvasRenderingContext2D} ctx */
const draw_path = (ctx, { zoom, top, left, icon }) => {
    ctx.save();
    const scale = zoom ? Math.max(Math.min(zoom / 8, 1),  0.5) : 1;

    ctx.translate(
        left - icon.width * scale / 2,
        top - icon.height * scale / 2 ,
    );

    ctx.scale(scale, scale);

    icon.paths.forEach(({ points, fill, stroke }) => {
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

const render_label = ({ ctx, text, tick: { zoom, left, top } }) => {
    const scale = zoom ? Math.max(Math.min(zoom / 8, 1),  0.5) : 1;
    const size = Math.floor(scale * 3 + 7);
    ctx.font = `${size}px Roboto`;
    text.split(/\n/).forEach((line, idx) => {
        const w = Math.ceil(ctx.measureText(line).width);
        ctx.fillText(line, left - 5 - w , top + idx * size + 1);
    });
};

const TickContract = RawMarkerMaker(({
    ctx: context,
    points: [st, ...ticks], // st = start_time tick
    is_last_contract,
    contract_info: {
        contract_type,
        exit_tick_time,
        status,
        profit,
        tick_stream,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const tick_count = tick_stream ? tick_stream.length : 0;
    const color = get_color({ status, profit: tick_count > 1 ? profit : null });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    if (is_last_contract && st.visible) {
        render_label({
            ctx,
            text: 'Start\nTime',
            tick: {
                ...st,
                top: 100,
            },
        });
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
        (first.visible && last.visible) ||
        first.visible !== last.visible
    ) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(first.left, first.top);
        ctx.lineTo(last.left, first.top);
        ctx.stroke();
    }
    // entry spot
    if (first.zoom >= 10 && first.visible) {
        ctx.beginPath();
        ctx.arc(first.left, first.top, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    // start-time marker
    if (st.visible) {
        draw_path(ctx, {
            top : first.top,
            left: st.left,
            zoom: st.zoom,
            icon: (ICONS[contract_type] || ICONS.CALL).with_color(color),
        });
    }
    // status marker
    if (
        last.visible &&
        last.epoch * 1 === exit_tick_time * 1 &&
        status !== 'open'
    ) {
        draw_path(ctx, {
            top : first.top,
            left: last.left,
            zoom: last.zoom,
            icon: (ICONS[status.toUpperCase()] || ICONS.LOST),
        });
    }
    ctx.restore();
});

const NonTickContract = RawMarkerMaker(({
    ctx: context,
    points: [start, expiry, entry], // st = start_time tick
    is_last_contract,
    contract_info: {
        contract_type,
        exit_tick_time,
        status,
        profit,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const color = get_color({ status, profit });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    if (is_last_contract && start.visible) {
        render_label({
            ctx,
            text: 'Start\nTime',
            tick: {
                ...start,
                top: 100,
            },
        });
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(start.left, 0);
        ctx.lineTo(start.left, ctx.canvas.height);
        ctx.stroke();
    }
    // barrier line
    if ((start.visible || expiry.visible) && entry) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(start.left, entry.top);
        ctx.lineTo(expiry.left, entry.top);
        ctx.stroke();
    }
    // start-time marker
    if (start.visible && entry) {
        draw_path(ctx, {
            top : entry.top,
            left: start.left,
            zoom: start.zoom,
            icon: ICONS[contract_type].with_color(color),
        });
    }
    // status marker
    if (
        expiry.visible &&
        expiry.epoch * 1 === exit_tick_time * 1 &&
        status !== 'open'
    ) {
        draw_path(ctx, {
            top : entry.top,
            left: expiry.left,
            zoom: expiry.zoom,
            icon: ICONS[status.toUpperCase()],
        });
    }
    ctx.restore();
});

export default {
    TickContract,
    NonTickContract,
};
