export const shadowed_text = ({ ctx, is_dark_theme, text, left, top, scale }) => {
    ctx.textAlign = 'center';
    ctx.font = `bold ${Math.floor(scale * 10)}px IBM Plex Sans`;
    
    const is_firefox = (navigator.userAgent.search('Firefox') > 0);
    if (!is_firefox) {
        ctx.shadowColor = is_dark_theme ? 'rgba(16,19,31,1)' : 'rgba(255,255,255,1)';
        ctx.shadowBlur = 12;
    }

    // fillText once in firefox due to disabling of text shadows,
    // for default cases where its enabled, set to 5 (to add blur intensity)
    for (let i = 0; i < (is_firefox ? 1 : 5); ++i) {
        ctx.fillText(text, left, top);
    }
};
