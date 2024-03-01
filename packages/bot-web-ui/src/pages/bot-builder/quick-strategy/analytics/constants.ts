import { TFormValues } from '../types';

export const form_name = 'ce_bot_quick_strategy_form';
export const STORED_ITEM_NOT_FOUND = 'No results found';
export const LABEL = 'label';
export const LAST_DIGIT_PREDICTION_TRADE_TYPES = ['matchesdiffers', 'overunder'];
export const UNNECESSARY_KEYS = ['action', 'purchase'];

export enum ACTION {
    OPEN = 'open',
    CLOSE = 'close',
    CHOOSE_STRATEGY_TYPE = 'choose_strategy_type',
    SWITCH_STRATEGY_MODE = 'switch_strategy_mode',
    RUN_STRATEGY = 'run_strategy',
    EDIT_STRATEGY = 'edit_strategy',
    CHANGE_PARAMETER_VALUE = 'change_parameter_value',
    INFO_POPUP_OPEN = 'info_popup_open',
    LOSS_THRESHOLD_WARNING_POPUP = 'loss_threshold_warning_popup',
    LEARN_MORE_EXPANSION = 'learn_more_expansion',
    LEARN_MORE_COLLAPSE = 'learn_more_collapse',
}

export enum DURATION_TYPE_MAP {
    t = 'ticks',
    s = 'seconds',
    m = 'minutes',
    h = 'hours',
    d = 'days',
}

export enum PARAMETER_TYPE_MAP {
    symbol = 'asset_type',
    tradetype = 'trade_type',
    type = 'purchase_condition',
    stake = 'initial_stake',
    profit = 'profit_threshold',
    loss = 'loss_threshold',
    size = 'size',
    unit = 'unit',
    max_stake = 'max_stake',
    durationtype = 'duration_type',
    duration = 'duration_value',
    last_digit_prediction = 'last_digit_prediction',
}

export enum LOSS_THRESHOLD_WARNING_POPUP_CTA {
    edit_the_amount = 'edit_the_amount',
    yes_continue = 'yes_continue',
}

export type TFormStrategy = {
    form_values: TFormValues;
} & TSelectedStrategy;

export type TSelectedStrategy = {
    selected_strategy: string;
};
