import { Analytics, TEvents } from '@deriv-com/analytics';
import { TFormValues } from '../types';

const form_name = 'ce_bot_quick_strategy_form';

enum ACTION {
    OPEN = 'open',
    CLOSE = 'close',
    CHOOSE_STRATEGY_TYPE = 'choose_strategy_type',
    SWITCH_STRATEGY_MODE = 'switch_strategy_mode',
    RUN_STRATEGY = 'run_strategy',
    EDIT_STRATEGY = 'edit_strategy',
    CHANGE_PARAMETER_VALUE = 'change_parameter_value',
}

enum DURATION_TYPE_MAP {
    t = 'ticks',
    s = 'seconds',
    m = 'minutes',
    h = 'hours',
    d = 'days',
}

const generateParamterData = (form_values: TFormValues) => {
    ['action', 'purchase'].forEach(property => {
        delete form_values[property];
    });
    const { symbol, tradetype, type, durationtype, duration, ...rest } = form_values;
    const duration_type = DURATION_TYPE_MAP[durationtype ?? 't'];

    return {
        trade_parameters: {
            asset_type: symbol,
            trade_type: tradetype,
            purchase_condition: type,
            duration_type,
            duration_value: duration,
        },
        varied_parameters: {
            ...rest,
        },
    };
};

export const rudderStackSendQsOpenEvent = () => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.OPEN,
        form_name,
        form_source: 'ce_bot_builder_form',
    });
};

export const rudderStackSendQsCloseEvent = ({
    strategy_switcher_mode,
    strategy_type,
    form_values,
}: TEvents['ce_bot_quick_strategy_form'] & {
    form_values: TFormValues;
}) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.CLOSE,
        form_name,
        strategy_type,
        strategy_switcher_mode,
        ...generateParamterData(form_values),
    });
};

export const rudderStackSendQsRunStrategyEvent = ({
    strategy_switcher_mode,
    strategy_type,
    form_values,
}: TEvents['ce_bot_quick_strategy_form'] & {
    form_values: TFormValues;
}) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.RUN_STRATEGY,
        form_name,
        strategy_type,
        strategy_switcher_mode,
        ...generateParamterData(form_values),
    });
};

export const rudderStackSendQsEditStrategyEvent = ({
    strategy_switcher_mode,
    strategy_type,
    form_values,
}: TEvents['ce_bot_quick_strategy_form'] & {
    form_values: TFormValues;
}) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.EDIT_STRATEGY,
        form_name,
        strategy_type,
        strategy_switcher_mode,
        ...generateParamterData(form_values),
    });
};

export const rudderStackSendQsStrategyChangeEvent = ({ strategy_type }: TEvents['ce_bot_quick_strategy_form']) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.CHOOSE_STRATEGY_TYPE,
        form_name,
        strategy_type,
    });
};

export const rudderStackSendQsSelectedTabEvent = ({
    strategy_switcher_mode,
}: TEvents['ce_bot_quick_strategy_form']) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.SWITCH_STRATEGY_MODE,
        form_name,
        strategy_switcher_mode,
    });
};

export const rudderStackSendQsParameterChangeEvent = ({
    parameter_type,
    parameter_value,
    parameter_field_type,
    manual_parameter_input,
    plus_minus_push,
}: TEvents['ce_bot_quick_strategy_form']) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.CHANGE_PARAMETER_VALUE,
        form_name,
        parameter_type,
        parameter_value,
        parameter_field_type,
        plus_minus_push,
        manual_parameter_input,
    });
};
