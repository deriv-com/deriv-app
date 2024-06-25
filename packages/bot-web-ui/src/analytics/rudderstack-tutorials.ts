import { Analytics, TEvents } from '@deriv-com/analytics';
import { ACTION, form_name, TSelectedStrategy } from './constants';
import { getRsStrategyType, getSubpageName } from './utils';

export const rudderStackSendSelectQsStrategyGuideEvent = ({ selected_strategy }: TSelectedStrategy) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.SELECT_QUICK_STRATEGY_GUIDE,
        form_name,
        subpage_name: getSubpageName(),
        strategy_name: getRsStrategyType(selected_strategy),
    });
};

export const rudderStackSendTutorialSearchEvent = ({ search_term }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: 'search',
        form_name: 'ce_bot_form',
        subpage_name: getSubpageName(),
        search_term,
    });
};
