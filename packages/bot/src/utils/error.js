import { observer as globalObserver } from './observer';
import { translate } from './lang/i18n';

export const createError = (name, message) => {
    const e = new Error(message);
    e.name = name;
    return e;
};

export const createErrorAndEmit = (name, message) => {
    globalObserver.emit('ui.log.warn', `${translate(message)}`);
    return createError(name, message);
};
