import RenderHTML                       from 'react-render-html';
import { localize }                     from 'deriv-translations';
import { observer as globalObserver }   from './observer';

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

export const translate = input => {
    if (Array.isArray(input) && input.length > 0) {
        const stringToBeTranslated = input[0].replace(/\[_([0-9])\]/g, '%$1');
        let translatedString = localize(stringToBeTranslated);

        input.slice(1).forEach((replacement, index) => {
            const regex = new RegExp(`%${index + 1}`, 'g');
            translatedString = translatedString.replace(regex, replacement);
        });
        return RenderHTML(translatedString);
    }
    return localize(input);
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

export const trackAndEmitError = (message, object = {}) => {
    globalObserver.emit('ui.log.error', message);
    if (window.trackJs) {
        trackJs.track(`${message} - Error: ${JSON.stringify(object)}`);
    }
};

export const importExternal = url => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => resolve(window.external_global_component);
        script.onerror = reject;

        document.body.appendChild(script);
    });
};

export const delayCallbackByMs = (callback, ms) => {
    let timer = 0;
    return new Promise(resolve => {
        timer = setTimeout(() => {
            callback();
            resolve(timer);
        }, ms || 0);
    });
};
