import { Analytics, TEvents } from '@deriv-com/analytics';
import { TDurationType } from '../types';
import {
    ACTION,
    DURATION_TYPE_MAP,
    form_name,
    PARAMETER_TYPE_MAP,
    type TFormStrategy,
    type TSelectedStrategy,
} from './constants';
import { getRsStrategyType, getTradeParameterData } from './utils';

export const rudderStackSendQsOpenEvent = () => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.OPEN,
        form_name,
        form_source: 'ce_bot_builder_form',
    });
};

export const rudderStackSendQsCloseEvent = ({
    strategy_switcher_mode,
    selected_strategy,
    form_values,
}: TEvents['ce_bot_quick_strategy_form'] & TFormStrategy) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.CLOSE,
        form_name,
        strategy_type: getRsStrategyType(selected_strategy),
        strategy_switcher_mode,
        ...getTradeParameterData({ form_values, selected_strategy }),
    });
};

export const rudderStackSendQsRunStrategyEvent = ({
    strategy_switcher_mode,
    selected_strategy,
    form_values,
}: TEvents['ce_bot_quick_strategy_form'] & TFormStrategy) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.RUN_STRATEGY,
        form_name,
        strategy_type: getRsStrategyType(selected_strategy),
        strategy_switcher_mode,
        ...getTradeParameterData({ form_values, selected_strategy }),
    });
};

export const rudderStackSendQsEditStrategyEvent = ({
    strategy_switcher_mode,
    selected_strategy,
    form_values,
}: TEvents['ce_bot_quick_strategy_form'] & TFormStrategy) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.EDIT_STRATEGY,
        form_name,
        strategy_type: getRsStrategyType(selected_strategy),
        strategy_switcher_mode,
        ...getTradeParameterData({ form_values, selected_strategy }),
    });
};

export const rudderStackSendQsStrategyChangeEvent = ({ selected_strategy }: TSelectedStrategy) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.CHOOSE_STRATEGY_TYPE,
        form_name,
        strategy_type: getRsStrategyType(selected_strategy),
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
    let modified_parameter_value = parameter_value;
    if (parameter_type === 'durationtype') {
        const tmp_value = parameter_value as TDurationType;
        modified_parameter_value = DURATION_TYPE_MAP[tmp_value ?? 't'];
    }
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.CHANGE_PARAMETER_VALUE,
        form_name,
        parameter_type: PARAMETER_TYPE_MAP[parameter_type as keyof typeof PARAMETER_TYPE_MAP] ?? parameter_type,
        parameter_value: modified_parameter_value,
        parameter_field_type,
        plus_minus_push,
        manual_parameter_input,
    });
};

export const rudderStackSendQsInfoPopupEvent = ({ parameter_type }: TEvents['ce_bot_quick_strategy_form']) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.INFO_POPUP_OPEN,
        form_name,
        parameter_type,
    });
};

export const rudderStackSendQsLossThresholdWarningEvent = ({
    dont_show_checkbox,
    cta_name,
}: TEvents['ce_bot_quick_strategy_form']) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.LOSS_THRESHOLD_WARNING_POPUP,
        form_name,
        dont_show_checkbox,
        cta_name,
    });
};

export const rudderStackSendQsLearnMoreExpansionEvent = ({
    selected_strategy,
    learn_more_title,
}: TEvents['ce_bot_quick_strategy_form'] & TSelectedStrategy) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.LEARN_MORE_EXPANSION,
        form_name,
        strategy_type: getRsStrategyType(selected_strategy),
        learn_more_title,
    });
};

export const rudderStackSendQsLearnMoreCollapseEvent = ({
    selected_strategy,
    learn_more_title,
}: TEvents['ce_bot_quick_strategy_form'] & TSelectedStrategy) => {
    Analytics.trackEvent('ce_bot_quick_strategy_form', {
        action: ACTION.LEARN_MORE_COLLAPSE,
        form_name,
        strategy_type: getRsStrategyType(selected_strategy),
        learn_more_title,
    });
};
