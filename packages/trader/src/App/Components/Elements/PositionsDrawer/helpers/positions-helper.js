import moment from 'moment';
import { localize } from '@deriv/translations';

export const addCommaToNumber = (num, decimal_places) => {
    if (!num || isNaN(num)) {
        return num;
    }
    const n = String(decimal_places ? (+num).toFixed(decimal_places) : num);
    const p = n.indexOf('.');
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) => (p <= 0 || i < p ? `${m},` : m));
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

export const getBarrierLabel = is_digit => (is_digit ? localize('Target') : localize('Barrier'));

export const getBarrierValue = (contract_info, is_digit) =>
    is_digit ? digitTypeMap(contract_info)[contract_info.contract_type] : addCommaToNumber(contract_info.barrier);

export const getBarrierIcon = (is_digit, is_reset_call_put, is_entry_spot_equal_barriers) => {
    if (is_digit) return 'IcContractTarget';
    if (is_reset_call_put && !is_entry_spot_equal_barriers) return 'IcContractBarrierDotted';
    return 'IcContractBarrierSolid';
};

const digitTypeMap = contract_info => ({
    DIGITDIFF: localize('Not {{barrier}}', { barrier: contract_info.barrier }),
    DIGITEVEN: localize('Even'),
    DIGITMATCH: localize('Equals {{barrier}}', { barrier: contract_info.barrier }),
    DIGITODD: localize('Odd'),
    DIGITOVER: localize('Over {{barrier}}', { barrier: contract_info.barrier }),
    DIGITUNDER: localize('Under {{barrier}}', { barrier: contract_info.barrier }),
});
