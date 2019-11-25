export const getRunPanelWidth = (is_open) => {
    return is_open ? getComputedStyle(document.getElementsByClassName('bot')[0]).getPropertyValue('--run-panel-width') : 0;
}

export const getMainContentHeight = () => {
    return getComputedStyle(document.getElementsByClassName('bot')[0]).getPropertyValue('--bot-content-height');
}