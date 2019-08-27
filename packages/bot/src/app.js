import Bot from './app.jsx';

const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/br_|bot/.test(l.pathname)) return path;

    return `/${l.pathname.split('/')[1]}${/^\//.test(path) ? path : `/${path}`}`;
};

export function setBotPublicPath(path) {
    __webpack_public_path__ = path; // eslint-disable-line
}

setBotPublicPath(getUrlBase('/js/bot/'));

export default Bot;
