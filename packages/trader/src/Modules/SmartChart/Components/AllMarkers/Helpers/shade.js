export const draw_shade = ({ ctx, color, end, is_sold, start }) => {
    if (!is_sold && end.visible) {
        const is_bottom_shade = start.top < end.top;
        const shadow_height = 120;
        // 16% opacity
        const color_with_opacity = `${color}29`;

        const top = is_bottom_shade ? start.top : Math.max(start.top - shadow_height, 0);
        const bottom = is_bottom_shade ? shadow_height : start.top - top;
        const gradient = ctx.createLinearGradient(start.left, top, start.left, top + shadow_height);

        gradient.addColorStop(0, is_bottom_shade ? color_with_opacity : 'rgba(255,255,255,0)');
        gradient.addColorStop(1, is_bottom_shade ? 'rgba(255,255,255,0)' : color_with_opacity);
        ctx.fillStyle = gradient;
        ctx.fillRect(start.left, top, end.left - start.left, bottom);
    }
};
