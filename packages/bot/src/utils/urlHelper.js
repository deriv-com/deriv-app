
import AppIds          from '../services/api/appIdResolver';

export const isProduction = () =>
    // Check if the hostname is one of the production domains
    document.location.hostname.replace(/^www./, '') in AppIds;

export const getExtension = () => {
    const host = document.location.hostname;
    const extension = host.split('.').slice(-1)[0];
    return host !== extension ? extension : '';
};

export const parseQueryString = () => {
    if (typeof window === 'undefined') {
        return {};
    }
    const str = window.location.search;
    const objURL = {};
    str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), (a0, a1, a2, a3) => {
        objURL[a1] = a3;
    });
    return objURL;
};
