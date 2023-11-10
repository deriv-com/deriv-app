import { isEmptyObject, getPropertyValue, TRADE_TYPES } from '@deriv/shared';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { TTradeStore } from 'Types';

type THasDurationForCallPutEqual = {
    contract_type_list: TTradeStore['contract_types_list'];
    duration_unit: TTradeStore['duration_unit'];
    contract_start_type: string;
};

export const hasCallPutEqual = (contract_type_list: THasDurationForCallPutEqual['contract_type_list']) => {
    if (isEmptyObject(contract_type_list)) return false;

    return !!getPropertyValue(contract_type_list, 'Ups & Downs')?.categories?.some(
        (contract: THasDurationForCallPutEqual['contract_type_list']['Ups & Downs']['categories'][0]) =>
            contract.value === TRADE_TYPES.RISE_FALL_EQUAL
    );
};

export const hasDurationForCallPutEqual = (
    contract_type_list: THasDurationForCallPutEqual['contract_type_list'],
    duration_unit: THasDurationForCallPutEqual['duration_unit'],
    contract_start_type: THasDurationForCallPutEqual['contract_start_type']
) => {
    if (!contract_type_list || !duration_unit || !contract_start_type) return false;

    const contract_list = Object.keys(contract_type_list || {}).reduce<string[]>((key, list) => {
        const item: THasDurationForCallPutEqual['contract_type_list']['Ups & Downs'] = contract_type_list[list];
        return [...key, ...item.categories.map(contract => contract.value)];
    }, []);

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
        const found = contract_duration_list.filter(contract => contract?.rise_fall_equal);
        if (found.length > 0) {
            return found[0].rise_fall_equal.some((duration: { value: string }) => duration.value === duration_unit);
        }
    }

    return false;
};

export const isRiseFallEqual = (contract_type: string) => /^(rise_fall|rise_fall_equal)$/.test(contract_type);
