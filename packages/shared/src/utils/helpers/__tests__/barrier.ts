import { buildBarriersConfig } from '../barrier';

describe('buildBarriersConfig', () => {
    const contract_obj = {
        barrier_category: 'euro_atm',
        contract_category: 'callput',
        contract_category_display: 'Up/Down',
        contract_display: 'Higher',
        contract_type: 'CALL',
        exchange_name: 'FOREX',
        expiry_type: 'daily',
        market: 'forex',
        max_contract_duration: '365d',
        min_contract_duration: '1d',
        sentiment: 'up',
        start_type: 'spot',
        submarket: 'major_pairs',
        underlying_symbol: 'frxAUDJPY',
    };
    it('Returns Undefined if contract has no barriers', () => {
        const contract = {
            ...contract_obj,
        };
        expect(buildBarriersConfig(contract)).toBeUndefined();
    });

    it('Returns barriers with added values when contract has barrier but equals to zero', () => {
        const contract = {
            ...contract_obj,
            barriers: 0,
        };
        expect(buildBarriersConfig(contract)).toBeUndefined();
    });

    it('Returns barriers with including empty object when contract has barriers but not values', () => {
        const contract = {
            ...contract_obj,
            barriers: 1,
        };
        expect(buildBarriersConfig(contract)).toEqual({
            count: 1,
            daily: {},
        });
    });

    it('Returns barriers with added values when contract has barriers', () => {
        const contract = {
            ...contract_obj,
            barriers: 1,
            low_barrier: '22',
            barrier: '33',
            high_barrier: '44',
        };
        expect(buildBarriersConfig(contract)).toEqual({
            count: 1,
            daily: {
                low_barrier: 22,
                barrier: 33,
                high_barrier: 44,
            },
        });
    });

    it('Returns barriers with some of the values when contract has barriers and some of the values', () => {
        const contract = {
            ...contract_obj,
            barriers: 1,
            low_barrier: '22',
            barrier: '33',
        };
        expect(buildBarriersConfig(contract)).toEqual({
            count: 1,
            daily: {
                low_barrier: 22,
                barrier: 33,
            },
        });
    });
});
