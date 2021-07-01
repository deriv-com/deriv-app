import { observer as globalObserver } from './observer';

export const createError = (name, message) => {
    const e = new Error(message);
    e.name = name;
    e.code = name;
    return e;
};

export const trackAndEmitError = (message, object = {}) => {
    globalObserver.emit('ui.log.error', message);
    if (window.trackJs) {
        trackJs.track(`${message} - Error: ${JSON.stringify(object)}`);
    }
};
