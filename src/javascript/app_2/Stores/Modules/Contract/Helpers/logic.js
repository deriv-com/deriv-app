import moment     from 'moment';
import ServerTime from '_common/base/server_time';

const hour_to_granularity_map = [
    [1      , 0],
    [2      , 120],
    [6      , 600],
    [24     , 900],
    [5 * 24 , 3600],
    [30 * 24, 14400],
];

const getExpiryTime = (time) =>  time || ServerTime.get().unix();

export const getChartType = (start_time, expiry_time) => {
    const duration = moment.duration(moment.unix(getExpiryTime(expiry_time)).diff(moment.unix(start_time))).asHours();
    // use line chart if duration is less than 1 hour
    return (duration < 1) ? 'mountain' : 'candle';
};

export const getChartGranularity = (start_time, expiry_time) =>
    calculateGranularity(getExpiryTime(expiry_time) - start_time);

export const calculateGranularity = (duration) =>
    (hour_to_granularity_map.find(m => duration <= m[0] * 3600) || [null, 86400])[1];

export const getDisplayStatus = (contract_info) => {
    let status = 'purchased';
    if (isEnded(contract_info)) {
        status = contract_info.profit >= 0 ? 'won' : 'lost';
    }
    return status;
};

export const getEndSpotTime = (contract_info) => {
    const { date_expiry, exit_tick_time, sell_time, tick_count: is_tick_contract } = contract_info;
    if (isUserSold(contract_info)) {
        return (sell_time > date_expiry) ?
            date_expiry : sell_time;
    } else if (!is_tick_contract && (sell_time > date_expiry)) {
        return date_expiry;
    }
    return exit_tick_time;
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
    const { exit_tick_time, date_expiry, sell_time, tick_count : is_tick_contract, is_sold } = contract_info;

    if (is_tick_contract) return exit_tick_time;
    if (!is_sold) return undefined;

    return  sell_time <  date_expiry ? exit_tick_time : date_expiry;
};
