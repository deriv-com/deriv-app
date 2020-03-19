/*
 * These functions exist because we want to refresh the browser page on switch between Bot and the rest of the platforms.
 * */

export const isBot = () =>
    /^\/bot/.test(window.location.pathname) ||
    (/^\/(br_)/.test(window.location.pathname) && window.location.pathname.split('/')[2] === 'bot');

export const isMT5 = () =>
    /^\/mt5/.test(window.location.pathname) ||
    (/^\/(br_)/.test(window.location.pathname) && window.location.pathname.split('/')[2] === 'mt5');

export const getPlatformIcon = () => {
    return [...(isBot() ? ['IcBrandDbot'] : []), ...(isMT5() ? ['IcBrandDmt5'] : []), 'IcBrandDtrader'][0];
};

export const getPlatformName = () => {
    return [...(isBot() ? ['DBot'] : []), ...(isMT5() ? ['DMT5'] : []), 'DTrader'][0];
};
