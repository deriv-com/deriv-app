import React          from 'react';
import { FastMarker, RawMarker } from 'smartcharts-beta';

const RawMarkerMaker = (draw_callback) => {
    const Marker = ({ epoch_array, ...rest }) => (
        <RawMarker
            epoch_array={epoch_array}
            draw_callback={args => draw_callback({ ...args, ...rest })}
        />
    );
    return Marker;
};

export const FastMarkerMaker = children => {
    const Marker = ({ epoch, price, calculate_price, draw_callback, ...rest }) => {
        const onRef = ref => {
            if (ref) {
                ref.setPosition({ epoch, price, calculate_price, draw_callback });
            }
        };
        return (
            <FastMarker markerRef={onRef}>
                {children(rest)}
            </FastMarker>
        );
    };
    return Marker;
};

/** @param {CanvasRenderingContext2D} ctx */
const draw_path = (ctx, { top, left, paths }) => {
    ctx.save();
    ctx.translate(left, top);

    paths.forEach(({ points, fill, stroke }) => {
        if (fill) { ctx.fillStyle = fill; }
        if (stroke) { ctx.strokeStyle = stroke; }
        ctx.beginPath();
        let prev_x, prev_y;
        for (let idx = 0; idx < points.length; idx++) {
            let x, y, cx1, cx2, cy1, cy2;
            if (points[idx] === 'M') {
                x = points[++idx];
                y = points[++idx];
                ctx.moveTo(x, y);
            } else if (points[idx] === 'L') {
                x = points[++idx];
                y = points[++idx];
                ctx.lineTo(x, y);
            } else if (points[idx] === 'V') {
                y = points[++idx];
                ctx.lineTo(prev_x, y);
            } else if (points[idx] === 'H') {
                x = points[++idx];
                ctx.lineTo(x, prev_y);
            } else if (points[idx] === 'Q') {
                cx1 = points[++idx];
                cy1 = points[++idx];
                x = points[++idx];
                y = points[++idx];
                ctx.quadraticCurveTo(cx1, cy1, x, y);
            } else if (points[idx] === 'C') {
                cx1 = points[++idx];
                cy1 = points[++idx];
                cx2 = points[++idx];
                cy2 = points[++idx];
                x = points[++idx];
                y = points[++idx];
                ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
            }
            prev_x = x;
            prev_y = y;
        }
        ctx.closePath();
        if (fill) { ctx.fill(); }
        if (stroke) { ctx.stroke(); }
    });

    ctx.restore();
};

// all path commands *must* be absolute (MCLVQZ).
// use figma instead, it by default exports paths as absolute.
const parse_svg = (markup) => {
    const parser = new DOMParser();
    const svg = parser.parseFromString(markup, 'image/svg+xml').children[0];
    let { width, height } = svg.attributes;
    width = width.value * 1;
    height = height.value * 1;

    const paths = [];
    [].forEach.call(svg.children, p => {
        const { d, fill, stroke } = p.attributes;
        paths.push({
            points: d.value.match(/M|C|H|L|V|-?\d*(\.\d+)?/g)
                .filter(e => e)
                .map(e => 'MCHLV'.indexOf(e) === -1 ? e * 1 : e),
            fill  : fill && fill.value,
            stroke: stroke && stroke.value,
        });
    });

    return {
        width,
        height,
        paths,
    };
};

const svgs = {
    CALL: parse_svg(`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#EC3F3F"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4L11.4641 10H4.5359L8 4Z" fill="white"/>
    </svg>
    `),
    PUT: parse_svg(`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#2D9F93"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 12L4.5359 6L11.4641 6L8 12Z" fill="white"/>
    </svg>
    `),
    lost: parse_svg(`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#EC3F3F"/>
    <path d="M8 7.29289L10.1464 5.14645C10.3417 4.95118 10.6583 4.95118 10.8536 5.14645C11.0488 5.34171 11.0488 5.65829 10.8536 5.85355L8.70711 8L10.8536 10.1464C11.0488 10.3417 11.0488 10.6583 10.8536 10.8536C10.6583 11.0488 10.3417 11.0488 10.1464 10.8536L8 8.70711L5.85355 10.8536C5.65829 11.0488 5.34171 11.0488 5.14645 10.8536C4.95118 10.6583 4.95118 10.3417 5.14645 10.1464L7.29289 8L5.14645 5.85355C4.95118 5.65829 4.95118 5.34171 5.14645 5.14645C5.34171 4.95118 5.65829 4.95118 5.85355 5.14645L8 7.29289Z" fill="white" stroke="white"/>
    </svg>
    `),
    won: parse_svg(`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#2D9F93"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1464 5.14645C11.3417 4.95118 11.6583 4.95118 11.8536 5.14645C12.0488 5.34171 12.0488 5.65829 11.8536 5.85355L6.85355 10.8536C6.65829 11.0488 6.34171 11.0488 6.14645 10.8536L4.14645 8.85355C3.95118 8.65829 3.95118 8.34171 4.14645 8.14645C4.34171 7.95118 4.65829 7.95118 4.85355 8.14645L6.5 9.79289L11.1464 5.14645Z" fill="white" stroke="white"/>
    </svg>

    `),
};

const SpotMarker = RawMarkerMaker(({
    ctx: context,
    points: [st, ...ticks], // st = start_time tick
    contract_info: {
        contract_type,
        exit_tick_time,
        status,
        profit,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const colors = {
        open: '#2196F3',
        won : '#2D9F93',
        lost: '#EC3F3F',
    };
    let color = colors[status || 'open'];
    if (status === 'open' && profit && ticks.length >= 2) {
        color = colors[profit > 0 ? 'won' : 'lost'];
    }
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    if (ticks.length <= 1 && st.visible) {
        ctx.fillText('Start Time', st.left + 5, 21);
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(st.left, 0);
        ctx.lineTo(st.left, ctx.canvas.height);
        ctx.stroke();
    }
    if (!ticks.length) {
        ctx.restore();
        return;
    }
    const first = ticks[0];
    const last = ticks[ticks.length - 1];
    // horizontal dashed line
    if (st.visible || first.visible) {
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(st.left, first.top);
        ctx.lineTo(first.left, first.top);
        ctx.stroke();
    }
    // barrier solid line
    if (
        (first.visible && last.visible && last.left - first.left > 16) ||
        first.visible !== last.visible
    ) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(first.left, first.top);
        ctx.lineTo(last.left, first.top);
        ctx.stroke();
    }
    // entry spot
    if (first.visible) {
        ctx.beginPath();
        ctx.arc(first.left, first.top, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    // start-time marker
    if (st.visible) {
        draw_path(ctx, {
            top  : first.top - 8,
            left : st.left - 8,
            paths: svgs[contract_type]
                .paths
                .map(({ points, fill, stroke }) => ({
                    points,
                    stroke,
                    fill: fill !== 'white' ? color : fill,
                })),
        });
    }
    // status marker
    if (
        last.visible &&
        last.left - first.left > 16 &&
        last.epoch * 1 === exit_tick_time * 1 &&
        status !== 'open'
    ) {
        draw_path(ctx, {
            top  : first.top - 8,
            left : last.left - 8,
            paths: svgs[status].paths,
        });
    }
    ctx.restore();
});

export default {
    SpotMarker,
};
