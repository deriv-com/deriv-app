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

export const setInnerHeightToVariable = () => {
    // Setting the inner height of the document to the --vh variable to fix the issue
    // of dynamic view height(vh) on mobile browsers for few scrollable components
    const vh = window.innerHeight;
    document.body.style.setProperty('--vh', `${vh}px`);
};
