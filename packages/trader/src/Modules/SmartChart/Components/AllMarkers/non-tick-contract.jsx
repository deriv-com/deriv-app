import CurrencyUtils        from '@deriv/shared/utils/currency';
import RawMarkerMaker       from './Helpers/raw-marker-maker.jsx';
import Svg2Canvas           from './Helpers/svg2canvas';
import { CURRENCY_SYMBOLS } from './Constants/currency_symbols';
import { get_color }        from './Helpers/colors';
import { shadowed_text }    from './Helpers/text';
import {
    draw_vertical_labelled_line,
    draw_barrier_line_to_icon,
    draw_barrier_line,
    draw_line,
}                           from './Helpers/lines';
import { draw_shade }       from './Helpers/shade';
import {
    calc_scale,
    calc_opacity,
}                           from './Helpers/calculations';
import * as ICONS           from '../icons';

const NonTickContract = RawMarkerMaker(({
    ctx: context,
    points: [start, expiry, entry, exit, current_time, reset_time],
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

    const foreground_color = `${get_color({ is_dark_theme, status: 'fg' })}${is_last_contract ? '' : '66'}`;
    const background_color = get_color({ is_dark_theme, status: 'bg' });
    const status_color = get_color({ status, is_dark_theme, profit });
    const status_color_with_opacity = `${status_color}${is_last_contract ? '' : '66'}`;

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

    const has_reset_time = reset_time && reset_time.epoch;
    const should_draw_vertical_line = is_last_contract && !is_sold;
    if (should_draw_vertical_line) {
        if (start.visible) {
            ctx.fillStyle = foreground_color;
            draw_vertical_labelled_line({
                ctx,
                text    : 'Buy\nTime',
                position: {
                    zoom: start.zoom,
                    left: start.left,
                    top : canvas_height - 50,
                },
                line_style: 'dashed',
                icon      : ICONS.BUY_SELL.with_color_on_specific_paths({
                    0: { fill: background_color },
                    1: { fill: foreground_color },
                }),
            });
        }

        if (has_reset_time) {
            ctx.fillStyle = foreground_color;
            draw_vertical_labelled_line({
                ctx,
                text    : 'Reset\nTime',
                position: {
                    zoom: reset_time.zoom,
                    left: reset_time.left,
                    top : canvas_height - 50,
                },
                line_style: 'dashed',
                icon      : ICONS.RESET.with_color(foreground_color, background_color),
            });
        }

        if (expiry.visible) {
            ctx.strokeStyle = status_color_with_opacity;
            draw_vertical_labelled_line({
                ctx,
                text    : 'Sell\nTime',
                position: {
                    zoom: expiry.zoom,
                    left: expiry.left,
                    top : canvas_height - 50,
                },
                line_style: 'solid',
                icon      : ICONS.BUY_SELL.with_color_on_specific_paths({
                    0: { fill: background_color },
                    1: { fill: status_color_with_opacity },
                }),
            });
        }
    }

    const is_reset_barrier_expired = has_reset_time && entry_tick_top !== barrier;

    // barrier line
    if ((barrier && entry) && (
        start.visible
        || expiry.visible
        || Math.sign(start.left) !== Math.sign(expiry.left)
    )) {
        ctx.fillStyle = background_color;
        if (is_reset_barrier_expired) {
            if (is_sold) {
                draw_line({
                    ctx,
                    start     : { left: reset_time.left, top: entry_tick_top },
                    end       : { left: reset_time.left, top: barrier },
                    line_style: 'dashed',
                });
            }

            ctx.strokeStyle = foreground_color;
            draw_barrier_line({ ctx, start, exit: reset_time, barrier: entry_tick_top, line_style: 'dashed' });
            ctx.strokeStyle = status_color_with_opacity;
            draw_barrier_line({ ctx, start: reset_time, exit: expiry, barrier });
            draw_shade({ ctx, is_sold, start: reset_time, end: current_time, color: status_color });
        } else {
            ctx.strokeStyle = foreground_color;
            draw_barrier_line({ ctx, start, exit: entry, barrier, line_style: 'dashed' });
            ctx.strokeStyle = status_color_with_opacity;
            draw_barrier_line({ ctx, start: entry, exit: expiry, barrier, line_style: 'solid' });
            draw_shade({ ctx, is_sold, start: entry, end: current_time, color: status_color });
        }
    }

    // entry markers
    if (granularity === 0 && entry && entry.visible) {
        Svg2Canvas.render({
            ctx,
            position: entry,
            icon    : ICONS.ENTRY_SPOT.with_color_on_specific_paths({
                0: { fill: background_color },
                1: { fill: foreground_color },
            }),
        });
    }

    // show the profit
    if (show_profit) {
        const symbol = CURRENCY_SYMBOLS[currency] || '';
        const decimal_places = CurrencyUtils.getDecimalPlaces(currency);
        const sign = profit < 0 ? '-' : profit > 0 ? '+' : ' '; // eslint-disable-line
        const text = `${sign}${symbol}${Math.abs(profit).toFixed(decimal_places)}`;
        ctx.fillStyle = status_color_with_opacity;
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
            1: { fill: status_color_with_opacity },
        });

        ctx.strokeStyle = status_color_with_opacity;
        draw_barrier_line_to_icon({ ctx, exit: expiry, barrier, icon });
    }
    ctx.restore();
});

export default NonTickContract;
