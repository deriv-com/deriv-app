export const getMainContentHeight = () => {
    return getComputedStyle(document.getElementsByClassName('bot')[0]).getPropertyValue('--bot-content-height');
};

export const getMainContentWidth = () => {
    return getComputedStyle(document.getElementsByClassName('bot')[0]).getPropertyValue('--bot-content-width');
};

export const setMainContentWidth = is_run_panel_open => {
    const width = is_run_panel_open ? 'calc(100vw - 366px)' : 'calc(100vw - 16px)';
    return document.getElementsByClassName('bot')[0].style.setProperty('--bot-content-width', width);
};
