/*
* These functions exist because we want to refresh the browser page on switch between Bot and the rest of the platforms.
* */

export const isBot = () => /^\/bot/.test(window.location.pathname) || (/^\/(br_)/.test(window.location.pathname) && window.location.pathname.split('/')[2] === 'bot');

export const isMT5 = () => /^\/mt5/.test(window.location.pathname) || (/^\/(br_)/.test(window.location.pathname) && window.location.pathname.split('/')[2] === 'mt5');
