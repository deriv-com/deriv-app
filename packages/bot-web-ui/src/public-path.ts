import { setSmartChartsPublicPath } from '@deriv/deriv-charts';

const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    return `/${l.pathname.split('/')[1]}${/^\//.test(path) ? path : `/${path}`}`;
};

export function setBotPublicPath(path: string) {
    __webpack_public_path__ = path; // eslint-disable-line no-global-assign
}

export const getImageLocation = (image_name: string) => getUrlBase(`/public/images/common/${image_name}`);

setBotPublicPath(getUrlBase('/'));
setSmartChartsPublicPath(getUrlBase('/js/smartcharts/'));
