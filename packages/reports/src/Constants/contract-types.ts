import { CONTRACT_STORAGE_VALUES, isAccumulatorContract, isMultiplierContract } from '@deriv/shared';
import { useStore } from '@deriv/stores';

type TPortfolioStore = ReturnType<typeof useStore>['portfolio'];

const isValidContractType = (
    value: string | null
): value is (typeof CONTRACT_STORAGE_VALUES)[keyof typeof CONTRACT_STORAGE_VALUES] => {
    return value !== null && Object.values(CONTRACT_STORAGE_VALUES).includes(value);
};

const getContractCategory = (contract_type: string) => {
    if (isMultiplierContract(contract_type)) {
        return CONTRACT_STORAGE_VALUES.MULTIPLIERS;
    } else if (isAccumulatorContract(contract_type)) {
        return CONTRACT_STORAGE_VALUES.ACCUMULATORS;
    }
    return CONTRACT_STORAGE_VALUES.OPTIONS;
};

export const getLatestContractType = (positions: TPortfolioStore['active_positions']): string => {
    // If no positions, fall back to stored or default.
    if (positions.length === 0) {
        const stored_value = localStorage.getItem('contract_type_value');
        return isValidContractType(stored_value) ? stored_value : CONTRACT_STORAGE_VALUES.OPTIONS;
    }

    // First priority: find the latest contract and its type.
    const latest_contract = positions.reduce((latest, current) => {
        const current_date_start = current.contract_info?.date_start || 0;
        const latest_date_start = latest.contract_info?.date_start || 0;
        return current_date_start > latest_date_start ? current : latest;
    });

    const contract_type = latest_contract.contract_info?.contract_type;
    if (!contract_type) return CONTRACT_STORAGE_VALUES.OPTIONS;

    return getContractCategory(contract_type);
};
