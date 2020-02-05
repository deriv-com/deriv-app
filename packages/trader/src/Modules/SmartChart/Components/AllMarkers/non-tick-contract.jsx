import CurrencyUtils from '@deriv/shared/utils/currency';
import { localize } from '@deriv/translations';
import RawMarkerMaker from './Helpers/raw-marker-maker.jsx';
import renderSvg2Canvas from './Helpers/svg2canvas';
import { CURRENCY_SYMBOLS } from './Constants/currency_symbols';
import { getColor, getHexOpacity } from './Helpers/colors';
import { shadowedText } from './Helpers/text';
import { drawVerticalLabelledLine, drawBarrierLine, drawLine } from './Helpers/lines';
import { drawShade } from './Helpers/shade';
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
                drawVerticalLabelledLine({
                    ctx,
                    text: localize('Buy Time'),
                    position: {
                        zoom: start.zoom,
                        left: start.left,
                        top: canvas_height - 50,
                    },
                    line_style: 'dashed',
                    icon: ICONS.BUY_SELL.withColorOnSpecificPaths({
                        0: { fill: background_color },
                        1: { fill: foreground_color },
                    }),
                });
            }

            if (has_reset_time) {
                ctx.fillStyle = foreground_color;
                drawVerticalLabelledLine({
                    ctx,
                    text: localize('Reset Time'),
                    position: {
                        zoom: reset_time.zoom,
                        left: reset_time.left,
                        top: canvas_height - 50,
                    },
                    line_style: 'dashed',
                    icon: ICONS.RESET.withColor(foreground_color, background_color),
                });
            }

            if (expiry.visible) {
                ctx.strokeStyle = status_color_with_opacity;
                drawVerticalLabelledLine({
                    ctx,
                    text: localize('Sell Time'),
                    position: {
                        zoom: expiry.zoom,
                        left: expiry.left,
                        top: canvas_height - 50,
                    },
                    line_style: 'solid',
                    icon: ICONS.BUY_SELL.withColorOnSpecificPaths({
                        0: { fill: background_color },
                        1: { fill: status_color_with_opacity },
                    }),
                });
            }
        }

        const is_reset_barrier_expired = has_reset_time && entry_tick_top !== barrier;

        // barrier line
        if (barrier && entry && (start.visible || expiry.visible || Math.sign(start.left) !== Math.sign(expiry.left))) {
            ctx.fillStyle = background_color;
            if (is_reset_barrier_expired) {
                if (is_sold) {
                    drawLine(
                        ctx,
                        { left: reset_time.left, top: entry_tick_top },
                        { left: reset_time.left, top: barrier },
                        'dashed'
                    );
                }

                ctx.strokeStyle = foreground_color;
                drawBarrierLine(ctx, start, reset_time, entry_tick_top, 'dashed');
                ctx.strokeStyle = status_color_with_opacity;
                drawBarrierLine(ctx, reset_time, expiry, barrier);
            } else {
                ctx.strokeStyle = foreground_color;
                drawBarrierLine(ctx, start, entry, barrier, 'dashed');
                ctx.strokeStyle = status_color_with_opacity;
                drawBarrierLine(ctx, entry, expiry, barrier, 'solid');
            }
        }

        if (is_last_contract && !is_sold) {
            drawShade(ctx, is_reset_barrier_expired ? reset_time : entry, current_spot, status_color);
        }

        // entry markers
        if (granularity === 0 && entry && entry.visible) {
            renderSvg2Canvas({
                ctx,
                position: entry,
                icon: ICONS.ENTRY_SPOT.withColorOnSpecificPaths({
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
            shadowedText({
                ctx,
                scale,
                text,
                is_dark_theme,
                left: start.left,
                top: barrier - 28 * scale,
            });
        }
        // status marker
        if (expiry.visible && is_sold) {
            // Draw a line from barrier to icon.
            const icon = ICONS.END.withColorOnSpecificPaths({
                0: { fill: background_color + (is_sold ? opacity : '') },
                1: { fill: status_color_with_opacity },
            });

            ctx.strokeStyle = status_color_with_opacity;
            drawLine(ctx, { left: exit.left, top: barrier }, exit, 'dashed');
            renderSvg2Canvas({ ctx, icon, position: exit });
        }

        ctx.restore();
    }
);

export default NonTickContract;
