// THIS FILE CONTAINS THE ICONS RENDERED IN CANVAS2D CONTEXT.

// All path commands *MUST* be absolute (MCLVQZ).
// Use figma.com which by default exports paths as absolute.
// Only <path /> tags is supported.
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
    function with_color(color) {
        return {
            width,
            height,
            paths: paths
                .map(({ points, fill, stroke }) => ({
                    points,
                    stroke,
                    fill: fill !== 'white' ? color : fill,
                })),
        };
    }

    return {
        width,
        height,
        paths,
        with_color,
    };
};

export const CALL = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#EC3F3F"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 4L11.4641 10H4.5359L8 4Z" fill="white"/>
</svg>
`);

export const PUT = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#2D9F93"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 12L4.5359 6L11.4641 6L8 12Z" fill="white"/>
</svg>
`);

export const LOST = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#EC3F3F"/>
<path d="M8 7.29289L10.1464 5.14645C10.3417 4.95118 10.6583 4.95118 10.8536 5.14645C11.0488 5.34171 11.0488 5.65829 10.8536 5.85355L8.70711 8L10.8536 10.1464C11.0488 10.3417 11.0488 10.6583 10.8536 10.8536C10.6583 11.0488 10.3417 11.0488 10.1464 10.8536L8 8.70711L5.85355 10.8536C5.65829 11.0488 5.34171 11.0488 5.14645 10.8536C4.95118 10.6583 4.95118 10.3417 5.14645 10.1464L7.29289 8L5.14645 5.85355C4.95118 5.65829 4.95118 5.34171 5.14645 5.14645C5.34171 4.95118 5.65829 4.95118 5.85355 5.14645L8 7.29289Z" fill="white" stroke="white"/>
</svg>
`);

export const WON = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#2D9F93"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.1464 5.14645C11.3417 4.95118 11.6583 4.95118 11.8536 5.14645C12.0488 5.34171 12.0488 5.65829 11.8536 5.85355L6.85355 10.8536C6.65829 11.0488 6.34171 11.0488 6.14645 10.8536L4.14645 8.85355C3.95118 8.65829 3.95118 8.34171 4.14645 8.14645C4.34171 7.95118 4.65829 7.95118 4.85355 8.14645L6.5 9.79289L11.1464 5.14645Z" fill="white" stroke="white"/>
</svg>`);
