import { localize } from '@deriv/translations';
import RawMarkerMaker from './Helpers/raw-marker-maker.jsx';
import { getColor, getOpacity } from './Helpers/colors';
import { calculateScale } from './Helpers/calculations';
import Canvas from './Helpers/canvas';
import * as ICONS from '../icons';

const TickContract = RawMarkerMaker(
    ({
        ctx,
        points: [start, reset_time, ...ticks],
        prices: [barrier, entry_tick_top], // TODO: support two barrier contracts
        should_highlight_contract,
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

        const opacity = getOpacity(should_highlight_contract);
        const scale = calculateScale(start.zoom);

        const foreground_color = getColor('fg', is_dark_theme).concat(opacity);
        const background_color = getColor('bg', is_dark_theme);
        const status_color = getColor(status, is_dark_theme, profit);
        const status_color_with_opacity = status_color.concat(opacity);

        const has_reset_time = reset_time && reset_time.epoch;
        const should_draw_vertical_line = should_highlight_contract && !is_sold;
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
            if (exit.visible && tick_count === ticks.length - 1) {
                Canvas.drawVerticalLabelledLine(0, [
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
                    foreground_color,
                ]);
            }
        }

        const is_reset_barrier_expired = has_reset_time && entry_tick_top !== barrier;

        // barrier line
        if (is_reset_barrier_expired) {
            if (is_sold) {
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
                [reset_time.left, barrier, exit.left, barrier],
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
                [entry.left, barrier, exit.left, barrier],
                'solid',
                status_color_with_opacity,
                background_color,
            ]);
        }

        if (should_highlight_contract && !is_sold) {
            const points = is_reset_barrier_expired
                ? [reset_time.left, reset_time.top, exit.left, exit.top]
                : [entry.left, entry.top, exit.left, exit.top];

            Canvas.drawShade(0, [ctx, points, status_color]);
        }

        // ticks for last contract
        if (granularity === 0 && should_highlight_contract && !is_sold) {
            ticks
                .filter(tick => tick.visible)
                .forEach(tick => {
                    const clr = tick === exit ? foreground_color : getColor('fg', is_dark_theme);
                    Canvas.drawCircle(0, [
                        ctx,
                        [tick.left - 1 * scale, tick.top],
                        1 * scale,
                        'solid',
                        foreground_color,
                        clr,
                    ]);
                });
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
        // count down
        if (start.visible && !is_sold) {
            const points = [start.left, barrier - 28 * scale];
            const text = `${ticks.length - 1}/${tick_count}`;

            Canvas.drawText(0, [ctx, points, text, scale, foreground_color]);
        }
        // status marker
        if (exit.visible && is_sold) {
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

export default TickContract;
