import moment       from 'moment';
import { localize } from '_common/localize';

export const addCommaToNumber = num => {
    const n = String(num);
    const p = n.indexOf('.');
    return n.replace(
        /\d(?=(?:\d{3})+(?:\.|$))/g,
        (m, i) => p <= 0 || i < p ? `${m},` : m
    );
};

export const getTimePercentage = (current_time, date_start, expiry_time) => {
    const duration_from_purchase = moment.duration(moment.unix(expiry_time).diff(moment.unix(date_start)));
    const duration_from_now = moment.duration(moment.unix(expiry_time).diff(current_time));
    let percentage = (duration_from_now.asMilliseconds() / duration_from_purchase.asMilliseconds()) * 100;

    if (percentage < 0.5) {
        percentage = 0;
    } else if (percentage > 100) {
        percentage = 100;
    }

    return Math.round(percentage);
};

export const getBarrierLabel = (contract_info) => {
    if (isDigitType(contract_info.contract_type)) {
        return localize('Target');
    }
    return localize('Barrier');
};

export const getBarrierValue = (contract_info) => {
    if (isDigitType(contract_info.contract_type)) {
        return digitTypeMap(contract_info)[contract_info.contract_type];
    }
    return addCommaToNumber(contract_info.barrier);
};

const digitTypeMap = (contract_info) => ({
    DIGITDIFF : localize('Not [_1]', contract_info.barrier),
    DIGITEVEN : localize('Even'),
    DIGITMATCH: localize('Equals [_1]', contract_info.barrier),
    DIGITODD  : localize('Odd'),
    DIGITOVER : localize('Over [_1]', contract_info.barrier),
    DIGITUNDER: localize('Under [_1]', contract_info.barrier),
});

const isDigitType = (contract_type) => (/digit/.test(contract_type.toLowerCase()));
