import { getValidationRules, getMultiplierValidationRules } from '../validation-rules';
import { TTradeStore } from 'Types';
import type { TRuleOptions } from 'Utils/Validator/validator';

const mocked_store = {
    has_stop_loss: true,
    has_take_profit: true,
    stop_loss: false,
    barrier_count: 2,
    form_components: ['barrier'],
    take_profit: false,
} as unknown as TTradeStore;
const mocked_params: [
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

describe('getMultiplierValidationRules', () => {
    it('should contain rules for stop_loss', () => {
        const returned_validation_rules = getMultiplierValidationRules();

        expect(returned_validation_rules).toHaveProperty('stop_loss');
        expect(returned_validation_rules.stop_loss.rules[0][1].message).toBe('Please enter a stop loss amount.');
        expect(returned_validation_rules.stop_loss.rules[0][1].condition(mocked_store)).toBe(true);
    });
    it('should contain rules for take_profit', () => {
        const returned_validation_rules = getMultiplierValidationRules();

        expect(returned_validation_rules).toHaveProperty('take_profit');
        expect(returned_validation_rules.take_profit.rules[0][1].message).toBe('Please enter a take profit amount.');
        expect(returned_validation_rules.take_profit.rules[0][1].condition(mocked_store)).toBe(true);
    });
});

describe('getValidationRules', () => {
    it('should contain rules for amount', () => {
        const returned_validation_rules = getValidationRules();

        expect(returned_validation_rules).toHaveProperty('amount');
        expect(returned_validation_rules.amount.rules[0][1].message).toBe('Amount is a required field.');
    });

    it('should contain rules for barrier_1', () => {
        const returned_validation_rules = getValidationRules();

        expect(returned_validation_rules).toHaveProperty('barrier_1');
        expect(returned_validation_rules.barrier_1.rules[0][1].condition(mocked_store)).toBe(true);
        expect(returned_validation_rules.barrier_1.rules[1][1].condition(mocked_store)).toBe(2);
        expect(returned_validation_rules.barrier_1.rules[2][1].func(...mocked_params)).toBe(true);
        mocked_store.barrier_count = 1;
        expect(returned_validation_rules.barrier_1.rules[2][1].func(...mocked_params)).toBe(true);
        expect(returned_validation_rules.barrier_1.rules[3][1].func(...mocked_params)).toBe(true);
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
        const returned_validation_rules = getValidationRules();

        expect(returned_validation_rules).toHaveProperty('barrier_2');
        expect(returned_validation_rules.barrier_2.rules[0][1].condition(mocked_store)).toBe(true);
        expect(returned_validation_rules.barrier_2.rules[1][1].condition(mocked_store)).toBe(2);
        expect(returned_validation_rules.barrier_2.rules[2][1].func(...mocked_params)).toBe(false);
        expect(returned_validation_rules.barrier_2.rules[3][1].func(...mocked_params)).toBe(false);
    });

    it('should contain rules for duration', () => {
        const returned_validation_rules = getValidationRules();

        expect(returned_validation_rules).toHaveProperty('duration');
        expect(returned_validation_rules.duration.rules[0][1].message).toBe('Duration is a required field.');
    });

    it('should contain rules for start_date', () => {
        const returned_validation_rules = getValidationRules();

        expect(returned_validation_rules).toHaveProperty('start_date');
        expect(returned_validation_rules.start_date.trigger).toBe('start_time');
    });

    it('should contain rules for expiry_date', () => {
        const returned_validation_rules = getValidationRules();

        expect(returned_validation_rules).toHaveProperty('expiry_date');
        expect(returned_validation_rules.expiry_date.trigger).toBe('expiry_time');
    });
});
