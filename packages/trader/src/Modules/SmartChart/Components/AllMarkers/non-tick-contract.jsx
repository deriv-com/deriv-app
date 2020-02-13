import CurrencyUtils from '@deriv/shared/utils/currency';
import { localize } from '@deriv/translations';
import RawMarkerMaker from './Helpers/raw-marker-maker.jsx';
import { getColor, getHexOpacity } from './Helpers/colors';
import BasicCanvasElements from './Helpers/canvas';
import { getScale, getChartOpacity } from './Helpers/calculations';
import * as ICONS from '../icons';

const NonTickContract = RawMarkerMaker(
    ({
        ctx: context,
        points: [start, expiry, entry, exit, current_spot, reset_time],
        is_last_contract,
        prices: [barrier, entry_tick_top, exit_tick_top], // TODO: support two barrier contracts
        is_dark_theme,
        granularity,
        currency,
        contract_info: { is_sold, status, profit },
    }) => {
        const CURRENCY_SYMBOLS = {
            AUD: '\u0041\u0024',
            EUR: '\u20AC',
            GBP: '\u00A3',
            JPY: '\u00A5',
            USD: '\u0024',
            BTC: '\u0042',
            BCH: '\ue901',
            ETH: '\u0045',
            ETC: '\ue900',
            LTC: '\u004c',
            UST: '\ue903',
        };

        /** @type {CanvasRenderingContext2D} */
        const ctx = context;

        // the y value reported for candles is not accurate
        if (granularity !== 0) {
            if (entry) {
                entry.top = entry_tick_top;
            }
            if (exit) {
                exit.top = exit_tick_top;
            }
        }

        const foreground_color = getColor({ is_dark_theme, status: 'fg' }).concat(
            is_last_contract ? '' : getHexOpacity(0.4)
        );
        const background_color = getColor({ is_dark_theme, status: 'bg' });
        const status_color = getColor({ status, is_dark_theme, profit });
        const status_color_with_opacity = status_color.concat(is_last_contract ? '' : getHexOpacity(0.4));

        const scale = getScale(start.zoom);
        const canvas_height = ctx.canvas.height / window.devicePixelRatio;

        ctx.save();
        ctx.strokeStyle = foreground_color;
        ctx.fillStyle = background_color;

        const show_profit = is_last_contract && !is_sold && profit && start.visible && barrier;
        const opacity = is_sold ? getChartOpacity(start.left, expiry.left) : '';

        if (barrier) {
            barrier = Math.min(Math.max(barrier, 2), canvas_height - 32); // eslint-disable-line
        }

        const has_reset_time = reset_time && reset_time.epoch;
        const should_draw_vertical_line = is_last_contract && !is_sold;
        if (should_draw_vertical_line) {
            if (start.visible) {
                ctx.fillStyle = foreground_color;
                BasicCanvasElements.VerticalLabelledLine(
                    ctx,
                    [start.left, canvas_height - 50],
                    start.zoom,
                    localize('Buy Time'),
                    ICONS.BUY_SELL.withColorOnSpecificPaths({
                        0: { fill: background_color },
                        1: { fill: foreground_color },
                    }),
                    'dashed'
                );
            }

            if (has_reset_time) {
                ctx.fillStyle = foreground_color;
                BasicCanvasElements.VerticalLabelledLine(
                    ctx,
                    [reset_time.left, canvas_height - 50],
                    reset_time.zoom,
                    localize('Reset Time'),
                    ICONS.RESET.withColor(foreground_color, background_color),
                    'dashed'
                );
            }

            if (expiry.visible) {
                ctx.strokeStyle = status_color_with_opacity;
                BasicCanvasElements.VerticalLabelledLine(
                    ctx,
                    [expiry.left, canvas_height - 50],
                    expiry.zoom,
                    localize('Sell Time'),
                    ICONS.BUY_SELL.withColorOnSpecificPaths({
                        0: { fill: background_color },
                        1: { fill: status_color_with_opacity },
                    }),
                    'solid'
                );
            }
        }

        const is_reset_barrier_expired = has_reset_time && entry_tick_top !== barrier;

        // barrier line
        if (barrier && entry && (start.visible || expiry.visible || Math.sign(start.left) !== Math.sign(expiry.left))) {
            ctx.fillStyle = background_color;
            if (is_reset_barrier_expired) {
                BasicCanvasElements.Line(ctx, [reset_time.left, entry_tick_top, reset_time.left, barrier], 'dashed');

                ctx.strokeStyle = foreground_color;
                BasicCanvasElements.BarrierLine(
                    ctx,
                    [start.left, entry_tick_top, reset_time.left, entry_tick_top],
                    'dashed'
                );
                ctx.strokeStyle = status_color_with_opacity;
                BasicCanvasElements.BarrierLine(ctx, [reset_time.left, barrier, expiry.left, barrier], 'solid');
            } else {
                ctx.strokeStyle = foreground_color;
                BasicCanvasElements.BarrierLine(ctx, [start.left, barrier, entry.left, barrier], 'dashed');
                ctx.strokeStyle = status_color_with_opacity;
                BasicCanvasElements.BarrierLine(ctx, [entry.left, barrier, expiry.left, barrier], 'solid');
            }
        }

        if (is_last_contract && !is_sold) {
            const points = is_reset_barrier_expired
                ? [reset_time.left, reset_time.top, current_spot.left, current_spot.top]
                : [entry.left, entry.top, current_spot.left, current_spot.top];

            BasicCanvasElements.Shade(ctx, points, status_color);
        }

        // entry markers
        if (granularity === 0 && entry && entry.visible) {
            BasicCanvasElements.SVG(
                ctx,
                ICONS.ENTRY_SPOT.withColorOnSpecificPaths({
                    0: { fill: background_color },
                    1: { fill: foreground_color },
                }),
                [entry.left, entry.top],
                entry.zoom
            );
        }

        // show the profit
        if (show_profit) {
            const symbol = CURRENCY_SYMBOLS[currency] || '';
            const decimal_places = CurrencyUtils.getDecimalPlaces(currency);
            const sign = profit < 0 ? '-' : profit > 0 ? '+' : ' '; // eslint-disable-line
            const text = `${sign}${symbol}${Math.abs(profit).toFixed(decimal_places)}`;
            ctx.fillStyle = status_color_with_opacity;

            BasicCanvasElements.Text(ctx, [start.left, barrier - 28 * scale], text, scale);
        }
        // status marker
        if (expiry.visible && is_sold) {
            // Draw a line from barrier to icon.
            const icon = ICONS.END.withColorOnSpecificPaths({
                0: { fill: background_color + (is_sold ? opacity : '') },
                1: { fill: status_color_with_opacity },
            });

            ctx.strokeStyle = status_color_with_opacity;
            BasicCanvasElements.Line(ctx, [exit.left, barrier, exit.left, exit.top], 'dashed');
            BasicCanvasElements.SVG(ctx, icon, [exit.left, exit.top], exit.zoom);
        }

        ctx.restore();
    }
);

export default NonTickContract;
