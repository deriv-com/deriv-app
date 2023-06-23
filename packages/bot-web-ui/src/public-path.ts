import { setSmartChartsPublicPath } from '@deriv/deriv-charts';

const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    const get_path = /^\//.test(path) ? path : `/${path}`;

    return `/${l.pathname.split('/')[1]}${get_path}`;
};

export function setBotPublicPath(path: string) {
    __webpack_public_path__ = path; // eslint-disable-line no-global-assign
}

export const getImageLocation = (image_name: string) => getUrlBase(`/public/images/common/${image_name}`);

setBotPublicPath(getUrlBase('/'));
setSmartChartsPublicPath(getUrlBase('/js/smartcharts/'));
