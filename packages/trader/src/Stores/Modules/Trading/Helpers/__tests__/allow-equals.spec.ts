import { isRiseFallEqual, hasCallPutEqual, hasDurationForCallPutEqual } from '../allow-equals';

jest.mock('Stores/Modules/Trading/Helpers/contract-type', () => ({
    ...jest.requireActual('Stores/Modules/Trading/Helpers/contract-type'),
    ContractType: {
        getFullContractTypes: jest.fn(() => ({
            run_high_low: {
                config: {
                    durations: {
                        units_display: {
                            spot: [{ text: 'Ticks', value: 't' }],
                        },
                    },
                },
            },
            rise_fall_equal: {
                config: {
                    durations: {
                        units_display: {
                            spot: [
                                { text: 'Ticks', value: 't' },
                                { text: 'Seconds', value: 's' },
                                { text: 'Minutes', value: 'm' },
                                { text: 'Hours', value: 'h' },
                                { text: 'Days', value: 'd' },
                            ],
                        },
                    },
                },
            },
        })),
    },
}));

describe('isRiseFallEqual', () => {
    it('Regex should return true if contract_type is rise_fall', () => {
        expect(isRiseFallEqual('rise_fall')).toBeTruthy();
    });
    it('Regex should return false if contract_type is not rise_fall', () => {
        expect(isRiseFallEqual('test')).toBeFalsy();
    });
});

describe('hasCallPutEqual', () => {
    it('should return true when contract_types_list includes rise_fall_equal as value', () => {
        const contract_types_list = {
            'Ups & Downs': {
                name: 'Ups & Downs',
                categories: [
                    {
                        value: 'rise_fall_equal',
                        text: 'Rise/Fall',
                    },
                    {
                        value: 'run_high_low',
                        text: 'Only Ups/Only Downs',
                    },
                ],
            },
        };
        expect(hasCallPutEqual(contract_types_list)).toBeTruthy();
    });
    it('should return false when contract_types_list does not includes rise_fall_equal as value', () => {
        const contract_types_list = {
            'Ups & Downs': {
                name: 'Ups & Downs',
                categories: [
                    {
                        value: 'rise_fall',
                        text: 'Rise/Fall',
                    },
                    {
                        value: 'run_high_low',
                        text: 'Only Ups/Only Downs',
                    },
                ],
            },
        };
        expect(hasCallPutEqual(contract_types_list)).toBeFalsy();
    });
    it('should return false if contract_types_list is an empty object', () => {
        expect(hasCallPutEqual({})).toBeFalsy();
    });
});

describe('hasDurationForCallPutEqual', () => {
    const contract_types_list = {
        'Ups & Downs': {
            name: 'Ups & Downs',
            categories: [
                {
                    value: 'rise_fall_equal',
                    text: 'Rise/Fall',
                },
                {
                    value: 'run_high_low',
                    text: 'Only Ups/Only Downs',
                },
            ],
        },
    };
    const duration_unit = 't';
    const contract_start_type = 'spot';
    it('Should return true if contract_types_list has rise_fall_equal and mock has its duration values', () => {
        expect(hasDurationForCallPutEqual(contract_types_list, duration_unit, contract_start_type)).toBeTruthy();
    });
    it('should return false if contract_types_list does not have rise_fall_equal', () => {
        const contract_types_list = {
            'Ups & Downs': {
                name: 'Ups & Downs',
                categories: [
                    {
                        value: 'run_high_low',
                        text: 'Only Ups/Only Downs',
                    },
                ],
            },
        };
        expect(hasDurationForCallPutEqual(contract_types_list, duration_unit, contract_start_type)).toBeFalsy();
    });
});
