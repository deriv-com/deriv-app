import { setSmartChartsPublicPath } from '@deriv/deriv-charts';
import { setSmartChartsPublicPath as setSmartChartsAlphaPublicPath } from '@deriv/deriv-charts-alpha';

const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    const get_path = path.startsWith('/') ? path : `/${path}`;

    return `/${l.pathname.split('/')[1]}${get_path}`;
};

export function setBotPublicPath(path: string) {
    __webpack_public_path__ = path; // eslint-disable-line no-global-assign
}

export const getImageLocation = (image_name: string) => getUrlBase(`/public/images/common/${image_name}`);

// eslint-disable-next-line import/no-mutable-exports
let initSurvicateCalled = false;
const initSurvicate = () => {
    initSurvicateCalled = true;
    if (document.getElementById('dbot-survicate')) {
        const survicate_box = document.getElementById('survicate-box') || undefined;
        if (survicate_box) {
            survicate_box.style.display = 'block';
        }
        return;
    }

    const script = document.createElement('script');
    script.id = 'dbot-survicate';
    script.async = true;
    script.src = 'https://survey.survicate.com/workspaces/83b651f6b3eca1ab4551d95760fe5deb/web_surveys.js';
    document.body.appendChild(script);
};

export { initSurvicate, initSurvicateCalled };

setBotPublicPath(getUrlBase('/'));
setSmartChartsPublicPath(getUrlBase('/js/smartcharts/'));
setSmartChartsAlphaPublicPath(getUrlBase('/js/smartchartsalpha/'));
