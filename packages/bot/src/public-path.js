const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    return `/${l.pathname.split('/')[1]}${/^\//.test(path) ? path : `/${path}`}`;
};

export function setBotPublicPath(path) {
    __webpack_public_path__ = path; // eslint-disable-line no-global-assign
}

setBotPublicPath(getUrlBase('/js/bot/'));
