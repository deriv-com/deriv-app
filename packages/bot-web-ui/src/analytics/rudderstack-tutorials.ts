import { TEvents } from '@deriv-com/analytics';
import { ACTION, form_name, TSelectedStrategy } from './constants';
import { getRsStrategyType } from './utils';
import { cacheTrackEvents } from '@deriv/shared';

export const rudderStackSendSelectQsStrategyGuideEvent = ({ selected_strategy }: TSelectedStrategy) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.SELECT_QUICK_STRATEGY_GUIDE,
                    form_name,
                    subpage_name: 'tutorials',
                    strategy_name: getRsStrategyType(selected_strategy),
                },
            },
        },
    ]);
};

export const rudderStackSendTutorialSearchEvent = ({ search_term }: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.SEARCH,
                    form_name,
                    subpage_name: 'tutorials',
                    search_term,
                },
            },
        },
    ]);
};
