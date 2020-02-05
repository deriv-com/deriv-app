import { localize } from '@deriv/translations';
import RawMarkerMaker from './Helpers/raw-marker-maker.jsx';
import renderSvg2Canvas from './Helpers/svg2canvas';
import { getColor, getHexOpacity } from './Helpers/colors';
import { shadowedText } from './Helpers/text';
import { drawVerticalLabelledLine, drawBarrierLine, drawLine } from './Helpers/lines';
import { drawShade } from './Helpers/shade';
import { getScale, getChartOpacity } from './Helpers/calculations';
import * as ICONS from '../icons';

const TickContract = RawMarkerMaker(
    ({
        ctx: context,
        points: [start, reset_time, ...ticks],
        prices: [barrier, entry_tick_top], // TODO: support two barrier contracts
        is_last_contract,
        is_dark_theme,
        granularity,
        contract_info: { status, profit, is_sold, tick_count },
    }) => {
        /** @type {CanvasRenderingContext2D} */
        const ctx = context;

        const foreground_color = getColor({ is_dark_theme, status: 'fg' }).concat(
            is_last_contract ? '' : getHexOpacity(0.4)
        );
        const background_color = getColor({ is_dark_theme, status: 'bg' });
        const scale = getScale(start.zoom);
        const canvas_height = ctx.canvas.height / window.devicePixelRatio;

        ctx.save();
        ctx.strokeStyle = foreground_color;
        ctx.fillStyle = background_color;

        if (barrier) {
            barrier = Math.min(Math.max(barrier, 2), canvas_height - 32); // eslint-disable-line
        }

        if (!ticks.length || !barrier) {
            ctx.restore();
            return;
        }

        const exit = ticks[ticks.length - 1];
        const entry = ticks[0];
        const opacity = is_sold ? getChartOpacity(start.left, exit.left) : '';
        const status_color = getColor({ status, is_dark_theme, profit });
        const status_color_with_opacity = status_color.concat(is_last_contract ? '' : getHexOpacity(0.4));

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
            if (exit.visible && tick_count === ticks.length - 1) {
                ctx.strokeStyle = status_color_with_opacity;
                drawVerticalLabelledLine({
                    ctx,
                    text: localize('Sell Time'),
                    position: {
                        zoom: exit.zoom,
                        left: exit.left,
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
            drawBarrierLine(ctx, reset_time, exit, barrier);
        } else {
            ctx.strokeStyle = foreground_color;
            drawBarrierLine(ctx, start, entry, barrier, 'dashed');
            ctx.strokeStyle = status_color_with_opacity;
            drawBarrierLine(ctx, entry, exit, barrier, 'solid');
        }

        if (is_last_contract && !is_sold) {
            drawShade(ctx, is_reset_barrier_expired ? reset_time : entry, exit, status_color);
        }

        // ticks for last contract
        if (granularity === 0 && is_last_contract && !is_sold) {
            ticks
                .filter(tick => tick.visible)
                .forEach(tick => {
                    const clr = tick === exit ? foreground_color : getColor({ status: 'fg', is_dark_theme });
                    ctx.fillStyle = clr + opacity;
                    ctx.beginPath();
                    ctx.arc(tick.left - 1 * scale, tick.top, 1.5 * scale, 0, Math.PI * 2);
                    ctx.fill();
                });
            ctx.fillStyle = foreground_color;
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
        // count down
        if (start.visible && !is_sold) {
            shadowedText({
                ctx,
                scale,
                is_dark_theme,
                text: `${ticks.length - 1}/${tick_count}`,
                left: start.left,
                top: barrier - 28 * scale,
            });
        }
        // status marker
        if (exit.visible && is_sold) {
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

export default TickContract;
