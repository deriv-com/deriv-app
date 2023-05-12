import { buildBarriersConfig, getAccumulatorBarriers } from '../barrier';

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
                low_barrier: '22',
                barrier: '33',
                high_barrier: '44',
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
                low_barrier: '22',
                barrier: '33',
            },
        });
    });
});

// based on values provided by Quants team
describe('getAccumulatorBarriers', () => {
    it('should return empty strings for barriers if any of the passed arguments are undefined', () => {
        expect(getAccumulatorBarriers(undefined, 9017.26, 2)).toEqual({
            high_barrier: '',
            low_barrier: '',
        });
        expect(getAccumulatorBarriers(0.000648677482, undefined, 2)).toEqual({
            high_barrier: '',
            low_barrier: '',
        });
        expect(getAccumulatorBarriers(0.000648677482, 9017.26)).toEqual({
            high_barrier: '',
            low_barrier: '',
        });
    });
    it('should return correct barriers for a 0.0493582527% tick_size_barrier with a 2-pip_size previous_spot', () => {
        expect(getAccumulatorBarriers(0.000493582527, 5003, 2)).toEqual({
            high_barrier: '5005.470',
            low_barrier: '5000.530',
        });
        expect(getAccumulatorBarriers(0.000493582527, 5004.12, 2)).toEqual({
            high_barrier: '5006.590',
            low_barrier: '5001.650',
        });
    });
    it('should return correct barriers for a 0.0045868419% tick_size_barrier with a 2-pip_size previous_spot', () => {
        expect(getAccumulatorBarriers(0.000045868419, 6969, 2)).toEqual({
            high_barrier: '6969.320',
            low_barrier: '6968.680',
        });
        expect(getAccumulatorBarriers(0.000045868419, 6969.3, 2)).toEqual({
            high_barrier: '6969.620',
            low_barrier: '6968.980',
        });
        expect(getAccumulatorBarriers(0.000045868419, 6969.52, 2)).toEqual({
            high_barrier: '6969.840',
            low_barrier: '6969.200',
        });
    });
    it('should return correct barriers for a 0.0019945249% tick_size_barrier with a 3-pip_size previous_spot', () => {
        expect(getAccumulatorBarriers(0.000019945249, 12345.456, 3)).toEqual({
            high_barrier: '12345.7023',
            low_barrier: '12345.2097',
        });
    });
    it('should return correct barriers for a 0.0388240062% tick_size_barrier with a 2-pip_size previous_spot', () => {
        expect(getAccumulatorBarriers(0.000388240062, 12335.62, 2)).toEqual({
            high_barrier: '12340.410',
            low_barrier: '12330.830',
        });
        expect(getAccumulatorBarriers(0.000388240062, 12333.24, 2)).toEqual({
            high_barrier: '12338.029',
            low_barrier: '12328.451',
        });
        expect(getAccumulatorBarriers(0.000388240062, 12329.74, 2)).toEqual({
            high_barrier: '12334.527',
            low_barrier: '12324.953',
        });
    });
    it('should return correct barriers for a 0.0409874388% tick_size_barrier with a 4-pip_size previous_spot', () => {
        expect(getAccumulatorBarriers(0.000409874388, 305325.23, 4)).toEqual({
            high_barrier: '305450.37500',
            low_barrier: '305200.08500',
        });
        expect(getAccumulatorBarriers(0.000409874388, 305332.5865, 4)).toEqual({
            high_barrier: '305457.73451',
            low_barrier: '305207.43849',
        });
    });
    it('should return correct barriers for a 0.0005325655% tick_size_barrier with a 3-pip_size previous_spot', () => {
        expect(getAccumulatorBarriers(0.000005325655, 3546.234, 3)).toEqual({
            high_barrier: '3546.2529',
            low_barrier: '3546.2151',
        });
        expect(getAccumulatorBarriers(0.000005325655, 3546.212, 3)).toEqual({
            high_barrier: '3546.2309',
            low_barrier: '3546.1931',
        });
        expect(getAccumulatorBarriers(0.000005325655, 3546.201, 3)).toEqual({
            high_barrier: '3546.2199',
            low_barrier: '3546.1821',
        });
        expect(getAccumulatorBarriers(0.000005325655, 3546.1, 3)).toEqual({
            high_barrier: '3546.1189',
            low_barrier: '3546.0811',
        });
    });
});
