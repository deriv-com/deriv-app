import filesaver from 'file-saver';
import { APP_ID_MAP, MAX_MOBILE_WIDTH } from '@constants';
import { translate as i18nTranslate } from '@i18n';

export const parseQueryString = () => {
    if (typeof window === 'undefined') {
        return {};
    }
    const str = window.location.search;
    const objURL = {};
    str.replace(/([^?=&]+)(=([^&]*))?/g, (a0, a1, a2, a3) => {
        objURL[a1] = a3;
    });
    return objURL;
};

export const isProduction = () => document.location.hostname.replace(/^www./, '') in APP_ID_MAP.production;

export const getRelatedDeriveOrigin = () => {
    let origin = 'https://app.deriv.com';
    let is_official = false;
    const split_host_name = /^(staging-)?(bot.deriv.)([a-zA-Z]*)$/.exec(window.location.hostname);
    let prefix = '';
    let extension = 'com';
    if (split_host_name) {
        prefix = split_host_name[1] || '';
        extension = split_host_name[3] || 'com';
        if (['com', 'me', 'be'].includes(extension)) {
            is_official = true;
            origin = `https://${prefix}app.deriv.${extension}`;
        }
    }
    return { origin, extension, prefix, is_official };
};

export const getExtension = () => {
    const host = document.location.hostname;
    const extension = host.split('.').slice(-1)[0];
    return host !== extension ? extension : '';
};

export const generateDerivLink = (path, ...queries) => {
    const redirect_query = `ext_platform_url=${encodeURIComponent(window.location.origin)}&lang=${localStorage.getItem(
        'lang'
    )}`;
    queries.push(redirect_query);
    return `${getRelatedDeriveOrigin().origin}/${path}?${queries.join('&')}`;
};

export const getDomainAppId = () => {
    const hostName = document.location.hostname;
    const hostname = hostName.replace(/^www./, '');

    // eslint-disable-next-line no-nested-ternary
    return hostname in APP_ID_MAP.production
        ? APP_ID_MAP.production[hostname]
        : // eslint-disable-next-line no-nested-ternary
        hostname in APP_ID_MAP.staging
            ? APP_ID_MAP.staging[hostname]
            : hostname in APP_ID_MAP.dev
                ? APP_ID_MAP.dev[hostname]
                : 29864;
};

export const queryToObjectArray = queryStr => {
    const tokens = [];

    Object.keys(queryStr).forEach(o => {
        if (!/\d$/.test(o)) return;
        const splited_query = /^([a-zA-Z]*)([\d]*)?/.exec(o);
        let key = splited_query[1];
        const index = splited_query[2];
        key = key === 'acct' ? 'accountName' : key; // Make it consistent with src/storage.js naming
        if (index) {
            if (index <= tokens.length) {
                tokens[index - 1][key] = queryStr[o];
            } else {
                tokens.push({});
                tokens[index - 1][key] = queryStr[o];
            }
        }
    });
    return tokens;
};

export const isMobile = () => window.innerWidth <= MAX_MOBILE_WIDTH;

export const isDesktop = () => window.innerWidth > MAX_MOBILE_WIDTH;

export const isNumber = num => num !== '' && Number.isFinite(Number(num));

export const restrictInputCharacter = ({ whitelistRegEx, input }) => input.match(new RegExp(whitelistRegEx));

export const saveAs = ({ data, filename, type }) => {
    const blob = new Blob([data], { type });
    filesaver.saveAs(blob, filename);
};
export const appendRow = (trade, state, isDesc = false) => ({
    id: state.id + 1,
    rows: isDesc
        ? [
            {
                ...trade,
                id: state.id + 1,
            },
            ...state.rows,
        ]
        : [
            ...state.rows,
            {
                ...trade,
                id: state.id + 1,
            },
        ],
});

export const updateRow = (prevRowIndex, trade, state) => ({
    id: state.id,
    rows: [
        ...state.rows.slice(0, prevRowIndex),
        {
            ...trade,
            id: state.id,
        },
    ],
});

const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

export const isVirtual = tokenInfo => hasOwnProperty(tokenInfo, 'loginInfo') && tokenInfo.loginInfo.is_virtual;

export const getQueryParams = (qs = '') => {
    if (!qs) return {};
    const data = {};
    qs.replace(/([^?=&]+)(=([^&]*))?/g, (a0, a1, a2, a3) => {
        data[a1] = a3;
    });
    return data;
};

export const getObjectValue = obj => obj[Object.keys(obj)[0]];

export const durationToSecond = duration => {
    const parsedDuration = duration.match(/^([0-9]+)([stmhd])$/);
    if (!parsedDuration) {
        return 0;
    }
    const durationValue = parseFloat(parsedDuration[1]);
    const durationType = parsedDuration[2];
    if (durationType === 's') {
        return durationValue;
    }
    if (durationType === 't') {
        return durationValue * 2;
    }
    if (durationType === 'm') {
        return durationValue * 60;
    }
    if (durationType === 'h') {
        return durationValue * 60 * 60;
    }
    if (durationType === 'd') {
        return durationValue * 60 * 60 * 24;
    }
    return 0;
};

export const translate = (input, params = []) => {
    if (!params.length) return i18nTranslate(input);

    const stringToBeTranslated = input.replace(/\{\$({0-9])\}/gi, '%$1');
    let translatedString = i18nTranslate(stringToBeTranslated);

    params.forEach((replacement, index) => {
        if (translatedString && typeof translatedString === 'string') {
            // eslint-disable-next-line no-useless-escape
            translatedString = translatedString.replaceAll(`\{\$${index}\}`, replacement);
        }
    });

    return translatedString;
};

export const showSpinnerInButton = $buttonElement => {
    $buttonElement
        .html(() => {
            const barspinner = $('<div class="barspinner white" />');
            Array.from(new Array(5)).forEach((x, i) => {
                const rect = $(`<div class="rect${i + 1}" />`);
                barspinner.append(rect);
            });
            return barspinner;
        })
        .prop('disabled', true);
};

export const removeSpinnerInButton = ($buttonElement, initialText) => {
    $buttonElement.html(() => initialText).prop('disabled', false);
};
