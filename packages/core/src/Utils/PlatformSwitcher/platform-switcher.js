export const isBot = () =>  /^\/bot/.test(location.pathname) || /^localhost/.test(location.hostname);
