const moment      = require('moment');
const formatMoney = require('../../../common/currency').formatMoney;
const localize    = require('../../../../_common/localize').localize;
const LocalStore  = require('../../../../_common/storage').LocalStore;

const RealityCheckData = (() => {
    const reality_object = {};

    const resetInvalid = () => {
        const ack      = get('ack');
        const interval = +(get('interval'));
        if (ack !== 0 && ack !== 1) {
            set('ack', 0);
        }
        if (!interval) {
            set('interval', 600000);
        }
    };

    const summaryData = (data) => {
        const start_time   = moment.utc(new Date(data.start_time * 1000));
        const current_time = moment.utc();

        const session_duration = moment.duration(current_time.diff(start_time));
        const duration_string  = localize('[_1] days [_2] hours [_3] minutes', [
            session_duration.get('days'),
            session_duration.get('hours'),
            session_duration.get('minutes'),
        ]);

        const turnover    = +(data.buy_amount) + (+(data.sell_amount));
        const profit_loss = +(data.sell_amount) - (+(data.buy_amount));

        return {
            start_time_string: localize('Your trading statistics since [_1].', `${start_time.format('YYYY-MM-DD HH:mm:ss')} GMT`),
            login_time       : `${start_time.format('YYYY-MM-DD HH:mm:ss')} GMT`,
            current_time     : `${current_time.format('YYYY-MM-DD HH:mm:ss')} GMT`,
            session_duration : duration_string,
            loginid          : data.loginid,
            currency         : data.currency,
            turnover         : formatMoney(data.currency, +turnover, 1),
            profit_loss      : formatMoney(data.currency, +profit_loss, 1),
            contracts_bought : data.buy_count,
            contracts_sold   : data.sell_count,
            open_contracts   : data.open_contract_count,
            potential_profit : formatMoney(data.currency, +(data.potential_profit), 1),
        };
    };

    const set = (key, value) => {
        reality_object[key] = value;
        return LocalStore.set(`reality_check.${key}`, value);
    };

    // use this function to get variables that have values
    const get = (key) => {
        let value = reality_object[key] || LocalStore.get(`reality_check.${key}`) || '';
        if (+value === 1 || +value === 0 || value === 'true' || value === 'false') {
            value = JSON.parse(value || false);
        }
        return value;
    };

    const clear = () => {
        // clear all reality check values from local storage
        Object.keys(localStorage).forEach((c) => {
            if (/^reality_check\./.test(c)) {
                LocalStore.set(c, '');
            }
        });

        const hash = window.location.hash;
        if (/no-reality-check/.test(hash)) {
            window.location.hash = hash.replace('no-reality-check', '');
        }
    };

    return {
        resetInvalid,
        summaryData,
        set,
        get,
        clear,
    };
})();

module.exports = RealityCheckData;
