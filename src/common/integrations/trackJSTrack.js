import { TrackJS } from 'trackjs';
import { isProduction } from '../utils/tools';

export const default_errors_to_ignore = [
    'CallError',
    'WrongResponse',
    'GetProposalFailure',
    'RateLimit',
    'DisconnectError',
    'MarketIsClosed',
];

export function trackJSTrack(error) {
    let message;
    let code;

    if (typeof error === 'string') {
        message = error;
    } else if (error?.error && typeof error.error === 'object') {
        if (error?.error?.error && typeof error.error.error === 'object') {
            ({ message } = error.error.error);
            ({ code } = error.error.error);
        } else {
            ({ message } = error.error);
            ({ code } = error.error);
        }
    } else {
        ({ message } = error);
        ({ code } = error);
    }

    // Exceptions:
    if (message === undefined || message === "Cannot read property 'open_time' of undefined") {
        // SmartCharts error workaround, don't log nor show.
        return undefined;
    }

    if (isProduction()) {
      if (code && !default_errors_to_ignore.includes(code)){
          TrackJS.track(code || 'Unknown');
      }
    }
    return { code, message };
}
