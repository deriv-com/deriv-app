import { Analytics, TEvents } from '@deriv-com/analytics';
import { ACTION, form_name } from './constants';
import { cacheTrackEvents } from '@deriv/shared';

export const rudderStackSendSwitchLoadStrategyTabEvent = ({ load_strategy_tab }: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.SWITCH_LOAD_STRATEGY_TAB,
                    form_name,
                    load_strategy_tab,
                    subform_name: 'load_strategy',
                    subpage_name: 'bot_builder',
                },
            },
        },
    ]);
};
