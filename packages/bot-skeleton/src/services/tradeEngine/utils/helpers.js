import { findValueByKeyRecursively } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { error as logError } from './broadcast';
import { Services } from '../state';

const getBackoffDelayInMs = (error, delay_index) => {
    const base_delay = 2.5;
    const max_delay = 15;
    const next_delay_in_seconds = Math.min(base_delay * delay_index, max_delay);

    if (error.error.code === 'RateLimit') {
        logError(
            localize('You are rate limited for: {{ message_type }}, retrying in {{ delay }}s (ID: {{ request }})', {
                message_type: error.msg_type,
                delay: next_delay_in_seconds,
                request: error.echo_req.req_id,
            })
        );
    } else if (error.error.code === 'DisconnectError') {
        logError(
            localize('You are disconnected, retrying in {{ delay }}s', {
                delay: next_delay_in_seconds,
            })
        );
    } else if (error.error.code === 'MarketIsClosed') {
        logError(localize('This market is presently closed.'));
    } else {
        logError(
            localize('Request failed for: {{ message_type }}, retrying in {{ delay }}s', {
                message_type: error.msg_type || localize('unknown'),
                delay: next_delay_in_seconds,
            })
        );
    }

    return next_delay_in_seconds * 1000;
};

const updateErrorMessage = error => {
    if (error.error?.code === 'InputValidationFailed') {
        if (error.error.details?.duration) {
            error.error.message = localize('Duration must be a positive integer');
        }
        if (error.error.details?.amount) {
            error.error.message = localize('Amount must be a positive number.');
        }
    }
};

const shouldThrowError = (error, errors_to_ignore = []) => {
    if (!error.error) {
        return false;
    }

    const default_errors_to_ignore = [
        'CallError',
        'WrongResponse',
        'GetProposalFailure',
        'RateLimit',
        'DisconnectError',
        'MarketIsClosed',
    ];
    updateErrorMessage(error);
    const is_ignorable_error = errors_to_ignore.concat(default_errors_to_ignore).includes(error.error.code);

    return !is_ignorable_error;
};

export const doUntilDone = (promiseFn, errors_to_ignore) => {
    let delay_index = 1;

    return new Promise((resolve, reject) => {
        const recoverFn = (error_code, makeDelay) => {
            delay_index++;
            makeDelay().then(repeatFn);
        };

        const repeatFn = () => {
            recoverFromError(promiseFn, recoverFn, errors_to_ignore, delay_index).then(resolve).catch(reject);
        };

        repeatFn();
    });
};

export const recoverFromError = (promiseFn, recoverFn, errors_to_ignore, delay_index) => {
    return new Promise((resolve, reject) => {
        const promise = promiseFn();

        if (promise) {
            promise.then(resolve).catch(error => {
                if (shouldThrowError(error, errors_to_ignore)) {
                    reject(error);
                    return;
                }
                recoverFn(
                    error.error.code,
                    () =>
                        new Promise(recoverResolve => {
                            const getGlobalTimeouts = () => Services.observer.getState('global_timeouts') ?? [];

                            const timeout = setTimeout(() => {
                                const global_timeouts = getGlobalTimeouts();
                                delete global_timeouts[timeout];
                                Services.observer.setState(global_timeouts);
                                recoverResolve();
                            }, getBackoffDelayInMs(error, delay_index));

                            const global_timeouts = getGlobalTimeouts();
                            const cancellable_timeouts = ['buy'];
                            const msg_type = findValueByKeyRecursively(error, 'msg_type');

                            global_timeouts[timeout] = {
                                is_cancellable: cancellable_timeouts.includes(msg_type),
                                msg_type,
                            };

                            Services.observer.setState({ global_timeouts });
                        })
                );
            });
        } else {
            resolve();
        }
    });
};
