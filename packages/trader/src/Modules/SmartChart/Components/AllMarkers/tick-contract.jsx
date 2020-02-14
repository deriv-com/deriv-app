import { localize } from '@deriv/translations';
import RawMarkerMaker from './Helpers/raw-marker-maker.jsx';
import { getColor, getOpacity } from './Helpers/colors';
import { calculateScale } from './Helpers/calculations';
import BasicCanvasElements from './Helpers/canvas';
import * as ICONS from '../icons';

const TickContract = RawMarkerMaker(
    ({
        ctx,
        points: [start, reset_time, ...ticks],
        prices: [barrier, entry_tick_top], // TODO: support two barrier contracts
        is_last_contract,
        is_dark_theme,
        granularity,
        contract_info: { status, profit, is_sold, tick_count },
    }) => {
        ctx.save();

        const canvas_height = ctx.canvas.height / window.devicePixelRatio;
        if (barrier) {
            barrier = Math.min(Math.max(barrier, 2), canvas_height - 32); // eslint-disable-line
        }

        if (!ticks.length || !barrier) {
            ctx.restore();
            return;
        }

        const exit = ticks[ticks.length - 1];
        const entry = ticks[0];

        const scale = calculateScale(start.zoom);
        const opacity = getOpacity(is_last_contract, is_sold, [start.left, exit.left]);

        const foreground_color = getColor('fg', is_dark_theme).concat(opacity);
        const background_color = getColor('bg', is_dark_theme).concat(opacity);
        const status_color = getColor(status, is_dark_theme, profit);
        const status_color_with_opacity = status_color.concat(opacity);

        const has_reset_time = reset_time && reset_time.epoch;
        const should_draw_vertical_line = is_last_contract && !is_sold;
        if (should_draw_vertical_line) {
            if (start.visible) {
                BasicCanvasElements.VerticalLabelledLine(
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
                    foreground_color
                );
            }
            if (has_reset_time) {
                BasicCanvasElements.VerticalLabelledLine(
                    ctx,
                    [reset_time.left, canvas_height - 50],
                    reset_time.zoom,
                    localize('Reset Time'),
                    ICONS.RESET.withColor(foreground_color, background_color),
                    'dashed',
                    foreground_color,
                    foreground_color
                );
            }
            if (exit.visible && tick_count === ticks.length - 1) {
                BasicCanvasElements.VerticalLabelledLine(
                    ctx,
                    [exit.left, canvas_height - 50],
                    exit.zoom,
                    localize('Sell Time'),
                    ICONS.BUY_SELL.withColorOnSpecificPaths({
                        0: { fill: background_color },
                        1: { fill: status_color_with_opacity },
                    }),
                    'solid',
                    status_color_with_opacity,
                    foreground_color
                );
            }
        }

        const is_reset_barrier_expired = has_reset_time && entry_tick_top !== barrier;

        // barrier line
        if (is_reset_barrier_expired) {
            if (!is_last_contract) {
                BasicCanvasElements.Line(
                    ctx,
                    [reset_time.left, entry_tick_top, reset_time.left, barrier],
                    'dashed',
                    foreground_color
                );
            }

            BasicCanvasElements.BarrierLine(
                ctx,
                [start.left, entry_tick_top, reset_time.left, entry_tick_top],
                'dashed',
                foreground_color,
                background_color
            );
            BasicCanvasElements.BarrierLine(
                ctx,
                [reset_time.left, barrier, exit.left, barrier],
                'solid',
                status_color_with_opacity,
                background_color
            );
        } else {
            BasicCanvasElements.BarrierLine(
                ctx,
                [start.left, barrier, entry.left, barrier],
                'dashed',
                foreground_color,
                background_color
            );
            BasicCanvasElements.BarrierLine(
                ctx,
                [entry.left, barrier, exit.left, barrier],
                'solid',
                status_color_with_opacity,
                background_color
            );
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
                    const clr = tick === exit ? foreground_color : getColor('fg', is_dark_theme);
                    BasicCanvasElements.Circle(
                        ctx,
                        [tick.left - 1 * scale, tick.top],
                        1 * scale,
                        'solid',
                        foreground_color,
                        clr
                    );
                });
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

            BasicCanvasElements.Text(ctx, points, text, scale, foreground_color);
        }
        // status marker
        if (exit.visible && is_sold) {
            // Draw a line from barrier to icon.
            const icon = ICONS.END.withColorOnSpecificPaths({
                0: { fill: background_color },
                1: { fill: status_color_with_opacity },
            });

            BasicCanvasElements.Line(
                ctx,
                [exit.left, barrier, exit.left, exit.top],
                'dashed',
                status_color_with_opacity
            );
            BasicCanvasElements.SVG(ctx, icon, [exit.left, exit.top], exit.zoom);
        }

        ctx.restore();
    }
);

export default TickContract;
