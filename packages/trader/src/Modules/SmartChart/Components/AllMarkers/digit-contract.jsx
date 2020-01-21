import RawMarkerMaker    from './Helpers/raw-marker-maker.jsx';
import Svg2Canvas        from './Helpers/svg2canvas';
import { get_color }     from './Helpers/colors';
import { shadowed_text } from './Helpers/text';
import {
    calc_scale,
    calc_opacity,
}                        from './Helpers/calculations';
import * as ICONS        from '../icons';

const DigitContract = RawMarkerMaker(({
    ctx: context,
    points: [start, ...ticks],
    prices: [entry_tick_top, exit_tick_top],
    is_last_contract,
    is_dark_theme,
    granularity,
    contract_info: {
        // contract_type,
        status,
        profit,
        is_sold,
        // barrier,
        tick_stream,
        tick_count,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const color = get_color({
        is_dark_theme,
        status,
        profit: is_sold ? profit : null,
    });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const draw_start_line = is_last_contract && start.visible && !is_sold;
    const scale = calc_scale(start.zoom);

    if (granularity !== 0 && start && entry_tick_top) { start.top = entry_tick_top; }
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
    const opacity = is_sold ? calc_opacity(start.left, expiry.left) : '';
    if (granularity !== 0 && expiry && exit_tick_top) { expiry.top = exit_tick_top; }

    // count down
    if (start.visible && start.top && !is_sold) {
        shadowed_text({
            ctx,
            scale,
            is_dark_theme,
            text: `${ticks.length}/${tick_count}`,
            left: start.left - 1 * scale,
            top : start.top - 27 * scale,
        });
    }
    // start-time marker
    if (start.visible && (granularity === 0 || !is_sold)) {
        Svg2Canvas.render({
            ctx,
            position: {
                top : start.top - 9 * scale,
                left: start.left - 1 * scale,
                zoom: start.zoom,
            },
            icon: ICONS.END.with_color_on_specific_paths({
                0: { fill: get_color({ status: 'bg', is_dark_theme }) + opacity },
                1: { fill: color + opacity },
            }),
        });
    }
    // remaining ticks
    ticks.forEach((tick, idx) => {
        if (tick !== expiry) { return; }
        if (!tick.visible) { return; }
        if (granularity !== 0 && tick !== expiry) { return; }
        if (granularity !== 0 && tick === expiry && !is_sold) { return; }
        const clr = tick !== expiry ?
            get_color({ status: 'fg', is_dark_theme }) : color;
        ctx.beginPath();
        ctx.fillStyle = clr;
        ctx.arc(tick.left, tick.top, 7 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = is_sold ? color : get_color({ status: 'bg', is_dark_theme });
        ctx.arc(tick.left, tick.top, 6 * scale, 0, Math.PI * 2);
        ctx.fill();

        const last_tick = tick_stream[idx];
        const last_digit = last_tick.tick_display_value.slice(-1);
        ctx.fillStyle = is_sold ? 'white' : clr;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 0;
        ctx.font = `bold ${12 * scale}px BinarySymbols, Roboto`;
        ctx.fillText(last_digit, tick.left, tick.top);
    });
    // status marker
    if (expiry.visible && is_sold) {
        ctx.fillStyle = color;
        Svg2Canvas.render({
            ctx,
            position: {
                top : expiry.top - 16 * scale,
                left: expiry.left + 8 * scale,
                zoom: expiry.zoom,
            },
            icon: ICONS.END.with_color_on_specific_paths({
                0: { fill: get_color({ status: 'bg', is_dark_theme }) },
                1: { fill: color },
            }),
        });
    }
    ctx.restore();
});

export default DigitContract;
