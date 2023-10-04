import { getValidationRules, getMultiplierValidationRules } from '../validation-rules';
import { TTradeStore } from 'Types';
import { isTimeValid } from '@deriv/shared';
import { isSessionAvailable } from '../../Helpers/start-date';
import type { TRuleOptions } from 'Utils/Validator/validator';

const mocked_store = {
    contract_start_type: 'test_spot',
    has_stop_loss: true,
    has_take_profit: true,
    stop_loss: false,
    start_date: 'start_date',
    barrier_count: 2,
    form_components: ['barrier'],
    take_profit: false,
} as unknown as TTradeStore;

const mocked_params_1: [
    TTradeStore['barrier_1'],
    Partial<TRuleOptions>,
    TTradeStore,
    Pick<TTradeStore, 'barrier_1' | 'barrier_2'>
] = [
    '123',
    'test' as unknown as Partial<TRuleOptions>,
    mocked_store,
    {
        barrier_1: '+123',
        barrier_2: '-123',
    },
];

const mocked_params_2: [TTradeStore['start_time'], Partial<TRuleOptions>, TTradeStore] = [
    null,
    'test' as unknown as Partial<TRuleOptions>,
    mocked_store,
];

const mocked_params_3: [TTradeStore['expiry_time'], Partial<TRuleOptions>, TTradeStore] = [
    null,
    'test' as unknown as Partial<TRuleOptions>,
    mocked_store,
];

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isTimeValid: jest.fn(() => false),
    toMoment: jest.fn(() => ({
        start_date: 'start_date',
        clone: jest.fn(() => ({ hour: jest.fn(() => ({ minute: jest.fn() })) })),
    })),
}));

jest.mock('../../Helpers/start-date', () => ({
    ...jest.requireActual('../../Helpers/start-date'),
    isSessionAvailable: jest.fn(() => false),
}));

describe('getMultiplierValidationRules', () => {
    const returned_validation_rules = getMultiplierValidationRules();

    it('should contain rules for stop_loss', () => {
        expect(returned_validation_rules).toHaveProperty('stop_loss');
        expect(returned_validation_rules.stop_loss.rules[0][1].message).toBe('Please enter a stop loss amount.');
        expect(returned_validation_rules.stop_loss.rules[0][1].condition(mocked_store)).toBe(true);
    });

    it('should contain rules for take_profit', () => {
        expect(returned_validation_rules).toHaveProperty('take_profit');
        expect(returned_validation_rules.take_profit.rules[0][1].message).toBe('Please enter a take profit amount.');
        expect(returned_validation_rules.take_profit.rules[0][1].condition(mocked_store)).toBe(true);
    });
});

describe('getValidationRules', () => {
    const returned_validation_rules = getValidationRules();

    it('should contain rules for amount', () => {
        expect(returned_validation_rules).toHaveProperty('amount');
        expect(returned_validation_rules.amount.rules[0][1].message).toBe('Amount is a required field.');
    });

    it('should contain rules for barrier_1', () => {
        expect(returned_validation_rules).toHaveProperty('barrier_1');
        expect(returned_validation_rules.barrier_1.rules[0][1].condition(mocked_store)).toBe(true);
        expect(returned_validation_rules.barrier_1.rules[1][1].condition(mocked_store)).toBe(2);
        expect(returned_validation_rules.barrier_1.rules[2][1].func(...mocked_params_1)).toBe(true);

        mocked_store.barrier_count = 1;
        expect(returned_validation_rules.barrier_1.rules[2][1].func(...mocked_params_1)).toBe(true);
        expect(returned_validation_rules.barrier_1.rules[3][1].func(...mocked_params_1)).toBe(true);
        expect(
            returned_validation_rules.barrier_1.rules[3][1].func(
                '123',
                'test' as unknown as Partial<TRuleOptions>,
                mocked_store,
                {
                    barrier_1: '123',
                    barrier_2: '123',
                }
            )
        ).toBeTrue;
    });

    it('should contain rules for barrier_2', () => {
        mocked_store.barrier_count = 2;

        expect(returned_validation_rules).toHaveProperty('barrier_2');
        expect(returned_validation_rules.barrier_2.rules[0][1].condition(mocked_store)).toBe(true);
        expect(returned_validation_rules.barrier_2.rules[1][1].condition(mocked_store)).toBe(2);
        expect(returned_validation_rules.barrier_2.rules[2][1].func(...mocked_params_1)).toBe(false);
        expect(returned_validation_rules.barrier_2.rules[3][1].func(...mocked_params_1)).toBe(false);
    });

    it('should contain rules for duration', () => {
        expect(returned_validation_rules).toHaveProperty('duration');
        expect(returned_validation_rules.duration.rules[0][1].message).toBe('Duration is a required field.');
    });

    it('should contain rules for start_date', () => {
        expect(returned_validation_rules).toHaveProperty('start_date');
        expect(returned_validation_rules.start_date.trigger).toBe('start_time');
    });

    it('should contain rules for expiry_date', () => {
        expect(returned_validation_rules).toHaveProperty('expiry_date');
        expect(returned_validation_rules.expiry_date.trigger).toBe('expiry_time');
    });

    it('should contain rules for start_time', () => {
        expect(returned_validation_rules).toHaveProperty('start_time');
        expect(returned_validation_rules.start_time.rules[0][1].func(...mocked_params_2)).toBe(false);
        expect(returned_validation_rules.start_time.rules[1][1].func(...mocked_params_2)).toBe(false);
        expect(returned_validation_rules.start_time.rules[2][1].func(...mocked_params_2)).toBe(false);

        mocked_store.contract_start_type = 'spot';
        expect(returned_validation_rules.start_time.rules[3][1].func(...mocked_params_2)).toBe(true);

        mocked_store.contract_start_type = 'test_spot';
        expect(returned_validation_rules.start_time.rules[3][1].func(...mocked_params_2)).toBe(false);

        (isTimeValid as jest.Mock).mockReturnValueOnce(true);
        (isSessionAvailable as jest.Mock).mockReturnValueOnce(true);
        expect(returned_validation_rules.start_time.rules[3][1].func(...mocked_params_2)).toBe(true);
    });

    it('should contain rules for expiry_time', () => {
        expect(returned_validation_rules).toHaveProperty('expiry_time');
        expect(returned_validation_rules.expiry_time.rules[0][1].func(...mocked_params_3)).toBe(false);
        expect(returned_validation_rules.expiry_time.rules[1][1].func(...mocked_params_3)).toBe(false);
        expect(returned_validation_rules.expiry_time.rules[2][1].func(...mocked_params_3)).toBe(false);

        mocked_store.contract_start_type = 'spot';
        expect(returned_validation_rules.expiry_time.rules[3][1].func(...mocked_params_3)).toBe(true);

        mocked_store.contract_start_type = 'test_spot';
        expect(returned_validation_rules.expiry_time.rules[3][1].func(...mocked_params_3)).toBe(false);

        (isTimeValid as jest.Mock).mockReturnValueOnce(true);
        (isSessionAvailable as jest.Mock).mockReturnValueOnce(true);
        expect(returned_validation_rules.expiry_time.rules[3][1].func(...mocked_params_3)).toBe(true);
    });
});
