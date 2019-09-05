// Things to do before touching this file :P
// 1- Please read https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
// 2- Please read RawMarker.jsx in https://github.com/binary-com/SmartCharts
// 3- Please read contract-store.js & trade.jsx carefully
import React         from 'react';
import { RawMarker } from 'Modules/SmartChart';
import * as ICONS    from './icons';

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

function get_color({ status, profit, is_dark_theme }) {
    const colors = is_dark_theme ? {
        open: '#1C5AE3',
        won : '#00A79E',
        lost: '#CC2E3D',
        sold: '#1C5AE3',
        fg: '#FFFFFF',
        bg: '#10131F',
    } : {
        open: '#1C5AE3',
        won : '#4BB4B3',
        lost: '#EC3F3F',
        sold: '#1C5AE3',
        fg: '#333333',
        bg: '#FFFFFF',
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
    points: [start, ...ticks],
    prices: [barrier], // TODO: support two barrier contracts
    is_last_contract,
    is_dark_theme,
    contract_info: {
        // contract_type,
        // exit_tick_time,
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
        is_dark_theme,
        status,
        profit: (tick_stream || []).length > 1 ? profit : null,
    });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const draw_start_line = is_last_contract && start.visible && !is_sold;
    const scale = calc_scale(start.zoom);

    if (draw_start_line) {
        const height = (ctx.canvas.height / window.devicePixelRatio);
        render_label({
            ctx,
            text: 'Start\nTime',
            tick: { zom: start.zoom, left: start.left - 1 * scale,  top: height - 50 },
        });
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(start.left - 1 * scale, 0);
        if (ticks.length && barrier) {
            ctx.lineTo(start.left - 1 * scale, barrier - 30 * scale);
            ctx.moveTo(start.left - 1 * scale, barrier + 4 * scale);
        }
        ctx.lineTo(start.left - 1 * scale, ctx.canvas.height);
        ctx.stroke();
    }

    if (!ticks.length || !barrier) {
        ctx.restore();
        return;
    }
    const entry = ticks[0];
    const exit = ticks[ticks.length - 1];

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
                ctx.fillStyle = tick === exit ?
                    color : get_color({ status: 'fg', is_dark_theme });
                ctx.beginPath();
                ctx.arc(tick.left - 1 * scale, tick.top, 1.5 * scale, 0, Math.PI * 2);
                ctx.fill();
            });
        ctx.fillStyle = color;
    }
    // entry & expiry markers
    [entry, is_expired ? exit : null].forEach(tick => {
        if (tick && tick.visible) {
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(tick.left - 1 * scale, tick.top);
            ctx.lineTo(tick.left - 1 * scale, barrier);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(tick.left - 1 * scale, tick.top, 3 * scale, 0, Math.PI * 2);
            ctx.fill();

            if (tick === entry) {
                ctx.beginPath();
                ctx.fillStyle = get_color({status: 'bg', is_dark_theme});
                ctx.arc(tick.left - 1 * scale, tick.top, 2 * scale, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = color;
            }
        }
    });
    // count down
    if (start.visible && !is_sold) {
        ctx.textAlign = 'center';
        const size = Math.floor(scale * 3 + 7);
        ctx.font = `bold ${size}px Roboto`;
        ctx.fillText(
            `${ticks.length - 1}/${tick_count}`,
            start.left,
            barrier - 23 * scale,
        );
    }
    // start-time marker
    if (start.visible) {
        draw_path(ctx, {
            top : barrier - 9 * scale,
            left: start.left - 1 * scale,
            zoom: start.zoom,
            icon: ICONS.START.with_color(color),
        });
    }
    // status marker
    if (exit.visible && is_sold) {
        draw_path(ctx, {
            top : barrier - 9 * scale,
            left: exit.left + 8 * scale,
            zoom: exit.zoom,
            icon: ICONS.END.with_color(color),
        });
    }
    ctx.restore();
});

const NonTickContract = RawMarkerMaker(({
    ctx: context,
    points: [start, expiry, entry, exit],
    is_last_contract,
    prices: [barrier], // TODO: support two barrier contracts
    is_dark_theme,
    contract_info: {
        // contract_type,
        // exit_tick_time,
        // is_expired,
        is_sold,
        status,
        profit,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const color = get_color({ status, profit, is_dark_theme });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const draw_start_line = is_last_contract && start.visible && !is_sold;
    const scale = calc_scale(start.zoom);

    if (draw_start_line) {
        const height = (ctx.canvas.height / window.devicePixelRatio);
        render_label({
            ctx,
            text: 'Start\nTime',
            tick: { zom: start.zoom, left: start.left - 1 * scale,  top: height - 50 },
        });
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(start.left - 1 * scale, 0);
        if (barrier) {
            ctx.lineTo(start.left - 1 * scale, barrier - 20 * scale);
            ctx.moveTo(start.left - 1 * scale, barrier + 4 * scale);
        }
        ctx.lineTo(start.left - 1 * scale, ctx.canvas.height);
        ctx.stroke();
    }
    // barrier line
    if (barrier && (
        start.visible
        || expiry.visible
        || Math.sign(start.left) !== Math.sign(expiry.left)
    )) {
        ctx.beginPath();
        ctx.setLineDash([1, 1]);
        ctx.moveTo(start.left, barrier);
        ctx.lineTo(entry.left, barrier);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(entry.left, barrier);
        ctx.lineTo(expiry.left, barrier);
        ctx.stroke();
    }

    // entry & expiry tick markers
    [entry, exit].forEach(tick => {
        if (tick && tick.visible) {
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(tick.left - 1 * scale, tick.top);
            ctx.lineTo(tick.left - 1 * scale, barrier);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(tick.left - 1 * scale, tick.top, 3 * scale, 0, Math.PI * 2);
            ctx.fill();

            if (tick === entry) {
                ctx.beginPath();
                ctx.fillStyle = get_color({status: 'bg', is_dark_theme});
                ctx.arc(tick.left - 1 * scale, tick.top, 2 * scale, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = color;
            }
        }
    });

    // start-time marker
    if (start.visible && barrier) {
        draw_path(ctx, {
            top : barrier - 9 * scale,
            left: start.left - 1 * scale,
            zoom: start.zoom,
            icon: ICONS.START.with_color(color),
        });
    }
    // status marker
    if (expiry.visible) {
        draw_path(ctx, {
            top : barrier - 9 * scale,
            left: expiry.left + 8 * scale,
            zoom: expiry.zoom,
            // icon: ICONS[status.toUpperCase()],
            icon: ICONS.END.with_color(color),
        });
    }
    ctx.restore();
});

const DigitContract = RawMarkerMaker(({
    ctx: context,
    points: [start, ...ticks],
    is_last_contract,
    is_dark_theme,
    contract_info: {
        // contract_type,
        status,
        profit,
        is_sold,
        // barrier,
        tick_stream,
        tick_count,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const color = get_color({
        is_dark_theme,
        status,
        profit: is_sold ? profit : null,
    });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const draw_start_line = is_last_contract && start.visible && !is_sold;
    const scale = calc_scale(start.zoom);

    if (draw_start_line) {
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(start.left - 1 * scale, 0);
        if (ticks.length) {
            ctx.lineTo(start.left - 1 * scale, start.top - 30 * scale);
            ctx.moveTo(start.left - 1 * scale, start.top + 4 * scale);
        }
        ctx.lineTo(start.left - 1 * scale, ctx.canvas.height);
        ctx.stroke();
    }

    if (!ticks.length) {
        ctx.restore();
        return;
    }
    const expiry = ticks[ticks.length - 1];

    // remaining ticks
    ticks.forEach((tick, idx) => {
        if (is_sold && tick !== expiry) { return; }
        if (!tick.visible) { return; }
        const clr = tick !== expiry ?
            get_color({ status: 'fg', is_dark_theme }) : color;
        ctx.beginPath();
        ctx.fillStyle = clr;
        ctx.arc(tick.left, tick.top, 6 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = get_color({status: 'bg', is_dark_theme});
        ctx.arc(tick.left, tick.top, 5 * scale, 0, Math.PI * 2);
        ctx.fill();

        const last_tick = tick_stream[idx];
        const last_digit = last_tick.tick_display_value.slice(-1);
        ctx.fillStyle = clr;
        ctx.textAlign = 'center';
        ctx.font = `${10 * scale}px Roboto`;
        ctx.fillText(last_digit, tick.left, tick.top + 1 * scale);
    });
    // count down
    if (start.visible && start.top && !is_sold) {
        ctx.textAlign = 'center';
        const size = Math.floor(scale * 3 + 7);
        ctx.font = `bold ${size}px Roboto`;
        ctx.fillText(
            `${ticks.length}/${tick_count}`,
            start.left - 1 * scale,
            start.top - 23 * scale,
        );
    }
    // start-time marker
    if (start.visible) {
        draw_path(ctx, {
            top : start.top - 9 * scale,
            left: start.left - 1 * scale,
            zoom: start.zoom,
            icon: ICONS.START.with_color(color),
        });
    }
    // status marker
    if (expiry.visible && is_sold) {
        ctx.fillStyle = color;
        draw_path(ctx, {
            top : expiry.top - 16 * scale,
            left: expiry.left + 8 * scale,
            zoom: expiry.zoom,
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
