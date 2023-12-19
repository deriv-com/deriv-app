import { getValidationRules, getMultiplierValidationRules } from '../validation-rules';
import { TTradeStore } from 'Types';
import { isTimeValid, TRuleOptions } from '@deriv/shared';
import { isSessionAvailable } from '../../Helpers/start-date';

type TRestParams = [Partial<TRuleOptions<TTradeStore>>, TTradeStore, TTradeStore | undefined];
type TExtendedRuleOptions = TRuleOptions<TTradeStore> & { condition: (store: TTradeStore) => boolean; message: string };

const mocked_store = {
    barrier_count: 2,
    contract_start_type: 'test_spot',
    form_components: ['barrier'],
    has_stop_loss: true,
    has_take_profit: true,
    stop_loss: false,
    start_date: 'start_date',
    take_profit: false,
} as unknown as TTradeStore;

const mocked_rest_params: TRestParams = [
    { min: 0, max: 10 },
    mocked_store,
    {
        barrier_1: '+120',
        barrier_2: '-100',
    } as TTradeStore,
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
        expect((returned_validation_rules.stop_loss.rules[0][1] as TExtendedRuleOptions).message).toBe(
            'Please enter a stop loss amount.'
        );
        expect((returned_validation_rules.stop_loss.rules[0][1] as TExtendedRuleOptions).condition(mocked_store)).toBe(
            true
        );
    });

    it('should contain rules for take_profit', () => {
        expect(returned_validation_rules).toHaveProperty('take_profit');
        expect((returned_validation_rules.take_profit.rules[0][1] as TExtendedRuleOptions).message).toBe(
            'Please enter a take profit amount.'
        );
        expect(
            (returned_validation_rules.take_profit.rules[0][1] as TExtendedRuleOptions).condition(mocked_store)
        ).toBe(true);
    });
});

describe('getValidationRules', () => {
    const returned_validation_rules = getValidationRules();

    it('should contain rules for amount', () => {
        expect(returned_validation_rules).toHaveProperty('amount');
        expect((returned_validation_rules.amount.rules?.[0][1] as TExtendedRuleOptions).message).toBe(
            'Amount is a required field.'
        );
    });

    it('should contain rules for barrier_1', () => {
        expect(returned_validation_rules).toHaveProperty('barrier_1');
        expect(
            (returned_validation_rules.barrier_1.rules?.[0][1] as TExtendedRuleOptions).condition(mocked_store)
        ).toBe(true);
        expect(
            (returned_validation_rules.barrier_1.rules?.[1][1] as TExtendedRuleOptions).condition(mocked_store)
        ).toBe(true);
        expect(
            (returned_validation_rules.barrier_1?.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '-150',
                ...mocked_rest_params
            )
        ).toBe(false);
        expect((returned_validation_rules.barrier_1.rules?.[2][1] as TExtendedRuleOptions).message).toBe(
            'Higher barrier must be higher than lower barrier.'
        );
        expect(
            (returned_validation_rules.barrier_1?.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '+90',
                ...mocked_rest_params
            )
        ).toBe(true);

        mocked_store.barrier_count = 1;
        expect(
            (returned_validation_rules.barrier_1.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '+90',
                ...mocked_rest_params
            )
        ).toBe(true);
        expect(
            (returned_validation_rules.barrier_1.rules?.[3][1] as TExtendedRuleOptions).func?.(
                'unused value',
                mocked_rest_params[0],
                mocked_rest_params[1],
                {
                    barrier_1: '+0',
                    barrier_2: '-100',
                } as TTradeStore
            )
        ).toBe(false);
        expect((returned_validation_rules.barrier_1.rules?.[3][1] as TExtendedRuleOptions).message).toBe(
            'Barrier cannot be zero.'
        );
        expect(
            (returned_validation_rules.barrier_1.rules?.[3][1] as TExtendedRuleOptions).func?.(
                'unused value',
                mocked_rest_params[0],
                {
                    ...mocked_store,
                    is_vanilla: true,
                } as TTradeStore,
                {
                    barrier_1: '+0',
                    barrier_2: '-100',
                } as TTradeStore
            )
        ).toBe(true);
    });

    it('should contain rules for barrier_2', () => {
        mocked_store.barrier_count = 2;

        expect(returned_validation_rules).toHaveProperty('barrier_2');
        expect(
            (returned_validation_rules.barrier_2.rules?.[0][1] as TExtendedRuleOptions).condition(mocked_store)
        ).toBe(true);
        expect(
            (returned_validation_rules.barrier_2.rules?.[1][1] as TExtendedRuleOptions).condition(mocked_store)
        ).toBe(true);
        expect(
            (returned_validation_rules.barrier_2.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '150',
                ...mocked_rest_params
            )
        ).toBe(false);
        expect((returned_validation_rules.barrier_2.rules?.[2][1] as TExtendedRuleOptions).message).toBe(
            'Both barriers should be relative or absolute'
        );
        expect(
            (returned_validation_rules.barrier_2.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '+150',
                ...mocked_rest_params
            )
        ).toBe(true);

        expect(
            (returned_validation_rules.barrier_2.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '+150',
                ...mocked_rest_params
            )
        ).toBe(false);
        expect((returned_validation_rules.barrier_2.rules?.[3][1] as TExtendedRuleOptions).message).toBe(
            'Lower barrier must be lower than higher barrier.'
        );
        expect(
            (returned_validation_rules.barrier_2.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '+90',
                ...mocked_rest_params
            )
        ).toBe(true);
    });

    it('should contain rules for duration', () => {
        expect(returned_validation_rules).toHaveProperty('duration');
        expect((returned_validation_rules.duration.rules?.[0][1] as TExtendedRuleOptions).message).toBe(
            'Duration is a required field.'
        );
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
        expect(
            (returned_validation_rules.start_time.rules?.[0][1] as TExtendedRuleOptions).func?.(
                '11:45:30',
                ...mocked_rest_params
            )
        ).toBe(false);
        expect((returned_validation_rules.start_time.rules?.[0][1] as TExtendedRuleOptions).message).toBe(
            'Please enter the start time in the format "HH:MM".'
        );
        expect(
            (returned_validation_rules.start_time.rules?.[0][1] as TExtendedRuleOptions).func?.(
                '11:45',
                ...mocked_rest_params
            )
        ).toBe(true);

        expect(
            (returned_validation_rules.start_time.rules?.[1][1] as TExtendedRuleOptions).func?.(
                '24:45',
                ...mocked_rest_params
            )
        ).toBe(false);
        expect((returned_validation_rules.start_time.rules?.[1][1] as TExtendedRuleOptions).message).toBe(
            'Hour must be between 0 and 23.'
        );
        expect(
            (returned_validation_rules.start_time.rules?.[1][1] as TExtendedRuleOptions).func?.(
                '12:45',
                ...mocked_rest_params
            )
        ).toBe(true);

        expect(
            (returned_validation_rules.start_time.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '11:77',
                ...mocked_rest_params
            )
        ).toBe(false);
        expect((returned_validation_rules.start_time.rules?.[2][1] as TExtendedRuleOptions).message).toBe(
            'Minute must be between 0 and 59.'
        );
        expect(
            (returned_validation_rules.start_time.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '11:45',
                ...mocked_rest_params
            )
        ).toBe(true);

        expect((returned_validation_rules.start_time.rules?.[3][1] as TExtendedRuleOptions).message).toBe(
            'Start time cannot be in the past.'
        );
        mocked_store.contract_start_type = 'spot';
        expect(
            (returned_validation_rules.start_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '123',
                ...mocked_rest_params
            )
        ).toBe(true);

        mocked_store.contract_start_type = 'test_spot';
        expect(
            (returned_validation_rules.start_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '123',
                ...mocked_rest_params
            )
        ).toBe(false);

        (isTimeValid as jest.Mock).mockReturnValueOnce(true);
        (isSessionAvailable as jest.Mock).mockReturnValueOnce(true);
        expect(
            (returned_validation_rules.start_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '123',
                ...mocked_rest_params
            )
        ).toBe(true);
    });

    it('should contain rules for expiry_time', () => {
        expect(returned_validation_rules).toHaveProperty('expiry_time');
        expect(
            (returned_validation_rules.expiry_time.rules?.[0][1] as TExtendedRuleOptions).func?.(
                '123',
                ...mocked_rest_params
            )
        ).toBe(false);
        expect(
            (returned_validation_rules.expiry_time.rules?.[1][1] as TExtendedRuleOptions).func?.(
                '123',
                ...mocked_rest_params
            )
        ).toBe(false);
        expect(
            (returned_validation_rules.expiry_time.rules?.[2][1] as TExtendedRuleOptions).func?.(
                '123',
                ...mocked_rest_params
            )
        ).toBe(false);

        mocked_store.contract_start_type = 'spot';
        expect(
            (returned_validation_rules.expiry_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '123',
                ...mocked_rest_params
            )
        ).toBe(true);

        mocked_store.contract_start_type = 'test_spot';
        expect(
            (returned_validation_rules.expiry_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '123',
                ...mocked_rest_params
            )
        ).toBe(false);

        (isTimeValid as jest.Mock).mockReturnValueOnce(true);
        (isSessionAvailable as jest.Mock).mockReturnValueOnce(true);
        expect(
            (returned_validation_rules.expiry_time.rules?.[3][1] as TExtendedRuleOptions).func?.(
                '123',
                ...mocked_rest_params
            )
        ).toBe(true);
    });
});
