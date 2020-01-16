export const calc_scale = (zoom) => {
    return zoom ? Math.max(Math.min(Math.sqrt(zoom / 18), 1.2),  0.8) : 1;
};

const hex_map = [];
export const calc_opacity = (from, to) => {
    if (hex_map.length === 0) {
        for (let i = 255; i >= 0; --i) {
            hex_map[i] = (i < 16 ? '0' : '') + i.toString(16);
        }
    }
    const opacity = Math.floor(
        Math.min(
            Math.max(to - from - 10, 0) / 6,
            1
        ) * 255
    );
    return hex_map[opacity];
};
