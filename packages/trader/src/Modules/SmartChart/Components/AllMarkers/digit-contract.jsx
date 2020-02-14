import { localize } from '@deriv/translations';
import RawMarkerMaker from './Helpers/raw-marker-maker.jsx';
import { getColor, getHexOpacity } from './Helpers/colors';
import BasicCanvasElements from './Helpers/canvas';
import { getScale, getChartOpacity } from './Helpers/calculations';
import * as ICONS from '../icons';

const DigitContract = RawMarkerMaker(
    ({
        ctx: context,
        points: [start, ...ticks],
        prices: [entry_tick_top, exit_tick_top],
        is_last_contract,
        is_dark_theme,
        granularity,
        contract_info: { status, profit, is_sold, tick_stream, tick_count },
    }) => {
        /** @type {CanvasRenderingContext2D} */
        const ctx = context;

        const foreground_color = getColor({ is_dark_theme, status: 'fg' }).concat(
            is_last_contract ? '' : getHexOpacity(0.4)
        );
        const background_color = getColor({ is_dark_theme, status: 'bg' });
        const status_color = getColor({ status, is_dark_theme, profit });
        const status_color_with_opacity = status_color.concat(is_last_contract ? '' : getHexOpacity(0.4));

        ctx.save();

        const scale = getScale(start.zoom);

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

        const canvas_height = ctx.canvas.height / window.devicePixelRatio;
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
            if (expiry.visible && is_sold) {
                BasicCanvasElements.VerticalLabelledLine(
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
                    foreground_color
                );
            }
        }

        // count down
        if (start.visible && start.top && !is_sold) {
            BasicCanvasElements.Text(
                ctx,
                [start.left - 1 * scale, start.top - 28 * scale],
                `${ticks.length}/${tick_count}`,
                scale
            );
        }
        // start-time marker
        const opacity = is_sold ? getChartOpacity(start.left, expiry.left) : '';
        if (start.visible && granularity === 0 && !is_sold) {
            BasicCanvasElements.SVG(
                ctx,
                ICONS.END.withColorOnSpecificPaths({
                    0: { fill: getColor({ status: 'bg', is_dark_theme }) + opacity },
                    1: { fill: status_color + opacity },
                }),
                [start.left, start.top],
                start.zoom
            );
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

            BasicCanvasElements.Circle(ctx, [tick.left, tick.top], 7 * scale, 'solid', status_color, foreground_color);
            BasicCanvasElements.Circle(
                ctx,
                [tick.left, tick.top],
                6 * scale,
                'solid',
                status_color,
                is_sold ? status_color : background_color
            );

            const last_digit = tick_stream[idx].tick_display_value.slice(-1);
            BasicCanvasElements.Text(
                ctx,
                [tick.left, tick.top + 1],
                last_digit,
                scale,
                is_sold ? 'white' : status_color
            );
        });

        ctx.restore();
    }
);

export default DigitContract;
