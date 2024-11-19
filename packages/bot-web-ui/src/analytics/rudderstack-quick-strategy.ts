import { TEvents } from '@deriv-com/analytics';
import { ACTION, form_name, type TFormStrategy } from './constants';
import { getRsStrategyType, getTradeParameterData } from './utils';
import { cacheTrackEvents } from '@deriv/shared';

export const rudderStackSendQsRunStrategyEvent = ({
    form_values,
    selected_strategy,
}: TEvents['ce_bot_form'] & TFormStrategy) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.RUN_QUICK_STRATEGY,
                    form_name,
                    subform_name: 'quick_strategy',
                    strategy_name: getRsStrategyType(selected_strategy),
                    ...getTradeParameterData({ form_values, selected_strategy }),
                },
            },
        },
    ]);
};

export const rudderStackSendQsEditStrategyEvent = ({
    form_values,
    selected_strategy,
}: TEvents['ce_bot_form'] & TFormStrategy) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.EDIT_QUICK_STRATEGY,
                    form_name,
                    subform_name: 'quick_strategy',
                    strategy_name: getRsStrategyType(selected_strategy),
                    ...getTradeParameterData({ form_values, selected_strategy }),
                },
            },
        },
    ]);
};

export const rudderStackSendQsSelectedTabEvent = ({ quick_strategy_tab }: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.SWITCH_QUICK_STRATEGY_TAB,
                    form_name,
                    subform_name: 'quick_strategy',
                    quick_strategy_tab,
                },
            },
        },
    ]);
};
