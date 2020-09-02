import { getRoundedNumber, formatTime } from '@deriv/shared';
import { localize } from '@deriv/translations';

import { log } from './broadcast';

export const noop = () => {};

const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

export const isVirtual = (tokenInfo) => hasOwnProperty(tokenInfo, 'loginInfo') && tokenInfo.loginInfo.is_virtual;

export const tradeOptionToProposal = (trade_option, purchase_reference) =>
    trade_option.contractTypes.map((type) => {
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

export const getDirection = (ticks) => {
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

export const subscribeToStream = (observer, name, respHandler, request, registerOnce, type, unregister) =>
    new Promise((resolve) => {
        observer.register(
            name,
            (...args) => {
                respHandler(...args);
                resolve();
            },
            registerOnce,
            type && { type, unregister },
            true
        );
        request();
    });

export const registerStream = (observer, name, cb) => {
    if (observer.isRegistered(name)) {
        return;
    }
    observer.register(name, cb);
};

const maxRetries = 12;

const notifyRetry = (msg, error, delay) => log(`${msg}: ${error.error.msg_type}, ${localize('retrying in')} ${delay}s`);

const getBackoffDelay = (error, delayIndex) => {
    const offset = 0.5; // 500ms

    const errorCode = error && error.name;

    if (errorCode === 'DisconnectError') {
        return offset * 1000;
    }

    const maxExpTries = 4;
    const exponentialIncrease = 2 ** delayIndex + offset;

    if (errorCode === 'RateLimit' || delayIndex < maxExpTries) {
        notifyRetry(localize('Rate limit reached for'), error, exponentialIncrease);
        return exponentialIncrease * 1000;
    }

    const linearIncrease = exponentialIncrease + (maxExpTries - delayIndex + 1);

    notifyRetry(localize('Request failed for'), error, linearIncrease);
    return linearIncrease * 1000;
};

export const shouldThrowError = (e, types = [], delayIndex = 0) =>
    e &&
    (!types
        .concat(['CallError', 'WrongResponse', 'GetProposalFailure', 'RateLimit', 'DisconnectError'])
        .includes(e.name) ||
        (e.name !== 'DisconnectError' && delayIndex > maxRetries));

export const recoverFromError = (f, r, types, delayIndex) =>
    new Promise((resolve, reject) => {
        const promise = f();

        if (!promise) {
            resolve();
            return;
        }

        promise.then(resolve).catch((e) => {
            if (shouldThrowError(e, types, delayIndex)) {
                reject(e);
                return;
            }

            r(e.name, () => new Promise((delayPromise) => setTimeout(delayPromise, getBackoffDelay(e, delayIndex))));
        });
    });

export const doUntilDone = (f, types) => {
    let delayIndex = 0;

    return new Promise((resolve, reject) => {
        const repeat = () => {
            recoverFromError(f, (errorCode, makeDelay) => makeDelay().then(repeat), types, delayIndex++)
                .then(resolve)
                .catch(reject);
        };
        repeat();
    });
};

export const createDetails = (contract) => {
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

export const showDialog = (options) =>
    new Promise((resolve, reject) => {
        const $dialog = $('<div/>', { class: 'draggable-dialog', title: options.title });
        options.text.forEach((text) => $dialog.append(`<p style="margin: 0.7em;">${text}</p>`));
        const defaultButtons = [
            {
                text: localize('No'),
                class: 'button-secondary',
                click() {
                    $(this).dialog('close');
                    $(this).remove();
                    reject();
                },
            },
            {
                text: localize('Yes'),
                class: 'button-primary',
                click() {
                    $(this).dialog('close');
                    $(this).remove();
                    resolve();
                },
            },
        ];
        const dialogOptions = {
            autoOpen: false,
            classes: { 'ui-dialog-titlebar-close': 'icon-close' },
            closeText: '',
            height: 'auto',
            width: 600,
            modal: true,
            resizable: false,
            open() {
                $(this).parent().find('.ui-dialog-buttonset > button').removeClass('ui-button ui-corner-all ui-widget');
            },
        };
        Object.assign(dialogOptions, { buttons: options.buttons || defaultButtons });

        $dialog.dialog(dialogOptions);
        $dialog.dialog('open');
    });
