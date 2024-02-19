import { STRATEGIES } from '../config';
import { TFormData } from '../types';
import {
    DURATION_TYPE_MAP,
    LABEL,
    LAST_DIGIT_PREDICTION_TRADE_TYPES,
    PARAMETER_TYPE_MAP,
    STORED_ITEM_NOT_FOUND,
    TFormStrategy,
    UNNECESSARY_KEYS,
} from './constants';

export const setRsDropdownTextToLocalStorage = (text: string, name: string) => {
    try {
        const current_analytics_data = JSON.parse(localStorage?.getItem('qs-analytics') ?? '{}');
        const new_analytics_data = {
            ...current_analytics_data,
            [name]: text,
        };
        localStorage?.setItem('qs-analytics', JSON.stringify(new_analytics_data));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Rudderstack: unable to set dropdown text');
    }
};

export const getRsDropdownTextFromLocalStorage = () => {
    try {
        return JSON.parse(localStorage?.getItem('qs-analytics') ?? '{}');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Rudderstack: unable to get dropdown text');
        return {};
    }
};

const hasStoredText = (parameter: string) => parameter && parameter !== STORED_ITEM_NOT_FOUND;

export const getRsStrategyType = (selected_strategy: string) => STRATEGIES[selected_strategy]?.rs_strategy_type;

export const getQsActiveTabString = (tab: string) => (tab === 'TRADE_PARAMETERS' ? 'trade parameters' : 'learn more');

const getVariedParametersData = (form_values: TFormData, selected_strategy: string) => {
    const variable_fields = STRATEGIES[selected_strategy]?.fields[1];
    let varied_parameters = {};
    variable_fields?.forEach(field => {
        if (field.type !== LABEL) {
            const field_name = PARAMETER_TYPE_MAP[field.name as keyof typeof PARAMETER_TYPE_MAP] ?? field.name;
            varied_parameters = {
                ...varied_parameters,
                [field_name]: field.name ? form_values[field.name] : '',
            };
        }
    });
    return varied_parameters;
};

export const getTradeParameterData = ({ form_values, selected_strategy }: TFormStrategy) => {
    UNNECESSARY_KEYS.forEach(key => {
        delete form_values[key];
    });
    const { symbol, tradetype, type, durationtype, duration, last_digit_prediction, ...other_params } = form_values;
    const duration_type = DURATION_TYPE_MAP[durationtype ?? 't'];
    const varied_parameters = getVariedParametersData(other_params, selected_strategy);
    const has_last_digit_prediction =
        LAST_DIGIT_PREDICTION_TRADE_TYPES.includes(tradetype ?? '') && last_digit_prediction;
    const stored_texts = getRsDropdownTextFromLocalStorage();

    return {
        trade_parameters: {
            asset_type: hasStoredText(stored_texts?.symbol) ? stored_texts.symbol : symbol,
            trade_type: hasStoredText(stored_texts?.tradetype) ? stored_texts?.tradetype : tradetype,
            purchase_condition: hasStoredText(stored_texts?.type) ? stored_texts?.type : type,
            duration_type,
            duration_value: duration,
            last_digit_prediction: has_last_digit_prediction ? last_digit_prediction : undefined,
        },
        varied_parameters: {
            ...varied_parameters,
        },
    };
};
