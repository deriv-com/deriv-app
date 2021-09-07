import moment from 'moment';
import { isEmptyObject, isUserSold, getLimitOrderAmount } from '@deriv/shared';
import ServerTime from '_common/base/server_time';

export const getChartConfig = contract_info => {
    if (isEmptyObject(contract_info)) return null;
    const start = contract_info.date_start;
    const end = getEndTime(contract_info);
    const granularity = getChartGranularity(start, end || null);
    const chart_type = getChartType(start, end || null);

    return {
        chart_type: contract_info.tick_count ? 'mountain' : chart_type,
        granularity: contract_info.tick_count ? 0 : granularity,
        end_epoch: end,
        start_epoch: start,
        scroll_to_epoch: contract_info.purchase_time,
    };
};

const hour_to_granularity_map = [
    [1, 0],
    [2, 120],
    [6, 600],
    [24, 900],
    [5 * 24, 3600],
    [30 * 24, 14400],
];

const getExpiryTime = time => time || ServerTime.get().unix();

export const getChartType = (start_time, expiry_time) => {
    const duration = moment.duration(moment.unix(getExpiryTime(expiry_time)).diff(moment.unix(start_time))).asHours();
    // use line chart if duration is equal or less than 1 hour
    return duration <= 1 ? 'mountain' : 'candle';
};

export const getChartGranularity = (start_time, expiry_time) =>
    calculateGranularity(getExpiryTime(expiry_time) - start_time);

export const calculateGranularity = duration =>
    (hour_to_granularity_map.find(m => duration <= m[0] * 3600) || [null, 86400])[1];

export const isContractElapsed = (contract_info, tick) => {
    if (isEmptyObject(tick) || isEmptyObject(contract_info)) return false;
    const end_time = getEndTime(contract_info);
    if (end_time && tick.epoch) {
        const seconds = moment.duration(moment.unix(tick.epoch).diff(moment.unix(end_time))).asSeconds();
        return seconds >= 2;
    }
    return false;
};

export const isSoldBeforeStart = contract_info =>
    contract_info.sell_time && +contract_info.sell_time < +contract_info.date_start;

export const isStarted = contract_info =>
    !contract_info.is_forward_starting || contract_info.current_spot_time > contract_info.date_start;

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
export const getContractUpdateConfig = ({ contract_update, limit_order }) => {
    const { stop_loss, take_profit } = getLimitOrderAmount(limit_order || contract_update);

    return {
        // convert stop_loss, take_profit value to string for validation to work
        contract_update_stop_loss: stop_loss ? Math.abs(stop_loss).toString() : '',
        contract_update_take_profit: take_profit ? take_profit.toString() : '',
        has_contract_update_stop_loss: !!stop_loss,
        has_contract_update_take_profit: !!take_profit,
    };
};
