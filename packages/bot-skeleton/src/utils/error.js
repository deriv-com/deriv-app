import { observer as globalObserver } from './observer';

const trackAndEmitError = (message, object = {}) => {
    globalObserver.emit('ui.log.error', message);
    if (window.trackJs) {
        trackJs.track(`${message} - Error: ${JSON.stringify(object)}`);
    }
};

export default trackAndEmitError;
