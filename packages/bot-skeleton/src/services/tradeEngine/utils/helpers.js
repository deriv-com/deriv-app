import { getRoundedNumber, formatTime } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { error as logError } from './broadcast';
import { observer as globalObserver } from '../../../utils/observer';

export const tradeOptionToProposal = (trade_option, purchase_reference) =>
    trade_option.contractTypes.map(type => {
        const proposal = {
            duration_unit: trade_option.duration_unit,
            basis: trade_option.basis,
            currency: trade_option.currency,
            symbol: trade_option.symbol,
            duration: trade_option.duration,
            amount: trade_option.amount,
            contract_type: type,
            passthrough: {
                contract_type: type,
                purchase_reference,
            },
        };
        if (trade_option.prediction !== undefined) {
            proposal.selected_tick = trade_option.prediction;
        }
        if (!['TICKLOW', 'TICKHIGH'].includes(type) && trade_option.prediction !== undefined) {
            proposal.barrier = trade_option.prediction;
        } else if (trade_option.barrierOffset !== undefined) {
            proposal.barrier = trade_option.barrierOffset;
        }
        if (trade_option.secondBarrierOffset !== undefined) {
            proposal.barrier2 = trade_option.secondBarrierOffset;
        }
        return proposal;
    });

export const getDirection = ticks => {
    const { length } = ticks;
    const [tickOld, tickNew] = ticks.slice(-2);

    let direction = '';
    if (length >= 2) {
        direction = tickOld.quote < tickNew.quote ? 'rise' : direction;
        direction = tickOld.quote > tickNew.quote ? 'fall' : direction;
    }

    return direction;
};

export const getLastDigit = (tick, pipSize) => Number(tick.toFixed(pipSize).slice(-1)[0]);

const getBackoffDelayInMs = (error, delay_index) => {
    const base_delay = 2.5;
    const max_delay = 15;
    const next_delay_in_seconds = Math.min(base_delay * delay_index, max_delay);

    const localize_args = { message_type: error.error.msg_type, delay: next_delay_in_seconds };
    const error_message =
        error?.name === 'RateLimit'
            ? localize('Rate limit reached for: {{ message_type }}, retrying in {{ delay }}s', localize_args)
            : localize('Request failed for: {{ message_type }}, retrying in {{ delay }}s', localize_args);

    logError(error_message);

    return next_delay_in_seconds * 1000;
};

export const shouldThrowError = (error, errors_to_ignore = []) => {
    if (!error) {
        return false;
    }

    const default_errors_to_ignore = [
        'CallError',
        'WrongResponse',
        'GetProposalFailure',
        'RateLimit',
        'DisconnectError',
    ];
    const is_ignorable_error = errors_to_ignore.concat(default_errors_to_ignore).includes(error.name);

    return !is_ignorable_error;
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
                    error.name,
                    () =>
                        new Promise(recoverResolve => {
                            const global_timeouts = globalObserver.getState('global_timeouts') ?? [];
                            global_timeouts.push(setTimeout(recoverResolve, getBackoffDelayInMs(error, delay_index)));
                            globalObserver.setState({ global_timeouts });
                        })
                );
            });
        } else {
            resolve();
        }
    });
};

export const doUntilDone = (promiseFn, errors_to_ignore) => {
    let delay_index = 1;

    return new Promise((resolve, reject) => {
        const repeatFn = () => {
            const recoverFn = (error_code, makeDelay) => {
                delay_index++;
                makeDelay().then(repeatFn);
            };

            recoverFromError(promiseFn, recoverFn, errors_to_ignore, delay_index)
                .then(resolve)
                .catch(reject);
        };

        repeatFn();
    });
};

export const createDetails = contract => {
    const { sell_price: sellPrice, buy_price: buyPrice, currency } = contract;
    const profit = getRoundedNumber(sellPrice - buyPrice, currency);
    const result = profit < 0 ? 'loss' : 'win';

    return [
        contract.transaction_ids.buy,
        +contract.buy_price,
        +contract.sell_price,
        profit,
        contract.contract_type,
        formatTime(parseInt(`${contract.entry_tick_time}000`), 'HH:mm:ss'),
        +contract.entry_tick,
        formatTime(parseInt(`${contract.exit_tick_time}000`), 'HH:mm:ss'),
        +contract.exit_tick,
        +(contract.barrier ? contract.barrier : 0),
        result,
    ];
};

export const getUUID = () => `${new Date().getTime() * Math.random()}`;
