import CurrencyUtils     from '@deriv/shared/utils/currency';
import RawMarkerMaker    from './Helpers/raw-marker-maker.jsx';
import Svg2Canvas        from './Helpers/svg2canvas';
import { CURRENCY_SYMBOLS }  from './Constants/currency_symbols';
import { get_color }     from './Helpers/colors';
import { shadowed_text } from './Helpers/text';
import {
    draw_vertical_labelled_line,
    draw_barrier_line_to_icon,
    draw_barrier_line,
    draw_line,
}                        from './Helpers/lines';
import {
    calc_scale,
    calc_opacity,
}                        from './Helpers/calculations';
import * as ICONS        from '../icons';

const NonTickContract = RawMarkerMaker(({
    ctx: context,
    points: [start, expiry, entry, reset_time, exit],
    is_last_contract,
    prices: [barrier, entry_tick_top, exit_tick_top], // TODO: support two barrier contracts
    is_dark_theme,
    granularity,
    currency,
    contract_info: {
        is_sold,
        status,
        profit,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    // the y value reported for candles is not accurate
    if (granularity !== 0) {
        if (entry) { entry.top = entry_tick_top; }
        if (exit) { exit.top = exit_tick_top; }
    }

    const foreground_color = get_color({ is_dark_theme, status: 'fg' });
    const background_color = get_color({ is_dark_theme, status: 'bg' });
    const scale = calc_scale(start.zoom);
    const canvas_height = (ctx.canvas.height / window.devicePixelRatio);

    ctx.save();
    ctx.strokeStyle = foreground_color;
    ctx.fillStyle = background_color;

    const show_profit = is_last_contract && !is_sold && profit && start.visible && barrier;
    const opacity = is_sold ? calc_opacity(start.left, expiry.left) : '';

    if (barrier) {
        barrier = Math.min(Math.max(barrier, 2), canvas_height - 32); // eslint-disable-line
    }

    const draw_start_line = is_last_contract && start.visible && !is_sold;
    if (draw_start_line) {
        ctx.fillStyle = foreground_color;
        draw_vertical_labelled_line({
            ctx,
            text    : 'Buy\nTime',
            position: {
                zoom: start.zoom,
                left: start.left,
                top : canvas_height - 50,
            },
            icon: ICONS.BUY_SELL.with_color_on_specific_paths({
                0: { fill: background_color },
                1: { fill: foreground_color },
            }),
        });
    }

    const has_reset_time = reset_time && reset_time.epoch;
    if (has_reset_time && !is_sold) {
        ctx.fillStyle = foreground_color;
        draw_vertical_labelled_line({
            ctx,
            text    : 'Reset\nTime',
            position: {
                zoom: reset_time.zoom,
                left: reset_time.left,
                top : canvas_height - 50,
            },
            icon: ICONS.RESET.with_color(foreground_color, background_color),
        });
    }

    const color_based_on_status = get_color({ status, is_dark_theme, profit: is_sold ? profit : null });
    const is_reset_barrier_expired = has_reset_time && entry_tick_top !== barrier;

    // barrier line
    if ((barrier && entry) && (
        start.visible
        || expiry.visible
        || Math.sign(start.left) !== Math.sign(expiry.left)
    )) {
        ctx.fillStyle = background_color;
        ctx.strokeStyle = is_reset_barrier_expired ? foreground_color : color_based_on_status;
        
        draw_barrier_line({
            ctx,
            start,
            exit      : entry,
            barrier   : is_reset_barrier_expired ? entry_tick_top : barrier,
            line_style: 'dashed',
        });
        draw_barrier_line({
            ctx,
            start,
            exit      : is_reset_barrier_expired ? reset_time : expiry,
            barrier   : is_reset_barrier_expired ? entry_tick_top : barrier,
            line_style: is_reset_barrier_expired ? 'dashed' : 'solid',
        });

        if (is_reset_barrier_expired) {
            draw_line({
                ctx,
                start     : { left: reset_time.left, top: entry_tick_top },
                end       : { left: reset_time.left, top: barrier },
                line_style: 'dashed',
            });

            ctx.strokeStyle = color_based_on_status;
            draw_barrier_line({
                ctx,
                start: reset_time,
                exit : expiry,
                barrier,
            });
        }
    }

    // entry markers
    if (granularity === 0 && entry && entry.visible) {
        Svg2Canvas.render({
            ctx,
            position: entry,
            icon    : ICONS.ENTRY_SPOT.with_color_on_specific_paths({
                0: { fill: background_color },
                1: { fill: is_reset_barrier_expired ? foreground_color : color_based_on_status },
            }),
        });
    }

    // start-time marker
    if (start.visible && barrier) {
        // Draw dot at end of barrier
        ctx.beginPath();
        ctx.arc(start.left - 1 * scale, barrier.top - 9 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.fill();
    }
    // show the profit
    if (show_profit) {
        const symbol = CURRENCY_SYMBOLS[currency] || '';
        const decimal_places = CurrencyUtils.getDecimalPlaces(currency);
        const sign = profit < 0 ? '-' : profit > 0 ? '+' : ' '; // eslint-disable-line
        const text = `${sign}${symbol}${Math.abs(profit).toFixed(decimal_places)}`;
        shadowed_text({
            ctx,
            scale,
            text,
            is_dark_theme,
            left: start.left,
            top : barrier - 28 * scale,
        });
    }
    // status marker
    if (expiry.visible && is_sold) {
        // Draw a line from barrier to icon.
        const icon = ICONS.END.with_color_on_specific_paths({
            0: { fill: background_color + (is_sold ? opacity : '') },
            1: { fill: color_based_on_status },
        });

        ctx.strokeStyle = color_based_on_status;
        draw_barrier_line_to_icon({ ctx, exit: expiry, barrier, icon });
    }
    ctx.restore();
});

export default NonTickContract;
