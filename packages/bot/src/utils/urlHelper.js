
import { getLanguage } from 'deriv-translations';
import AppIds          from '../services/api/appIdResolver';

export const isProduction = () =>
    // Check if the hostname is one of the production domains
    document.location.hostname.replace(/^www./, '') in AppIds;

export const getExtension = () => {
    const host = document.location.hostname;
    const extension = host.split('.').slice(-1)[0];
    return host !== extension ? extension : '';
};

export const createUrl = options => {
    const getOption = property => Object.prototype.hasOwnProperty.call(options, property) && options[property];
    const language = getOption('addLanguage') ? `/${getLanguage()}` : '';
    const path = getOption('path') ? `/${getOption('path')}` : '';
    const htmlExtension = getOption('addHtmlExtension') ? '.html' : '';
    const subdomain = getOption('subdomain') ? `${getOption('subdomain')}.` : 'www.';
    if (isProduction()) {
        let domainExtension = `.${getExtension()}`;
        if (getOption('isNonBotPage')) {
            switch (document.location.hostname.replace(/^www./, '')) {
                case 'bot.binary.me':
                case 'binary.bot':
                    domainExtension = '.me';
                    break;
                default:
                    domainExtension = '.com';
                    break;
            }
        }
        return `${document.location.protocol}//${subdomain}binary${domainExtension}${language}${path}${htmlExtension}`;
    }
    return `https://${subdomain}binary.com${language}${path}${htmlExtension}`;
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
