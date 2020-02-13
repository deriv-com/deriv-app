import RawMarkerMaker from './Helpers/raw-marker-maker.jsx';
import { getColor } from './Helpers/colors';
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

        const color = getColor({
            is_dark_theme,
            status,
            profit: is_sold ? profit : null,
        });

        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        const draw_start_line = is_last_contract && start.visible && !is_sold;
        const scale = getScale(start.zoom);

        if (granularity !== 0 && start && entry_tick_top) {
            start.top = entry_tick_top;
        }
        if (draw_start_line) {
            ctx.beginPath();
            ctx.setLineDash([3, 3]);
            ctx.moveTo(start.left - 1 * scale, 0);
            if (ticks.length) {
                ctx.lineTo(start.left - 1 * scale, start.top - 34 * scale);
                ctx.moveTo(start.left - 1 * scale, start.top + 4 * scale);
            }
            ctx.lineTo(start.left - 1 * scale, ctx.canvas.height);
            ctx.stroke();
        }

        if (!ticks.length) {
            ctx.restore();
            return;
        }
        const expiry = ticks[ticks.length - 1];
        const opacity = is_sold ? getChartOpacity(start.left, expiry.left) : '';
        if (granularity !== 0 && expiry && exit_tick_top) {
            expiry.top = exit_tick_top;
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
        if (start.visible && (granularity === 0 || !is_sold)) {
            BasicCanvasElements.SVG(
                ctx,
                ICONS.END.withColorOnSpecificPaths({
                    0: { fill: getColor({ status: 'bg', is_dark_theme }) + opacity },
                    1: { fill: color + opacity },
                }),
                [start.top - 9 * scale, start.left - 1 * scale],
                start.zoom
            );
        }
        // remaining ticks
        ticks.forEach((tick, idx) => {
            if (tick !== expiry) {
                return;
            }
            if (!tick.visible) {
                return;
            }
            if (granularity !== 0 && tick !== expiry) {
                return;
            }
            if (granularity !== 0 && tick === expiry && !is_sold) {
                return;
            }
            const fill_color = tick !== expiry ? getColor({ status: 'fg', is_dark_theme }) : color;
            ctx.beginPath();
            ctx.fillStyle = fill_color;
            ctx.arc(tick.left, tick.top, 7 * scale, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = is_sold ? color : getColor({ status: 'bg', is_dark_theme });
            ctx.arc(tick.left, tick.top, 6 * scale, 0, Math.PI * 2);
            ctx.fill();

            const last_tick = tick_stream[idx];
            const last_digit = last_tick.tick_display_value.slice(-1);
            ctx.fillStyle = is_sold ? 'white' : fill_color;
            ctx.textAlign = 'center';
            ctx.shadowBlur = 0;
            ctx.font = `bold ${12 * scale}px BinarySymbols, Roboto`;
            ctx.fillText(last_digit, tick.left, tick.top);
        });
        // status marker
        if (expiry.visible && is_sold) {
            ctx.fillStyle = color;
            BasicCanvasElements.SVG(
                ctx,
                ICONS.END.withColorOnSpecificPaths({
                    0: { fill: getColor({ status: 'bg', is_dark_theme }) },
                    1: { fill: color },
                }),
                [expiry.top - 16 * scale, expiry.left + 8 * scale],
                expiry.zoom
            );
        }
        ctx.restore();
    }
);

export default DigitContract;
