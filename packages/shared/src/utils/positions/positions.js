import moment from 'moment';

export const addCommaToNumber = (num, decimal_places) => {
    if (!num || isNaN(num)) {
        return num;
    }
    const n = String(decimal_places ? (+num).toFixed(decimal_places) : num);
    const p = n.indexOf('.');
    return n.replace(
        /\d(?=(?:\d{3})+(?:\.|$))/g,
        (m, i) => p <= 0 || i < p ? `${m},` : m
    );
};

export const getTimePercentage = (server_time, start_time, expiry_time) => {
    const duration_from_purchase = moment.duration(moment.unix(expiry_time).diff(moment.unix(start_time)));
    const duration_from_now = moment.duration(moment.unix(expiry_time).diff(server_time));
    let percentage = (duration_from_now.asMilliseconds() / duration_from_purchase.asMilliseconds()) * 100;

    if (percentage < 0.5) {
        percentage = 0;
    } else if (percentage > 100) {
        percentage = 100;
    }

    return Math.round(percentage);
};

export const getBarrierLabel = (contract_info, label_map) => {
    if (isDigitType(contract_info.contract_type)) {
        return label_map.target;
    }
    return label_map.barrier;
};

export const getBarrierValue = (contract_info, getDigitTypeMap) => {
    if (isDigitType(contract_info.contract_type)) {
        return getDigitTypeMap(contract_info)[contract_info.contract_type];
    }
    return addCommaToNumber(contract_info.barrier);
};

export const isDigitType = (contract_type) => (/digit/.test(contract_type.toLowerCase()));
