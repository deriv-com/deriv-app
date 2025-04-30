import { CONTRACT_STORAGE_VALUES } from '@deriv/shared';
import { useStore } from '@deriv/stores';

import { getLatestContractType } from '../contract-types';

type TPortfolioStore = ReturnType<typeof useStore>['portfolio'];

const base_position = {
    display_name: '',
    indicative: 0,
    reference: 0,
    is_unsupported: false,
    contract_update: undefined,
    is_sell_requested: false,
    profit_loss: 0,
};

describe('getLatestContractType', () => {
    let mockLocalStorage: { [key: string]: string };

    beforeEach(() => {
        mockLocalStorage = {};
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => mockLocalStorage[key] || null);
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
            mockLocalStorage[key] = value;
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('empty positions handling', () => {
        it('should return OPTIONS when positions array is empty and no localStorage value', () => {
            const result = getLatestContractType([]);
            expect(result).toBe(CONTRACT_STORAGE_VALUES.OPTIONS);
        });

        it('should return localStorage value when positions array is empty and localStorage has valid value', () => {
            mockLocalStorage.contract_type_value = CONTRACT_STORAGE_VALUES.MULTIPLIERS;
            const result = getLatestContractType([]);
            expect(result).toBe(CONTRACT_STORAGE_VALUES.MULTIPLIERS);
        });

        it('should return OPTIONS when localStorage has invalid value', () => {
            mockLocalStorage.contract_type_value = 'invalid_type';
            const result = getLatestContractType([]);
            expect(result).toBe(CONTRACT_STORAGE_VALUES.OPTIONS);
        });
    });

    describe('contract type determination', () => {
        it('should return OPTIONS when latest contract has no contract_type', () => {
            const positions: TPortfolioStore['active_positions'] = [
                {
                    ...base_position,
                    contract_info: {
                        date_start: 1000,
                    },
                },
            ];
            const result = getLatestContractType(positions);
            expect(result).toBe(CONTRACT_STORAGE_VALUES.OPTIONS);
        });

        it('should return MULTIPLIERS for latest multiplier contract', () => {
            const positions: TPortfolioStore['active_positions'] = [
                {
                    ...base_position,
                    contract_info: {
                        date_start: 1000,
                        contract_type: 'MULTUP',
                    },
                },
                {
                    ...base_position,
                    contract_info: {
                        date_start: 500,
                        contract_type: 'CALL',
                    },
                },
            ];
            const result = getLatestContractType(positions);
            expect(result).toBe(CONTRACT_STORAGE_VALUES.MULTIPLIERS);
        });

        it('should return ACCUMULATORS for latest accumulator contract', () => {
            const positions: TPortfolioStore['active_positions'] = [
                {
                    ...base_position,
                    contract_info: {
                        date_start: 2000,
                        contract_type: 'ACCU',
                    },
                },
                {
                    ...base_position,
                    contract_info: {
                        date_start: 1000,
                        contract_type: 'MULTUP',
                    },
                },
            ];
            const result = getLatestContractType(positions);
            expect(result).toBe(CONTRACT_STORAGE_VALUES.ACCUMULATORS);
        });

        it('should return OPTIONS for latest non-multiplier non-accumulator contract', () => {
            const positions: TPortfolioStore['active_positions'] = [
                {
                    ...base_position,
                    contract_info: {
                        date_start: 2000,
                        contract_type: 'CALL',
                    },
                },
                {
                    ...base_position,
                    contract_info: {
                        date_start: 1000,
                        contract_type: 'MULTUP',
                    },
                },
            ];
            const result = getLatestContractType(positions);
            expect(result).toBe(CONTRACT_STORAGE_VALUES.OPTIONS);
        });
    });

    describe('edge cases', () => {
        it('should handle missing date_start by treating it as 0', () => {
            const positions: TPortfolioStore['active_positions'] = [
                {
                    ...base_position,
                    contract_info: {
                        contract_type: 'CALL',
                    },
                },
                {
                    ...base_position,
                    contract_info: {
                        date_start: 1000,
                        contract_type: 'MULTUP',
                    },
                },
            ];
            const result = getLatestContractType(positions);
            expect(result).toBe(CONTRACT_STORAGE_VALUES.MULTIPLIERS);
        });
    });
});
