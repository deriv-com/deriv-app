import { get_hex_opacity } from './colors';

export const draw_shade = ({ ctx, start, exit, color }) => {
    const is_bottom_shade = start.top < exit.top;
    const shade_height = 120;

    const color_with_opacity = `${color}${get_hex_opacity(16)}`;
    const shade_left_point = start.left;

    const top = is_bottom_shade ? start.top : Math.max(start.top - shade_height, 0);
    const bottom = is_bottom_shade ? shade_height : start.top - top;
    const gradient = ctx.createLinearGradient(shade_left_point, top, shade_left_point, top + shade_height);

    gradient.addColorStop(0, is_bottom_shade ? color_with_opacity : 'rgba(255,255,255,0)');
    gradient.addColorStop(1, is_bottom_shade ? 'rgba(255,255,255,0)' : color_with_opacity);
    ctx.fillStyle = gradient;
    ctx.fillRect(shade_left_point, top, exit.left - shade_left_point, bottom);
};
