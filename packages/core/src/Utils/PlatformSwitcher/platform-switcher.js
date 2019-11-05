/*
* These functions exist because we want to refresh the browser page on switch between Bot and the rest of the platforms.
* */

export const isBot = () => /^\/bot/.test(location.pathname);

export const isMT5 = () => /^\/mt5/.test(location.pathname);
