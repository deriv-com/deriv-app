import { getLanguage } from '@storage';
import { isProduction, getExtension } from '@utils';
import { translate as i18nTranslate } from '@i18n';

export const getQueryParams = (qs = '') => {
    if (!qs) return {};
    const data = {};
    qs.replace(/([^?=&]+)(=([^&]*))?/g, (a0, a1, a2, a3) => {
        data[a1] = a3;
    });
    return data;
};

export const getObjectValue = obj => obj[Object.keys(obj)[0]];

export const getUTCTime = date => {
    const dateObject = new Date(date);
    return `${`0${dateObject.getUTCHours()}`.slice(-2)}:${`0${dateObject.getUTCMinutes()}`.slice(
        -2
    )}:${`0${dateObject.getUTCSeconds()}`.slice(-2)}`;
};

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
