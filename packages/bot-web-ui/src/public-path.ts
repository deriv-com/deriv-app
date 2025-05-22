import { getLoginId } from '@deriv/bot-skeleton/src/services/api/appId';

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

declare global {
    interface Window {
        Survicate?: {
            track: (attribute: string, value: string) => void;
        };
    }
}

const setSurvicateUserAttributes = (country: string, type: string, creationDate: string) => {
    if (window.Survicate) {
        if (country) window.Survicate.track('userCountry', country);
        if (type) window.Survicate.track('accountType', type);
        if (creationDate) window.Survicate.track('accountCreationDate', creationDate);
    }
};

// eslint-disable-next-line import/no-mutable-exports
let initSurvicateCalled = false;

const loadSurvicateScript = (callback: () => void) => {
    const script = document.createElement('script');
    script.id = 'dbot-survicate';
    script.async = true;
    script.src = 'https://survey.survicate.com/workspaces/83b651f6b3eca1ab4551d95760fe5deb/web_surveys.js';
    script.onload = callback;

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
    } else {
        document.body.appendChild(script);
    }
};

const initSurvicate = () => {
    if (initSurvicateCalled) return;
    initSurvicateCalled = true;
    const active_loginid = getLoginId();
    const client_accounts = JSON.parse(localStorage.getItem('client.accounts') as string) || undefined;

    const setAttributesIfAvailable = () => {
        if (active_loginid && client_accounts) {
            const { residence, account_type, created_at } = client_accounts[active_loginid] || {};
            setSurvicateUserAttributes(residence, account_type, created_at);
        }
    };

    if (document.getElementById('dbot-survicate')) {
        const survicateBox = document.getElementById('survicate-box');
        if (survicateBox) {
            survicateBox.style.display = 'block';
        }
        setAttributesIfAvailable();
    } else {
        loadSurvicateScript(setAttributesIfAvailable);
    }
};

export { initSurvicate, initSurvicateCalled };

setBotPublicPath(getUrlBase('/'));
