import { localize } from '@deriv/translations';
import RawMarkerMaker from './Helpers/raw-marker-maker.jsx';
import { getColor, getOpacity } from './Helpers/colors';
import { calculateScale } from './Helpers/calculations';
import Canvas from './Helpers/canvas';
import * as ICONS from '../icons';

const DigitContract = RawMarkerMaker(
    ({
        ctx,
        points: [start, ...ticks],
        prices: [entry_tick_top, exit_tick_top],
        should_highlight_contract,
        is_dark_theme,
        granularity,
        contract_info: { status, profit, is_sold, tick_stream, tick_count },
    }) => {
        ctx.save();

        if (granularity !== 0 && start && entry_tick_top) {
            start.top = entry_tick_top;
        }

        if (!ticks.length) {
            ctx.restore();
            return;
        }

        const expiry = ticks[ticks.length - 1];
        if (granularity !== 0 && expiry && exit_tick_top) {
            expiry.top = exit_tick_top;
        }

        const opacity = getOpacity(should_highlight_contract);
        const scale = calculateScale(start.zoom);
        const canvas_height = ctx.canvas.height / window.devicePixelRatio;

        const foreground_color = getColor('fg', is_dark_theme).concat(opacity);
        const background_color = getColor('bg', is_dark_theme);
        const status_color = getColor(status, is_dark_theme, profit);
        const status_color_with_opacity = status_color.concat(opacity);

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
            if (expiry.visible && is_sold) {
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
                    foreground_color,
                ]);
            }
        }

        // count down
        if (start.visible && start.top && !is_sold) {
            Canvas.drawText(0, [
                ctx,
                [start.left - 1 * scale, start.top - 28 * scale],
                `${ticks.length}/${tick_count}`,
                scale,
                status_color,
            ]);
        }
        // start-time marker
        if (start.visible && granularity === 0 && !is_sold) {
            Canvas.drawSVG(0, [
                ctx,
                ICONS.END.withColorOnSpecificPaths({
                    0: { fill: getColor('bg', is_dark_theme) },
                    1: { fill: status_color },
                }),
                [start.left, start.top],
                start.zoom,
            ]);
        }
        // remaining ticks
        ticks.forEach((tick, idx) => {
            if (
                tick !== expiry ||
                !tick.visible ||
                (granularity !== 0 && tick !== expiry) ||
                (granularity !== 0 && tick === expiry && !is_sold)
            )
                return;

            Canvas.drawCircle(0, [ctx, [tick.left, tick.top], 7 * scale, 'solid', status_color, foreground_color]);
            Canvas.drawCircle(0, [
                ctx,
                [tick.left, tick.top],
                6 * scale,
                'solid',
                status_color,
                is_sold ? status_color : background_color,
            ]);

            const last_digit = tick_stream[idx].tick_display_value.slice(-1);
            Canvas.drawText(0, [ctx, [tick.left, tick.top + 1], last_digit, scale, is_sold ? 'white' : status_color]);
        });

        Canvas.render();
        ctx.restore();
    }
);

export default DigitContract;
