import Bot from './app.jsx';

export function setBotPublicPath(path) {
    __webpack_public_path__ = path; // eslint-disable-line
}

setBotPublicPath('/js/bot/');

export default Bot;
