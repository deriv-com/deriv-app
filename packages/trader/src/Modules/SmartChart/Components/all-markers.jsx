// Things to do before touching this file :P
// 1- Please read https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
// 2- Please read RawMarker.jsx in https://github.com/binary-com/SmartCharts
// 3- Please read contract-store.js & trade.jsx carefully
import React          from 'react';
import { FastMarker, RawMarker } from 'smartcharts-beta';
import * as ICONS from './icons';

const RawMarkerMaker = (draw_callback) => {
    const Marker = ({ epoch_array, price_array, ...rest }) => (
        <RawMarker
            epoch_array={epoch_array}
            price_array={price_array}
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
        sold: '#2196F3',
    };
    let color = colors[status || 'open'];
    if (status === 'open' && profit) {
        color = colors[profit > 0 ? 'won' : 'lost'];
    }
    return color;
}

const calc_scale = (zoom) => {
    return zoom ? Math.max(Math.min(Math.sqrt(zoom / 10), 1),  0.6) : 1;
};

/** @param {CanvasRenderingContext2D} ctx */
const draw_path = (ctx, { zoom, top, left, icon }) => {
    ctx.save();
    const scale = calc_scale(zoom);

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
    ctx.scale(1, 1);
    ctx.restore();
};

const render_label = ({ ctx, text, tick: { zoom, left, top } }) => {
    const scale = calc_scale(zoom);
    const size = Math.floor(scale * 3 + 7);
    ctx.font = `${size}px Roboto`;
    text.split(/\n/).forEach((line, idx) => {
        const w = Math.ceil(ctx.measureText(line).width);
        ctx.fillText(line, left - 5 - w , top + idx * size + 1);
    });
};

const TickContract = RawMarkerMaker(({
    ctx: context,
    points: [start, expiry, ...ticks],
    prices: [barrier], // TODO: support two barrier contracts
    is_last_contract,
    contract_info: {
        contract_type,
        exit_tick_time,
        status,
        profit,
        is_sold,
        is_expired,
        tick_stream,
        tick_count,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const color = get_color({
        status,
        profit: (tick_stream || []).length > 1 ? profit : null,
    });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const draw_start_line = is_last_contract && start.visible && !is_sold;

    if (draw_start_line) {
        const height = (ctx.canvas.height / window.devicePixelRatio);
        render_label({
            ctx,
            text: 'Start\nTime',
            tick: { ...start, top: height - 50 },
        });
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(start.left, 0);
        ctx.lineTo(start.left, ctx.canvas.height);
        ctx.stroke();
    }

    if (!ticks.length || !barrier) {
        ctx.restore();
        return;
    }
    const entry = ticks[0];
    const exit = ticks[ticks.length - 1];
    const scale = calc_scale(entry.zoom);

    // barrier line
    if (start.visible || entry.visible || exit.visible) {
        ctx.beginPath();
        ctx.setLineDash([1, 1]);
        ctx.moveTo(start.left, barrier);
        ctx.lineTo(entry.left, barrier);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(entry.left, barrier);
        ctx.lineTo(exit.left, barrier);
        ctx.stroke();
    }
    // ticks for last contract
    if (is_last_contract) {
        ticks
            .filter(tick => tick.visible)
            .forEach(tick => {
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(tick.left - 1, tick.top, 1 * scale, 0, Math.PI * 2);
                ctx.fill();
            });
        ctx.fillStyle = color;
    }
    // entry tick marker
    [entry, is_expired ? exit : null].forEach(tick => {
        if (tick && tick.visible) {
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(tick.left - 1, tick.top);
            ctx.lineTo(tick.left - 1, barrier);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(tick.left - 1, tick.top, 3 * scale, 0, Math.PI * 2);
            ctx.fill();

            if (tick === entry) {
                ctx.beginPath();
                ctx.fillStyle = 'white';
                ctx.arc(tick.left - 1, tick.top, 2 * scale, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = color;
            }
        }
    });
    // count down
    if (start.visible && !is_sold) {
        ctx.textAlign = 'center';
        const size = Math.floor(scale * 3 + 7);
        ctx.font = `${size}px Roboto`;
        ctx.fillText(
            `${ticks.length - 1}/${tick_count}`,
            start.left,
            barrier - 22 * scale,
        );
    }
    // start-time marker
    if (start.visible) {
        draw_path(ctx, {
            // top : entry.top !== barrier ? start.top : barrier,
            top : barrier - 9 * scale,
            left: start.left,
            zoom: start.zoom,
            // icon: ICONS[contract_type].with_color(color),
            icon: ICONS.START.with_color(color),
        });
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(start.left + 0.5, barrier - 11 * scale, 2.5 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = color;
    }
    // status marker
    if (exit.visible && is_sold) {
        draw_path(ctx, {
            top : barrier - 7 * scale,
            left: exit.left + 5 * scale,
            zoom: exit.zoom,
            // icon: ICONS[status.toUpperCase()],
            icon: ICONS.END.with_color(color),
        });
    }
    ctx.restore();
});

const NonTickContract = RawMarkerMaker(({
    ctx: context,
    points: [start, expiry, entry],
    is_last_contract,
    prices: [barrier], // TODO: support two barrier contracts
    contract_info: {
        contract_type,
        exit_tick_time,
        is_sold,
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

    const draw_start_line = is_last_contract && start.visible && !is_sold;
    if (draw_start_line) {
        render_label({
            ctx,
            text: 'Start\nTime',
            tick: { ...start, top: 100 },
        });
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(start.left, 0);
        ctx.lineTo(start.left, ctx.canvas.height);
        ctx.stroke();
    }
    // vertical line from date start to barrier
    if (!draw_start_line && barrier && entry && start.visible && barrier !== entry.top) {
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(start.left, barrier);
        ctx.lineTo(start.left, start.top);
        ctx.stroke();
    }

    // entry tick marker
    if (entry && entry.visible) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(entry.left - 1, barrier - 4);
        ctx.lineTo(entry.left - 1, barrier + 4);
        ctx.moveTo(entry.left, barrier - 4);
        ctx.lineTo(entry.left, barrier + 4);
        ctx.stroke();
    }

    // barrier line
    if ((start.visible || expiry.visible) && barrier) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(start.left, barrier);
        ctx.lineTo(expiry.left, barrier);
        ctx.stroke();
    }
    // start-time marker
    if (start.visible && entry && entry.top && barrier) {
        draw_path(ctx, {
            top : entry.top !== barrier ? start.top : barrier,
            left: start.left,
            zoom: start.zoom,
            icon: ICONS[contract_type].with_color(color),
        });
    }
    // status marker
    if (expiry.visible && is_sold) {
        draw_path(ctx, {
            top : barrier,
            left: expiry.left,
            zoom: expiry.zoom,
            icon: (ICONS[status.toUpperCase()] || ICONS.LOST),
        });
    }
    ctx.restore();
});

const DigitContract = RawMarkerMaker(({
    ctx: context,
    points: [start, ...ticks],
    is_last_contract,
    contract_info: {
        contract_type,
        status,
        profit,
        is_sold,
        barrier,
        tick_stream,
        tick_count,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const color = get_color({ status, profit: is_sold ? profit : null });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const draw_start_line = is_last_contract && start.visible && !is_sold;

    if (draw_start_line) {
        // let title = contract_type.replace('DIGIT', '').toLowerCase();
        // if (barrier) {
        //     title = `${title} ${barrier}`;
        // }
        // render_label({
        //     ctx,
        //     text: title,
        //     tick: { ...start, top: 100 },
        // });
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(start.left, 0);
        ctx.lineTo(start.left, ctx.canvas.height);
        ctx.stroke();
    }

    if (!ticks.length) {
        ctx.restore();
        return;
    }
    const entry = ticks[0];
    const expiry = ticks[ticks.length - 1];

    const scale = calc_scale(entry.zoom);
    // count down
    if (start.visible && start.top && !is_sold) {
        ctx.textAlign = 'center';
        const size = Math.floor(scale * 3 + 7);
        ctx.font = `${size}px Roboto`;
        ctx.fillText(
            `${ticks.length}/${tick_count}`,
            start.left,
            start.top - 22 * scale,
        );
    }
    // start-time marker
    if (start.visible) {
        draw_path(ctx, {
            // top : entry.top !== barrier ? start.top : barrier,
            top : start.top - 9 * scale,
            left: start.left,
            zoom: start.zoom,
            // icon: ICONS[contract_type].with_color(color),
            icon: ICONS.START.with_color(color),
        });
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(start.left + 0.5, start.top - 11 * scale, 2.5 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = color;
    }

    // remaining ticks
    ticks.forEach((tick, idx) => {
        if (!is_last_contract && tick !== expiry) {
            return;
        }
        const clr = tick !== expiry ? 'black' : color;
        ctx.beginPath();
        ctx.fillStyle = clr;
        ctx.arc(tick.left, tick.top, 6 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(tick.left, tick.top, 5 * scale, 0, Math.PI * 2);
        ctx.fill();

        const last_tick = tick_stream[idx];
        const last_digit = last_tick.tick_display_value.slice(-1);
        ctx.fillStyle = clr;
        ctx.textAlign = 'center';
        ctx.font = `${10 * scale}px Roboto`;
        ctx.fillText(last_digit, tick.left, tick.top + 1 * scale);
    });
    ctx.fillStyle = color;
    // date expiry marker
    // status marker
    if (expiry.visible && is_sold) {
        draw_path(ctx, {
            top : expiry.top - 14 * scale,
            left: expiry.left + 5 * scale,
            zoom: expiry.zoom,
            // icon: ICONS[status.toUpperCase()],
            icon: ICONS.END.with_color(color),
        });
    }
    ctx.restore();
});

export default {
    TickContract,
    NonTickContract,
    DigitContract,
};
