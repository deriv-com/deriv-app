import moment from 'moment';
import { isEmptyObject, isUserSold, ServerTime } from '@deriv/shared';

const getExpiryTime = time => time || ServerTime.get().unix();

export const getChartType = (start_time, expiry_time) => {
    const duration = moment.duration(moment.unix(getExpiryTime(expiry_time)).diff(moment.unix(start_time))).asHours();
    // use line chart if duration is equal or less than 1 hour
    return duration <= 1 ? 'mountain' : 'candle';
};

export const isContractElapsed = (contract_info, tick) => {
    if (isEmptyObject(tick) || isEmptyObject(contract_info)) return false;
    const end_time = getEndTime(contract_info);
    if (end_time && tick.epoch) {
        const seconds = moment.duration(moment.unix(tick.epoch).diff(moment.unix(end_time))).asSeconds();
        return seconds >= 2;
    }
    return false;
};

export const isEndedBeforeCancellationExpired = contract_info =>
    !!(contract_info.cancellation && getEndTime(contract_info) < contract_info.cancellation.date_expiry);

export const isUserCancelled = contract_info => contract_info.status === 'cancelled';

export const isCancellationExpired = contract_info =>
    !!(contract_info.cancellation.date_expiry < ServerTime.get().unix());

export const getEndTime = contract_info => {
    const {
        exit_tick_time,
        date_expiry,
        is_expired,
        is_path_dependent,
        sell_time,
        status,
        tick_count: is_tick_contract,
    } = contract_info;

    const is_finished = is_expired && status !== 'open';

    if (!is_finished && !isUserSold(contract_info) && !isUserCancelled(contract_info)) return undefined;

    if (isUserSold(contract_info)) {
        return sell_time > date_expiry ? date_expiry : sell_time;
    } else if (!is_tick_contract && sell_time > date_expiry) {
        return date_expiry;
    }

    return date_expiry > exit_tick_time && !+is_path_dependent ? date_expiry : exit_tick_time;
};

export const getBuyPrice = contract_store => {
    return contract_store.contract_info.buy_price;
};

/**
 * Set contract update form initial values
 * @param {object} contract_update - contract_update response
 * @param {object} limit_order - proposal_open_contract.limit_order response
 */
