import { localize } from '@deriv/translations';
import RawMarkerMaker from './Helpers/raw-marker-maker.jsx';
import { getColor, getHexOpacity } from './Helpers/colors';
import { getScale, getChartOpacity } from './Helpers/calculations';
import BasicCanvasElements from './Helpers/canvas';
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
            if (exit.visible && tick_count === ticks.length - 1) {
                ctx.strokeStyle = status_color_with_opacity;
                BasicCanvasElements.VerticalLabelledLine(
                    ctx,
                    [exit.left, canvas_height - 50],
                    exit.zoom,
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
            BasicCanvasElements.BarrierLine(ctx, [reset_time.left, barrier, exit.left, barrier], 'solid');
        } else {
            ctx.strokeStyle = foreground_color;
            BasicCanvasElements.BarrierLine(ctx, [start.left, barrier, entry.left, barrier], 'dashed');
            ctx.strokeStyle = status_color_with_opacity;
            BasicCanvasElements.BarrierLine(ctx, [entry.left, barrier, exit.left, barrier], 'solid');
        }

        if (is_last_contract && !is_sold) {
            const points = is_reset_barrier_expired
                ? [reset_time.left, reset_time.top, exit.left, exit.top]
                : [entry.left, entry.top, exit.left, exit.top];

            BasicCanvasElements.Shade(ctx, points, status_color);
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
        // count down
        if (start.visible && !is_sold) {
            const points = [start.left, barrier - 28 * scale];
            const text = `${ticks.length - 1}/${tick_count}`;

            BasicCanvasElements.Text(ctx, points, text, scale);
        }
        // status marker
        if (exit.visible && is_sold) {
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

export default TickContract;
