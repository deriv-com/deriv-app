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
            points: d.value.match(/M|C|H|L|V|-?\d*(\.\d+)?/g)
                .filter(e => e)
                .map(e => 'MCHLV'.indexOf(e) === -1 ? e * 1 : e),
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
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.49898 0C3.70445 0.0044982 0.629508 3.07283 0.625 6.85918C0.625 10.5327 6.99176 19.3082 7.26378 19.6755L7.49898 20L7.73622 19.6755C8.00619 19.3041 14.375 10.5408 14.375 6.85918C14.3705 3.07203 11.2943 0.00337369 7.49898 0ZM7.49898 9.20408C5.77669 9.20408 4.3804 7.8111 4.38002 6.09252C4.37964 4.37394 5.77533 2.98034 7.49761 2.97959C9.2199 2.97884 10.6168 4.37122 10.6179 6.0898C10.6168 7.80851 9.22139 9.20183 7.49898 9.20408V9.20408Z" fill="#333333"/>
</svg>`);

export const END = parse_svg(`
<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3 3L18 3L18 14L3 14Z" fill="white" />
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.833333 0C0.373096 0 0 0.373096 0 0.833334V1.66667V15V19.1667C0 19.6269 0.373097 20 0.833334 20H0.871212C1.33145 20 1.70455 19.6269 1.70455 19.1667V15H17.0833C18.0038 15 18.75 14.2538 18.75 13.3333V3.33333C18.75 2.41286 18.0038 1.66667 17.0833 1.66667H1.70455V0.833333C1.70455 0.373096 1.33145 0 0.871212 0H0.833333ZM6.81818 3.33333H10.2273V6.66667H6.81818V3.33333ZM6.81818 10H3.40909V6.66667H6.81818V10ZM10.2273 10V13.3333H6.81818V10H10.2273ZM13.6364 10H10.2273V6.66667H13.6364V10ZM13.6364 10H17.0455V13.3333H13.6364V10ZM13.6364 6.66667V3.33333H17.0455V6.66667H13.6364Z" fill="#333333"/>
</svg>
`);
