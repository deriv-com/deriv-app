import { getMultiplierValidationRules, getValidationRules } from '../validation-rules';
import { TTradeStore } from 'Types';
import { TRuleOptions } from '@deriv/shared';
import { isSessionAvailable } from '../../Helpers/start-date';

type TPartialRestParams = [Partial<TRuleOptions<TTradeStore>>, TTradeStore];
type TRestParams = [Partial<TRuleOptions<TTradeStore>>, TTradeStore, TTradeStore | undefined];
type TExtendedRuleOptions = TRuleOptions<TTradeStore> & { condition: (store: TTradeStore) => boolean; message: string };

const test_spot = 'test_spot';
const spot = 'spot';
const time_in_past = '00:01';
const valid_time = '11:45'; // '11:45:00' is also valid format
const unformatted_time = '11:45:00:000';
const time_with_incorrect_hours = '24:45';
const time_with_incorrect_minutes = '11:77';

const mocked_store = {
    barrier_count: 2,
    contract_start_type: test_spot,
    form_components: ['barrier'],
    has_stop_loss: true,
    has_take_profit: true,
    stop_loss: false,
    start_date: '09:30',
    take_profit: false,
} as unknown as TTradeStore;

const mocked_rest_barrier_params: TRestParams = [
    { min: 0, max: 10 },
    mocked_store,
    {
        barrier_1: '+120',
        barrier_2: '-100',
    } as TTradeStore,
];
const mocked_rest_time_params: TPartialRestParams = [{ min: 0, max: 10 }, mocked_store];

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
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
    const multiplier_validation_rules = getMultiplierValidationRules();
    it('should contain rules for stop_loss', () => {
        expect(multiplier_validation_rules).toHaveProperty('stop_loss');
        expect((multiplier_validation_rules.stop_loss.rules[0][1] as TExtendedRuleOptions).message).toBe(
            'Please enter a stop loss amount.'
        );
        expect(
            (multiplier_validation_rules.stop_loss.rules[0][1] as TExtendedRuleOptions).condition(mocked_store)
        ).toBe(true);
    });

    it('should contain rules for take_profit', () => {
        expect(multiplier_validation_rules).toHaveProperty('take_profit');
        expect((multiplier_validation_rules.take_profit.rules[0][1] as TExtendedRuleOptions).message).toBe(
            'Please enter a take profit amount.'
        );
        expect(
            (multiplier_validation_rules.take_profit.rules[0][1] as TExtendedRuleOptions).condition(mocked_store)
        ).toBe(true);
    });
});

describe('getValidationRules', () => {
    const validation_rules = getValidationRules();
    it('should contain rules for amount', () => {
        expect(validation_rules).toHaveProperty('amount');
        expect((validation_rules.amount.rules?.[0][1] as TExtendedRuleOptions).message).toBe(
            'Amount is a required field.'
        );
    });

    it('should contain rules for barrier_1', () => {
        expect(validation_rules).toHaveProperty('barrier_1');

        // Barrier is a required field.:
        expect((validation_rules.barrier_1.rules?.[0][1] as TExtendedRuleOptions).condition(mocked_store)).toBe(true);

        expect((validation_rules.barrier_1.rules?.[1][1] as TExtendedRuleOptions).condition(mocked_store)).toBe(true);

        // Higher barrier must be higher than lower barrier.:
        expect(
            (validation_rules.barrier_1?.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '-150',
                ...mocked_rest_barrier_params
            )
        ).toBe(false);
        expect(
            (validation_rules.barrier_1?.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '+90',
                ...mocked_rest_barrier_params
            )
        ).toBe(true);

        mocked_store.barrier_count = 1;
        expect(
            (validation_rules.barrier_1.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '+90',
                ...mocked_rest_barrier_params
            )
        ).toBe(true);

        // Barrier cannot be zero.:
        const inputs = {
            barrier_1: '+0',
            barrier_2: '-100',
        } as TTradeStore;
        expect(
            (validation_rules.barrier_1.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '+0',
                mocked_rest_barrier_params[0],
                mocked_rest_barrier_params[1],
                inputs
            )
        ).toBe(false);
        expect(
            (validation_rules.barrier_1.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '+0',
                mocked_rest_barrier_params[0],
                {
                    ...mocked_store,
                    is_vanilla: true, // zero barrier is allowed for Vanilla
                } as TTradeStore,
                inputs
            )
        ).toBe(true);
    });

    it('should contain rules for barrier_2', () => {
        mocked_store.barrier_count = 2;

        expect(validation_rules).toHaveProperty('barrier_2');

        // Barrier is a required field.:
        expect((validation_rules.barrier_2.rules?.[0][1] as TExtendedRuleOptions).condition(mocked_store)).toBe(true);

        expect((validation_rules.barrier_2.rules?.[1][1] as TExtendedRuleOptions).condition(mocked_store)).toBe(true);

        // Both barriers should be relative or absolute:
        expect(
            (validation_rules.barrier_2.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '150',
                ...mocked_rest_barrier_params
            )
        ).toBe(false);
        expect(
            (validation_rules.barrier_2.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '+150',
                ...mocked_rest_barrier_params
            )
        ).toBe(true);

        // Lower barrier must be lower than higher barrier.:
        expect(
            (validation_rules.barrier_2.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '+150',
                ...mocked_rest_barrier_params
            )
        ).toBe(false);
        expect(
            (validation_rules.barrier_2.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '+90',
                ...mocked_rest_barrier_params
            )
        ).toBe(true);
    });

    it('should contain rules for duration', () => {
        expect(validation_rules).toHaveProperty('duration');
        expect((validation_rules.duration.rules?.[0][1] as TExtendedRuleOptions).message).toBe(
            'Duration is a required field.'
        );
    });

    it('should contain rules for start_date', () => {
        expect(validation_rules).toHaveProperty('start_date');
        expect(validation_rules.start_date.trigger).toBe('start_time');
    });

    it('should contain rules for expiry_date', () => {
        expect(validation_rules).toHaveProperty('expiry_date');
        expect(validation_rules.expiry_date.trigger).toBe('expiry_time');
    });

    it('should contain rules for start_time', () => {
        expect(validation_rules).toHaveProperty('start_time');

        // Please enter the start time in the format "HH:MM".:
        expect(
            (validation_rules.start_time.rules?.[0][1] as TExtendedRuleOptions).func?.(
                unformatted_time,
                ...mocked_rest_time_params
            )
        ).toBe(false);
        expect(
            (validation_rules.start_time.rules?.[0][1] as TExtendedRuleOptions).func?.(
                valid_time,
                ...mocked_rest_time_params
            )
        ).toBe(true);

        // Hour must be between 0 and 23.:
        expect(
            (validation_rules.start_time.rules?.[1][1] as TExtendedRuleOptions).func?.(
                time_with_incorrect_hours,
                ...mocked_rest_time_params
            )
        ).toBe(false);
        expect(
            (validation_rules.start_time.rules?.[1][1] as TExtendedRuleOptions).func?.(
                valid_time,
                ...mocked_rest_time_params
            )
        ).toBe(true);

        // Minute must be between 0 and 59.:
        expect(
            (validation_rules.start_time.rules?.[2][1] as TExtendedRuleOptions).func?.(
                time_with_incorrect_minutes,
                ...mocked_rest_time_params
            )
        ).toBe(false);
        expect(
            (validation_rules.start_time.rules?.[2][1] as TExtendedRuleOptions).func?.(
                valid_time,
                ...mocked_rest_time_params
            )
        ).toBe(true);

        // Start time cannot be in the past.:
        expect(
            (validation_rules.start_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                time_in_past,
                ...mocked_rest_time_params
            )
        ).toBe(false);
        mocked_store.contract_start_type = spot;
        expect(
            (validation_rules.start_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                time_in_past,
                ...mocked_rest_time_params
            )
        ).toBe(true);

        mocked_store.contract_start_type = test_spot;
        (isSessionAvailable as jest.Mock).mockReturnValueOnce(true);
        expect(
            (validation_rules.start_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                valid_time,
                ...mocked_rest_time_params
            )
        ).toBe(true);
    });

    it('should contain rules for expiry_time', () => {
        expect(validation_rules).toHaveProperty('expiry_time');

        // Please enter the expiry time in the format "HH:MM":
        expect(
            (validation_rules.expiry_time.rules?.[0][1] as TExtendedRuleOptions).func?.(
                unformatted_time,
                ...mocked_rest_time_params
            )
        ).toBe(false);
        expect(
            (validation_rules.expiry_time.rules?.[0][1] as TExtendedRuleOptions).func?.(
                valid_time,
                ...mocked_rest_time_params
            )
        ).toBe(true);

        // Hour must be between 0 and 23.:
        expect(
            (validation_rules.expiry_time.rules?.[1][1] as TExtendedRuleOptions).func?.(
                time_with_incorrect_hours,
                ...mocked_rest_time_params
            )
        ).toBe(false);
        expect(
            (validation_rules.expiry_time.rules?.[1][1] as TExtendedRuleOptions).func?.(
                valid_time,
                ...mocked_rest_time_params
            )
        ).toBe(true);

        // Minute must be between 0 and 59.:
        expect(
            (validation_rules.expiry_time.rules?.[2][1] as TExtendedRuleOptions).func?.(
                time_with_incorrect_minutes,
                ...mocked_rest_time_params
            )
        ).toBe(false);
        expect(
            (validation_rules.expiry_time.rules?.[2][1] as TExtendedRuleOptions).func?.(
                valid_time,
                ...mocked_rest_time_params
            )
        ).toBe(true);

        // Expiry time cannot be in the past:
        expect(
            (validation_rules.expiry_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                time_in_past,
                ...mocked_rest_time_params
            )
        ).toBe(false);
        mocked_store.contract_start_type = spot;
        expect(
            (validation_rules.expiry_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                time_in_past,
                ...mocked_rest_time_params
            )
        ).toBe(true);

        mocked_store.contract_start_type = test_spot;
        (isSessionAvailable as jest.Mock).mockReturnValueOnce(true);
        expect(
            (validation_rules.expiry_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                valid_time,
                ...mocked_rest_time_params
            )
        ).toBe(true);
    });
});
