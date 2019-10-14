export const isBot = () => /^\/bot/.test(location.pathname) || /^localhost/.test(location.hostname);

export const isMT5 = () => /^\/mt5/.test(location.pathname);
