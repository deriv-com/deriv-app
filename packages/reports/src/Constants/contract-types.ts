import { CONTRACT_STORAGE_VALUES, isAccumulatorContract, isMultiplierContract } from '@deriv/shared';
import { useStore } from '@deriv/stores';

type TPortfolioStore = ReturnType<typeof useStore>['portfolio'];

const isValidContractType = (
    value: string | null
): value is (typeof CONTRACT_STORAGE_VALUES)[keyof typeof CONTRACT_STORAGE_VALUES] => {
    return value !== null && Object.values(CONTRACT_STORAGE_VALUES).includes(value);
};

export const getLatestContractType = (positions: TPortfolioStore['active_positions']): string => {
    if (positions.length === 0) {
        const stored_value = localStorage.getItem('contract_type_value');
        return isValidContractType(stored_value) ? stored_value : CONTRACT_STORAGE_VALUES.OPTIONS;
    }

    const latest_contract = positions.reduce((latest, current) => {
        const current_date_start = current.contract_info?.date_start || 0;
        const latest_date_start = latest.contract_info?.date_start || 0;
        return current_date_start > latest_date_start ? current : latest;
    });

    if (!latest_contract.contract_info?.contract_type) return CONTRACT_STORAGE_VALUES.OPTIONS;

    if (isMultiplierContract(latest_contract.contract_info.contract_type)) {
        return CONTRACT_STORAGE_VALUES.MULTIPLIERS;
    } else if (isAccumulatorContract(latest_contract.contract_info.contract_type)) {
        return CONTRACT_STORAGE_VALUES.ACCUMULATORS;
    }
    return CONTRACT_STORAGE_VALUES.OPTIONS;
};
