import moment        from 'moment';
import ContractUtils from 'deriv-shared/utils/contract';
import ObjectUtils   from 'deriv-shared/utils/object';
import ServerTime    from '_common/base/server_time';

export const getChartConfig = (contract_info) => {
    if (ObjectUtils.isEmptyObject(contract_info)) return null;
    const start       = contract_info.date_start;
    const end         = ContractUtils.getEndTime(contract_info);
    const granularity = getChartGranularity(start, end || null);
    const chart_type  = getChartType(start, end || null);

    return {
        chart_type     : contract_info.tick_count ? 'mountain' : chart_type,
        granularity    : contract_info.tick_count ? 0 : granularity,
        end_epoch      : end,
        start_epoch    : start,
        scroll_to_epoch: contract_info.purchase_time,
    };
};

const hour_to_granularity_map = [
    [1      , 0],
    [2      , 120],
    [6      , 600],
    [24     , 900],
    [5 * 24 , 3600],
    [30 * 24, 14400],
];

const getExpiryTime = (time) => time || ServerTime.get().unix();

export const getChartType = (start_time, expiry_time) => {
    const duration = moment.duration(moment.unix(getExpiryTime(expiry_time)).diff(moment.unix(start_time))).asHours();
    // use line chart if duration is equal or less than 1 hour
    return (duration <= 1) ? 'mountain' : 'candle';
};

export const getChartGranularity = (start_time, expiry_time) =>
    calculateGranularity(getExpiryTime(expiry_time) - start_time);

export const calculateGranularity = (duration) =>
    (hour_to_granularity_map.find(m => duration <= m[0] * 3600) || [null, 86400])[1];
