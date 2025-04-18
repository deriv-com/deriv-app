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

export const getLatestContractType = (
    positions: TPortfolioStore['active_positions'],
    currentCategory?: (typeof CONTRACT_STORAGE_VALUES)[keyof typeof CONTRACT_STORAGE_VALUES]
): string => {
    // Do not change category if there are open positions with the same type.
    if (
        currentCategory &&
        positions.some(pos => {
            const type = pos.contract_info?.contract_type;
            if (!type) return false;
            return getContractCategory(type) === currentCategory;
        })
    ) {
        return currentCategory;
    }

    // If no positions, fall back to stored or default.
    if (positions.length === 0) {
        const stored_value = localStorage.getItem('contract_type_value');
        return isValidContractType(stored_value) ? stored_value : CONTRACT_STORAGE_VALUES.OPTIONS;
    }

    // Otherwise, find the latest contract and its type.
    const latest_contract = positions.reduce((latest, current) => {
        const current_date_start = current.contract_info?.date_start || 0;
        const latest_date_start = latest.contract_info?.date_start || 0;
        return current_date_start > latest_date_start ? current : latest;
    });

    const contract_type = latest_contract.contract_info?.contract_type;
    if (!contract_type) return CONTRACT_STORAGE_VALUES.OPTIONS;

    return getContractCategory(contract_type);
};
