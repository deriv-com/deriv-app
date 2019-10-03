// THIS FILE CONTAINS THE ICONS RENDERED IN CANVAS2D CONTEXT.

// All path commands *MUST* be absolute (MCLVQZ).
// Use figma.com which by default exports paths as absolute.
// Only <path /> tags is supported.
const parse_svg = (markup) => {
    // make tests pass
    if (!window.DOMParser) { return null; }

    const parser = new window.DOMParser();
    const svg = parser.parseFromString(markup, 'image/svg+xml').children[0];
    let { width, height } = svg.attributes;
    width = width.value * 1;
    height = height.value * 1;

    const paths = [];
    [].forEach.call(svg.children, p => {
        const { d, fill, stroke } = p.attributes;
        paths.push({
            points: d.value.match(/M|C|H|A|L|V|-?\d*(\.\d+)?/g)
                .filter(e => e)
                .map(e => 'MCHALV'.indexOf(e) === -1 ? e * 1 : e),
            fill  : fill && fill.value,
            stroke: stroke && stroke.value,
        });
    });
    function with_color(color, bg_color = 'white') {
        return {
            width,
            height,
            paths: paths
                .map(({ points, fill, stroke }) => ({
                    points,
                    stroke,
                    fill: fill !== 'white' ? color : bg_color,
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

export const START = parse_svg(`
<svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7,20 C11.2,14.4 14,10.8659932 14,7 C14,3.13400675 10.8659932,0 7,0 C3.13400675,0 0,3.13400675 0,7 C0,10.8659932 2.8,14.4 7,20 Z" fill="#333333"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="A7 7 4.2 0 6.283185307179586" fill="white" />
</svg>`);

export const END = parse_svg(`
<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 2L18 2L18 12L2 12Z" fill="white" />
<path fill-rule="evenodd" clip-rule="evenodd" d="M2,0 L2,1 L19,1 L19,12 L2,12 L2,20 L1,20 L1,0 L2,0 Z M18,8 L15,8 L15,11 L18,11 L18,8 Z M12,8 L9,8 L9,11 L12,11 L12,8 Z M6,8 L3,8 L3,11 L6,11 L6,8 Z M15,5 L12,5 L12,8 L15,8 L15,5 Z M9,5 L6,5 L6,8 L9,8 L9,5 Z M6,2 L3,2 L3,5 L6,5 L6,2 Z M18,2 L15,2 L15,5 L18,5 L18,2 Z M12,2 L9,2 L9,5 L12,5 L12,2 Z" fill="#333333"/>
</svg>
`);
