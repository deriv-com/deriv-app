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

const FastMarkerMaker = children => {
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
        <path d="M14 0H9V0.01C9 1.10905 9.89095 2 10.99 2H12.59L4 10.586V13.414L14 3.414V5.014C14.0022 6.11148 14.8925 7 15.99 7H16V2C16 0.89543 15.1046 0 14 0Z" fill="#EF4852"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 14.586V14H2H3.414L2 15.414L1.414 16H0V14.586Z" fill="#85ACB0"/>
        </svg>
    `),
    PUT: parse_svg(`
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.99 8.99997C14.891 8.99997 14 9.89092 14 10.99V12.59L4 2.58997V5.41397L12.586 14H10.986C9.88852 14.0022 9 14.8925 9 15.99V16H14C15.1046 16 16 15.1045 16 14V8.99997H15.99Z" fill="#EF4852"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.414V2H2H3.414L2 0.586L1.414 0H0V1.414Z" fill="#85ACB0"/>
        </svg>
    `),
    exit_tick: parse_svg(`
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 16.5C12.9183 16.5 16.5 12.9183 16.5 8.5C16.5 4.08172 12.9183 0.5 8.5 0.5C4.08172 0.5 0.5 4.08172 0.5 8.5C0.5 12.9183 4.08172 16.5 8.5 16.5Z" fill="#4BB4B3"/>
        <path d="M5.5 8.5L7.5 10.5L11.5 6.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `),
};

const SpotMarker = RawMarkerMaker(({
    ctx: context,
    points: [{ left, top }, ...ticks],
    contract_type,
    exit_tick_time,
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;
    // console.warn(contract_type);
    draw_path(ctx, {
        top  : top - 24 - 2,
        left : left - 8,
        paths: svgs[contract_type].paths,
    });

    ctx.save();
    ctx.strokeStyle = '#00A79E';
    ctx.fillStyle = '#00A79E';

    if (ticks.length) {
        const first = ticks[0];
        const last = ticks[ticks.length - 1];

        // vertical dashed line
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(left, top);
        ctx.lineTo(left, first.top);
        ctx.lineTo(first.left, first.top);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(first.left, first.top, 3, 0, Math.PI * 2);
        ctx.fill();

        // barrier solid line
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(first.left, first.top);
        ctx.lineTo(last.left, first.top);
        ctx.stroke();

        // console.warn(last.epoch, exit_tick_time);
        if (last.epoch * 1 === exit_tick_time * 1) {
            draw_path(ctx, {
                top  : first.top - 8,
                left : last.left - 8,
                paths: svgs.exit_tick.paths,
            });
        }
    }
    ctx.restore();
});

export default {
    SpotMarker,
};
