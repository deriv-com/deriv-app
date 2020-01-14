import moment      from 'moment';
import ObjectUtils from '../object';

export const getDisplayStatus = (contract_info) => {
    let status = 'purchased';
    if (isEnded(contract_info)) {
        status = contract_info.profit >= 0 ? 'won' : 'lost';
    }
    return status;
};

export const isContractElapsed = (contract_info, tick) => {
    if (ObjectUtils.isEmptyObject(tick) || ObjectUtils.isEmptyObject(contract_info)) return false;
    const end_time = getEndTime(contract_info);
    if (end_time && tick.epoch) {
        const seconds = moment.duration(
            moment.unix(tick.epoch).diff(moment.unix(end_time))
        ).asSeconds();
        return (seconds >= 2);
    }
    return false;
};

export const getFinalPrice = (contract_info) => (
    +(contract_info.sell_price || contract_info.bid_price)
);

export const getIndicativePrice = (contract_info) => (
    getFinalPrice(contract_info) && isEnded(contract_info) ?
        getFinalPrice(contract_info) :
        (+contract_info.bid_price || null)
);

export const getLastTickFromTickStream = (tick_stream = []) => (
    tick_stream[tick_stream.length - 1] || {}
);

export const isEnded = (contract_info) => !!(
    (contract_info.status && contract_info.status !== 'open') ||
    contract_info.is_expired        ||
    contract_info.is_settleable
);

export const isSoldBeforeStart = (contract_info) => (
    contract_info.sell_time && +contract_info.sell_time < +contract_info.date_start
);

export const isStarted = (contract_info) => (
    !contract_info.is_forward_starting || contract_info.current_spot_time > contract_info.date_start
);

export const isUserSold = (contract_info) => (
    contract_info.status === 'sold'
);

export const isValidToSell = (contract_info) => (
    !isEnded(contract_info) && !isUserSold(contract_info) && +contract_info.is_valid_to_sell === 1
);

export const getEndTime = (contract_info) => {
    const {
        exit_tick_time,
        date_expiry,
        is_expired,
        is_path_dependent,
        sell_time,
        status,
        tick_count: is_tick_contract,
    } = contract_info;

    const is_finished = is_expired && (status !== 'open');

    if (!is_finished && !isUserSold(contract_info)) return undefined;

    if (isUserSold(contract_info)) {
        return (sell_time > date_expiry) ?
            date_expiry : sell_time;
    } else if (!is_tick_contract && (sell_time > date_expiry)) {
        return date_expiry;
    }

    return (date_expiry > exit_tick_time && !(+is_path_dependent)) ? date_expiry : exit_tick_time;
};
