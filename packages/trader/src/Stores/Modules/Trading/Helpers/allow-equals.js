import { isEmptyObject, getPropertyValue } from '@deriv/shared';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';

export const hasCallPutEqual = contract_type_list => {
    if (isEmptyObject(contract_type_list)) return false;

    return ((getPropertyValue(contract_type_list, 'Ups & Downs') || {}).categories || []).some(
        contract => contract.value === 'rise_fall_equal'
    );
};

export const hasDurationForCallPutEqual = (contract_type_list, duration_unit, contract_start_type) => {
    if (!contract_type_list || !duration_unit || !contract_start_type) return false;

    const contract_list = Object.keys(contract_type_list || {}).reduce(
        (key, list) => [...key, ...contract_type_list[list].categories.map(contract => contract.value)],
        []
    );

    const contract_duration_list = contract_list.map(list => ({
        [list]: getPropertyValue(ContractType.getFullContractTypes(), [
            list,
            'config',
            'durations',
            'units_display',
            contract_start_type,
        ]),
    }));

    // Check whether rise fall equal is exists and has the current store duration unit
    if (hasCallPutEqual(contract_type_list)) {
        const found = contract_duration_list.filter(contract => contract && contract.rise_fall_equal);
        if (found.length > 0) {
            return found[0].rise_fall_equal.some(duration => duration.value === duration_unit);
        }
    }

    return false;
};

export const isRiseFallEqual = contract_type => /^(rise_fall|rise_fall_equal)$/.test(contract_type);
