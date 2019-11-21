export const getRunPanelWidth = (is_open) => {
    return is_open ? getComputedStyle(document.getElementsByClassName('bot')[0]).getPropertyValue('--run-panel-width') : 0;
}

export const getToolbarHeight = () => {
    return getComputedStyle(document.getElementsByClassName('bot')[0]).getPropertyValue('--toolbar_height');
}