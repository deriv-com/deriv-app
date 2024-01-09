import { localize } from '@deriv/translations';
import { isHourValid, isMinuteValid, isTimeValid, toMoment, TRuleOptions } from '@deriv/shared';
import { isSessionAvailable } from '../Helpers/start-date';
import { TTradeStore } from 'Types';

type TValidationRules = {
    [key: string]: {
        rules?: Array<string | TRuleOptions<TTradeStore>>[];
        trigger?: string;
    };
};

const tradeSpecificBarrierCheck = (is_vanilla: boolean, input: number) => is_vanilla || input !== 0;

export const getValidationRules = (): TValidationRules => ({
    amount: {
        rules: [
            ['req', { message: localize('Amount is a required field.') }],
            ['number', { min: 0, type: 'float' }],
        ],
    },
    barrier_1: {
        rules: [
            [
                'req',
                {
                    condition: store => !!store.barrier_count && store.form_components.indexOf('barrier') > -1,
                    message: localize('Barrier is a required field.'),
                },
            ],
            ['barrier', { condition: (store: TTradeStore) => !!store.barrier_count }],
            [
                'custom',
                {
                    func: (value: TTradeStore['barrier_1'], options, store, inputs) =>
                        Number(store?.barrier_count) > 1 ? +value > Number(inputs?.barrier_2) : true,
                    message: localize('Higher barrier must be higher than lower barrier.'),
                },
            ],
            [
                'custom',
                {
                    func: (value: TTradeStore['barrier_1'], options, store, inputs) =>
                        /^[+-]/.test(inputs?.barrier_1 ?? '')
                            ? tradeSpecificBarrierCheck(!!store?.is_vanilla, Number(inputs?.barrier_1))
                            : true,
                    message: localize('Barrier cannot be zero.'),
                },
            ],
        ],
        trigger: 'barrier_2',
    },
    barrier_2: {
        rules: [
            [
                'req',
                {
                    condition: store => store.barrier_count > 1 && store.form_components.indexOf('barrier') > -1,
                    message: localize('Barrier is a required field.'),
                },
            ],
            ['barrier', { condition: (store: TTradeStore) => !!store.barrier_count }],
            [
                'custom',
                {
                    func: (value: TTradeStore['barrier_2'], options, store, inputs) =>
                        (/^[+-]/g.test(inputs?.barrier_1 ?? '') && /^[+-]/g.test(value)) ||
                        (/^(?![+-])/g.test(inputs?.barrier_1 ?? '') && /^(?![+-])/g.test(value)),
                    message: localize('Both barriers should be relative or absolute'),
                },
            ],
            [
                'custom',
                {
                    func: (value: TTradeStore['barrier_2'], options, store, inputs) =>
                        Number(inputs?.barrier_1) > +value,
                    message: localize('Lower barrier must be lower than higher barrier.'),
                },
            ],
        ],
        trigger: 'barrier_1',
    },
    duration: {
        rules: [['req', { message: localize('Duration is a required field.') }]],
    },
    start_date: {
        trigger: 'start_time',
    },
    expiry_date: {
        trigger: 'expiry_time',
    },
    start_time: {
        rules: [
            [
                'custom',
                {
                    func: (value: TTradeStore['start_time'], options, store) =>
                        store?.contract_start_type === 'spot' || isTimeValid(value ?? ''),
                    message: localize('Please enter the start time in the format "HH:MM".'),
                },
            ],
            [
                'custom',
                {
                    func: (value: TTradeStore['start_time'], options, store) =>
                        store?.contract_start_type === 'spot' || isHourValid(value ?? ''),
                    message: localize('Hour must be between 0 and 23.'),
                },
            ],
            [
                'custom',
                {
                    func: (value: TTradeStore['start_time'], options, store) =>
                        store?.contract_start_type === 'spot' || isMinuteValid(value ?? ''),
                    message: localize('Minute must be between 0 and 59.'),
                },
            ],
            [
                'custom',
                {
                    func: (value: TTradeStore['start_time'], options, store) => {
                        if (store?.contract_start_type === 'spot') return true;
                        if (!isTimeValid(value ?? '')) return false;
                        const start_moment = toMoment(store?.start_date);
                        const start_moment_clone = start_moment.clone();
                        const [h, m] = value?.split(':') ?? [];
                        return isSessionAvailable(
                            store?.sessions,
                            start_moment_clone.hour(+h).minute(+m),
                            start_moment
                        );
                    },
                    message: localize('Start time cannot be in the past.'),
                },
            ],
        ],
    },
    expiry_time: {
        rules: [
            [
                'custom',
                {
                    func: (value: TTradeStore['expiry_time'], options, store) =>
                        store?.contract_start_type === 'spot' || isTimeValid(value ?? ''),
                    message: localize('Please enter the expiry time in the format "HH:MM".'),
                },
            ],
            [
                'custom',
                {
                    func: (value: TTradeStore['expiry_time'], options, store) =>
                        store?.contract_start_type === 'spot' || isHourValid(value ?? ''),
                    message: localize('Hour must be between 0 and 23.'),
                },
            ],
            [
                'custom',
                {
                    func: (value: TTradeStore['expiry_time'], options, store) =>
                        store?.contract_start_type === 'spot' || isMinuteValid(value ?? ''),
                    message: localize('Minute must be between 0 and 59.'),
                },
            ],
            [
                'custom',
                {
                    func: (value: TTradeStore['expiry_time'], options, store) => {
                        if (store?.contract_start_type === 'spot') return true;
                        if (!isTimeValid(value ?? '')) return false;
                        const start_moment = toMoment(store?.start_date);
                        const start_moment_clone = start_moment.clone();
                        const [h, m] = value?.split(':') ?? [];
                        return isSessionAvailable(
                            store?.sessions,
                            start_moment_clone.hour(+h).minute(+m),
                            start_moment
                        );
                    },
                    message: localize('Expiry time cannot be in the past.'),
                },
            ],
        ],
    },
    ...getMultiplierValidationRules(),
});

export const getMultiplierValidationRules = () => ({
    stop_loss: {
        rules: [
            [
                'req',
                {
                    condition: (store: TTradeStore) => store.has_stop_loss && !store.stop_loss,
                    message: localize('Please enter a stop loss amount.'),
                },
            ],
        ],
    },
    take_profit: {
        rules: [
            [
                'req',
                {
                    condition: (store: TTradeStore) => store.has_take_profit && !store.take_profit,
                    message: localize('Please enter a take profit amount.'),
                },
            ],
        ],
    },
});
