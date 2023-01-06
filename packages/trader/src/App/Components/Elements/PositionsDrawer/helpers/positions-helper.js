import { localize } from '@deriv/translations';
import { isHighLow, getContractTypesConfig, isCallPut, isVanillaContract } from '@deriv/shared';

export const addCommaToNumber = (num, decimal_places) => {
    if (!num || isNaN(num)) {
        return num;
    }
    const n = String(decimal_places ? (+num).toFixed(decimal_places) : num);
    const p = n.indexOf('.');
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) => (p <= 0 || i < p ? `${m},` : m));
};

export const getBarrierLabel = contract_info => {
    if (isDigitType(contract_info.contract_type)) {
        return localize('Target');
    }
    if (isVanillaContract(contract_info.contract_type)) {
        return localize('Strike');
    }
    return localize('Barrier');
};

export const getBarrierValue = contract_info => {
    if (isDigitType(contract_info.contract_type)) {
        return digitTypeMap(contract_info)[contract_info.contract_type];
    }
    return addCommaToNumber(contract_info.barrier);
};

export const isDigitType = contract_type => /digit/.test(contract_type.toLowerCase());

const digitTypeMap = contract_info => ({
    DIGITDIFF: localize('Not {{barrier}}', { barrier: contract_info.barrier }),
    DIGITEVEN: localize('Even'),
    DIGITMATCH: localize('Equals {{barrier}}', { barrier: contract_info.barrier }),
    DIGITODD: localize('Odd'),
    DIGITOVER: localize('Over {{barrier}}', { barrier: contract_info.barrier }),
    DIGITUNDER: localize('Under {{barrier}}', { barrier: contract_info.barrier }),
});

export const filterByContractType = ({ contract_type, shortcode }, trade_contract_type) => {
    const is_call_put = isCallPut(trade_contract_type);
    const is_high_low = isHighLow({ shortcode });
    const is_vanilla = isVanillaContract(contract_type);
    const trade_types = is_call_put
        ? ['CALL', 'CALLE', 'PUT', 'PUTE']
        : getContractTypesConfig()[trade_contract_type]?.trade_types;
    const match = trade_types?.includes(contract_type);
    if (trade_contract_type === 'high_low') return is_high_low;
    return match && (is_vanilla || !is_high_low);
};
