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

export const START = parse_svg(`
<svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.45086 0.393686C7.9073 0.393682 9.30429 0.97136 10.3354 2C11.3664 3.02864 11.9474 4.42425 11.9509 5.88069C11.9509 8.82669 6.85586 15.8367 6.63986 16.1337L6.44986 16.3937L6.26186 16.1337C6.04386 15.8407 0.950864 8.81969 0.950864 5.88069C0.954306 4.42425 1.53529 3.02864 2.56637 2C3.59744 0.97136 4.99442 0.393682 6.45086 0.393686Z" fill="#FF0000"/>
</svg>
`);

export const END = parse_svg(`
<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.0912 1.12253H10.9336C11.5224 1.12253 12 1.62526 12 2.24589V8.98274C12 9.60253 11.5224 10.1053 10.9336 10.1053H1.0912V15.4383C1.0912 15.5873 1.03498 15.7302 0.934912 15.8355C0.834843 15.9408 0.69912 16 0.5576 16H0.5336C0.39208 16 0.256357 15.9408 0.156288 15.8355C0.0562184 15.7302 0 15.5873 0 15.4383V0.561684C0 0.250947 0.2384 0 0.5336 0H0.5576C0.852 0 1.0912 0.250947 1.0912 0.561684V1.12253ZM4.3632 2.24589V4.49095H6.5456V2.24589H4.3632ZM6.5456 4.49095V6.73684H8.7272V4.49095H6.5456ZM8.7272 2.24589V4.49095H10.9088V2.24589H8.7272ZM8.7272 6.73684V8.98274H10.9088V6.73684H8.7272ZM4.364 6.73684V8.98274H6.5456V6.73684H4.364ZM2.1816 4.49095V6.73684H4.364L4.3632 4.49095H2.1816Z" fill="#FF0000"/>
</svg>
`);

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

export const DIGITMATCH = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="#2D9F93"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11 8.38672H4.88867V10H11V8.38672ZM11 5.42676H4.88867V7.04004H11V5.42676Z" fill="white"/>
</svg>
`);

export const DIGITDIFF = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="#2D9F93"/>
<path d="M5 5.47656L8.78711 5.47656L9.58008 4L10.3936 4.42383L9.82617 5.47656H11.1113V7.08984H8.95801L8.2334 8.43652H11.1113V10.0498H7.36523L6.5791 11.5059L5.76562 11.0752L6.31934 10.0498H5V8.43652H7.1875L7.91895 7.08984L5 7.08984V5.47656Z" fill="white"/>
</svg>`);

export const DIGITUNDER = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="#EC3F3F"/>
<path d="M7.02832 7.71191L11 9.09961V11L5.0459 8.50488L5.0459 6.89844L11 4.39648V6.30371L7.02832 7.71191Z" fill="white"/>
</svg>`);

export const DIGITOVER = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="#EC3F3F"/>
<path d="M9.01758 7.68457L5.0459 6.29688L5.0459 4.39648L11 6.8916V8.49805L5.0459 11L5.0459 9.09277L9.01758 7.68457Z" fill="white"/>
</svg>`);

export const DIGITEVEN = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="#EC3F3F"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5 6C3.89543 6 3 6.89543 3 8C3 9.10457 3.89543 10 5 10C6.10457 10 7 9.10457 7 8C7 6.89543 6.10457 6 5 6Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11 6C9.89543 6 9 6.89543 9 8C9 9.10457 9.89543 10 11 10C12.1046 10 13 9.10457 13 8C13 6.89543 12.1046 6 11 6Z" fill="white"/>
</svg>`);

export const DIGITODD = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="#2D9F93"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6Z" fill="white"/>
</svg>`);

export const NOTOUCH = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#2D9F93"/>
<path d="M4.29289 10.2929L3.58579 11L5 12.4142L5.70711 11.7071L4.29289 10.2929ZM11.7071 5.70711L12.4142 5L11 3.58579L10.2929 4.29289L11.7071 5.70711ZM5.70711 11.7071L11.7071 5.70711L10.2929 4.29289L4.29289 10.2929L5.70711 11.7071ZM8 14C11.3137 14 14 11.3137 14 8H12C12 10.2091 10.2091 12 8 12V14ZM14 8C14 4.68629 11.3137 2 8 2V4C10.2091 4 12 5.79086 12 8H14ZM8 2C4.68629 2 2 4.68629 2 8H4C4 5.79086 5.79086 4 8 4V2ZM2 8C2 11.3137 4.68629 14 8 14V12C5.79086 12 4 10.2091 4 8H2Z" fill="white"/>
</svg>`);

export const ONETOUCH = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#2D9F93"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 13C10.7614 13 13 10.7614 13 8C13 5.23858 10.7614 3 8 3C5.23858 3 3 5.23858 3 8C3 10.7614 5.23858 13 8 13Z" stroke="white" stroke-width="2"/>
</svg>`);

// status icons
export const WON = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#2D9F93"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.1464 5.14645C11.3417 4.95118 11.6583 4.95118 11.8536 5.14645C12.0488 5.34171 12.0488 5.65829 11.8536 5.85355L6.85355 10.8536C6.65829 11.0488 6.34171 11.0488 6.14645 10.8536L4.14645 8.85355C3.95118 8.65829 3.95118 8.34171 4.14645 8.14645C4.34171 7.95118 4.65829 7.95118 4.85355 8.14645L6.5 9.79289L11.1464 5.14645Z" fill="white" stroke="white"/>
</svg>`);

export const LOST = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#EC3F3F"/>
<path d="M8 7.29289L10.1464 5.14645C10.3417 4.95118 10.6583 4.95118 10.8536 5.14645C11.0488 5.34171 11.0488 5.65829 10.8536 5.85355L8.70711 8L10.8536 10.1464C11.0488 10.3417 11.0488 10.6583 10.8536 10.8536C10.6583 11.0488 10.3417 11.0488 10.1464 10.8536L8 8.70711L5.85355 10.8536C5.65829 11.0488 5.34171 11.0488 5.14645 10.8536C4.95118 10.6583 4.95118 10.3417 5.14645 10.1464L7.29289 8L5.14645 5.85355C4.95118 5.65829 4.95118 5.34171 5.14645 5.14645C5.34171 4.95118 5.65829 4.95118 5.85355 5.14645L8 7.29289Z" fill="white" stroke="white"/>
</svg>
`);

export const SOLD = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#2196F3"/>
<path d="M8 7.29289L10.1464 5.14645C10.3417 4.95118 10.6583 4.95118 10.8536 5.14645C11.0488 5.34171 11.0488 5.65829 10.8536 5.85355L8.70711 8L10.8536 10.1464C11.0488 10.3417 11.0488 10.6583 10.8536 10.8536C10.6583 11.0488 10.3417 11.0488 10.1464 10.8536L8 8.70711L5.85355 10.8536C5.65829 11.0488 5.34171 11.0488 5.14645 10.8536C4.95118 10.6583 4.95118 10.3417 5.14645 10.1464L7.29289 8L5.14645 5.85355C4.95118 5.65829 4.95118 5.34171 5.14645 5.14645C5.34171 4.95118 5.65829 4.95118 5.85355 5.14645L8 7.29289Z" fill="white" stroke="white"/>
</svg>
`);
