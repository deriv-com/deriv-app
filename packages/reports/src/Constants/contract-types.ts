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
    // If there are positions, first check if we have any of the current category
    if (positions.length > 0) {
        // Keep current category if there are open positions with the same type
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

        // If current category has no positions, find the latest contract and use its type
        const latest_contract = positions.reduce((latest, current) => {
            const current_date_start = current.contract_info?.date_start || 0;
            const latest_date_start = latest.contract_info?.date_start || 0;
            return current_date_start > latest_date_start ? current : latest;
        });

        const contract_type = latest_contract.contract_info?.contract_type;
        if (contract_type) {
            const category = getContractCategory(contract_type);
            // Update localStorage to ensure consistency
            localStorage.setItem('contract_type_value', category);
            return category;
        }
    }

    // If no positions or no valid contract type, fall back to stored or default
    const stored_value = localStorage.getItem('contract_type_value');
    return isValidContractType(stored_value) ? stored_value : CONTRACT_STORAGE_VALUES.OPTIONS;
};
