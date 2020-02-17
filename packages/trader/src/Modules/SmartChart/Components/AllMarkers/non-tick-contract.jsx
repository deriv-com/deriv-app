import CurrencyUtils from '@deriv/shared/utils/currency';
import { localize } from '@deriv/translations';
import RawMarkerMaker from './Helpers/raw-marker-maker.jsx';
import { getColor, getOpacity } from './Helpers/colors';
import { calculateScale } from './Helpers/calculations';
import Canvas from './Helpers/canvas';
import * as ICONS from '../icons';

const NonTickContract = RawMarkerMaker(
    ({
        ctx,
        points: [start, expiry, entry, exit, current_spot, reset_time],
        is_last_contract,
        prices: [barrier, entry_tick_top, exit_tick_top], // TODO: support two barrier contracts
        is_dark_theme,
        granularity,
        currency,
        contract_info: { is_sold, status, profit },
    }) => {
        ctx.save();

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

        // the y value reported for candles is not accurate
        if (granularity !== 0) {
            if (entry) {
                entry.top = entry_tick_top;
            }
            if (exit) {
                exit.top = exit_tick_top;
            }
        }

        const opacity = getOpacity(is_last_contract, is_sold, [start.left, expiry.left]);
        const scale = calculateScale(start.zoom);
        const canvas_height = ctx.canvas.height / window.devicePixelRatio;

        const foreground_color = getColor('fg', is_dark_theme).concat(opacity);
        const background_color = getColor('bg', is_dark_theme).concat(opacity);
        const status_color = getColor(status, is_dark_theme, profit);
        const status_color_with_opacity = status_color.concat(opacity);

        const show_profit = is_last_contract && !is_sold && profit && start.visible && barrier;

        if (barrier) {
            barrier = Math.min(Math.max(barrier, 2), canvas_height - 32); // eslint-disable-line
        }

        const has_reset_time = reset_time && reset_time.epoch;
        const should_draw_vertical_line = is_last_contract && !is_sold;
        if (should_draw_vertical_line) {
            if (start.visible) {
                Canvas.drawVerticalLabelledLine(0, [
                    ctx,
                    [start.left, canvas_height - 50],
                    start.zoom,
                    localize('Buy Time'),
                    ICONS.BUY_SELL.withColorOnSpecificPaths({
                        0: { fill: background_color },
                        1: { fill: foreground_color },
                    }),
                    'dashed',
                    foreground_color,
                    foreground_color,
                ]);
            }

            if (has_reset_time) {
                Canvas.drawVerticalLabelledLine(0, [
                    ctx,
                    [reset_time.left, canvas_height - 50],
                    reset_time.zoom,
                    localize('Reset Time'),
                    ICONS.RESET.withColor(foreground_color, background_color),
                    'dashed',
                    foreground_color,
                    foreground_color,
                ]);
            }

            if (expiry.visible) {
                Canvas.drawVerticalLabelledLine(0, [
                    ctx,
                    [expiry.left, canvas_height - 50],
                    expiry.zoom,
                    localize('Sell Time'),
                    ICONS.BUY_SELL.withColorOnSpecificPaths({
                        0: { fill: background_color },
                        1: { fill: status_color_with_opacity },
                    }),
                    'solid',
                    status_color_with_opacity,
                    status_color_with_opacity,
                ]);
            }
        }

        const is_reset_barrier_expired = has_reset_time && entry_tick_top !== barrier;

        // barrier line
        if (barrier && entry && (start.visible || expiry.visible || Math.sign(start.left) !== Math.sign(expiry.left))) {
            if (is_reset_barrier_expired) {
                if (!is_last_contract) {
                    Canvas.drawLine(0, [
                        ctx,
                        [reset_time.left, entry_tick_top, reset_time.left, barrier],
                        'dashed',
                        foreground_color,
                    ]);
                }
                Canvas.drawBarrierLine(0, [
                    ctx,
                    [start.left, entry_tick_top, reset_time.left, entry_tick_top],
                    'dashed',
                    foreground_color,
                    background_color,
                ]);
                Canvas.drawBarrierLine(0, [
                    ctx,
                    [reset_time.left, barrier, expiry.left, barrier],
                    'solid',
                    status_color_with_opacity,
                    background_color,
                ]);
            } else {
                Canvas.drawBarrierLine(0, [
                    ctx,
                    [start.left, barrier, entry.left, barrier],
                    'dashed',
                    foreground_color,
                    background_color,
                ]);
                Canvas.drawBarrierLine(0, [
                    ctx,
                    [entry.left, barrier, expiry.left, barrier],
                    'solid',
                    status_color_with_opacity,
                    background_color,
                ]);
            }
        }

        if (is_last_contract && !is_sold) {
            const points = is_reset_barrier_expired
                ? [reset_time.left, reset_time.top, current_spot.left, current_spot.top]
                : [entry.left, entry.top, current_spot.left, current_spot.top];

            Canvas.drawShade(0, [ctx, points, status_color]);
        }

        // entry markers
        if (granularity === 0 && entry && entry.visible) {
            Canvas.drawSVG(0, [
                ctx,
                ICONS.ENTRY_SPOT.withColorOnSpecificPaths({
                    0: { fill: background_color },
                    1: { fill: foreground_color },
                }),
                [entry.left, entry.top],
                entry.zoom,
            ]);
        }

        // show the profit
        if (show_profit) {
            const symbol = CURRENCY_SYMBOLS[currency] || '';
            const decimal_places = CurrencyUtils.getDecimalPlaces(currency);
            const sign = profit < 0 ? '-' : profit > 0 ? '+' : ' '; // eslint-disable-line
            const text = `${sign}${symbol}${Math.abs(profit).toFixed(decimal_places)}`;

            Canvas.drawText(0, [ctx, [start.left, barrier - 28 * scale], text, scale, status_color_with_opacity]);
        }
        // status marker
        if (exit && exit.visible && is_sold) {
            // Draw a line from barrier to icon.
            const icon = ICONS.END.withColorOnSpecificPaths({
                0: { fill: background_color },
                1: { fill: status_color_with_opacity },
            });

            Canvas.drawLine(0, [ctx, [exit.left, barrier, exit.left, exit.top], 'dashed', status_color_with_opacity]);
            Canvas.drawSVG(0, [ctx, icon, [exit.left, exit.top], exit.zoom]);
        }

        Canvas.render();
        ctx.restore();
    }
);

export default NonTickContract;
