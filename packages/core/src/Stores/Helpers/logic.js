import moment from 'moment';
import { isAccumulatorContract, isEmptyObject, getEndTime } from '@deriv/shared';
import ServerTime from '../../_common/base/server_time';

export const getChartConfig = contract_info => {
    if (isEmptyObject(contract_info)) return null;
    const start = contract_info.date_start;
    const end = getEndTime(contract_info);
    const granularity = getChartGranularity(start, end || null);
    const chart_type = getChartType(start, end || null);
    const is_accumulator_contract = isAccumulatorContract(contract_info.contract_type);
    // setting start_epoch and scroll_to_epoch for accumulator contracts
    // when contract is open, we get no more than 10 last ticks from BE, so we show 10 ticks when tick_stream.length === 10
    const first_tick_epoch =
        is_accumulator_contract && !!contract_info.tick_stream?.length && contract_info.tick_stream[0].epoch;
    const should_show_10_last_ticks =
        is_accumulator_contract && contract_info.status === 'open' && contract_info.tick_stream.length === 10;
    const start_epoch = should_show_10_last_ticks ? first_tick_epoch : start;
    const scroll_to_epoch = should_show_10_last_ticks ? first_tick_epoch : contract_info.purchase_time;
    return {
        chart_type: contract_info.tick_count ? 'line' : chart_type,
        granularity: contract_info.tick_count ? 0 : granularity,
        end_epoch: end,
        start_epoch,
        scroll_to_epoch,
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
    return duration <= 1 ? 'line' : 'candles';
};

export const getChartGranularity = (start_time, expiry_time) =>
    calculateGranularity(getExpiryTime(expiry_time) - start_time);

export const calculateGranularity = duration =>
    (hour_to_granularity_map.find(m => duration <= m[0] * 3600) || [null, 86400])[1];

export const getBuyPrice = contract_store => {
    return contract_store.contract_info.buy_price;
};

/**
 * Set contract update form initial values
 * @param {object} contract_update - contract_update response
 * @param {object} limit_order - proposal_open_contract.limit_order response
 */
