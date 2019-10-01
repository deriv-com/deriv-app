import ObjectUtils  from 'deriv-shared/utils/object';
import ContractType from './contract-type';

export const hasCallPutEqual = (contract_type_list) => {
    if (!contract_type_list) return false;

    return ObjectUtils.getPropertyValue(contract_type_list, 'Up/Down')
        .some(contract => contract.value === 'rise_fall_equal');
};

export const hasDurationForCallPutEqual = (contract_type_list, duration_unit, contract_start_type) => {
    if (!contract_type_list || !duration_unit || !contract_start_type) return false;

    const contract_list = Object.keys(contract_type_list || {})
        .reduce((key, list) => ([...key, ...contract_type_list[list].map(contract => contract.value)]), []);

    const contract_duration_list = contract_list
        .map(list => ({ [list]: ObjectUtils.getPropertyValue(ContractType.getFullContractTypes(), [list, 'config', 'durations', 'units_display', contract_start_type]) }));

    // Check whether rise fall equal is exists and has the current store duration unit
    return hasCallPutEqual(contract_type_list) ? contract_duration_list
        .filter(contract => contract.rise_fall_equal)[0].rise_fall_equal
        .some(duration => duration.value === duration_unit) : false;
};

export const isRiseFallEqual = (contract_type) => /^(rise_fall|rise_fall_equal)$/.test(contract_type);
