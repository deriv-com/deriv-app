import React from 'react';
import { useHistory } from 'react-router';
import { Icon, Popover } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';

const TradersHubOnboarding = observer(() => {
    const history = useHistory();
    const { traders_hub, ui } = useStore();
    const { setIsOnboardingVisited } = traders_hub;
    const { is_dark_mode_on } = ui;

    return (
        <div data-testid='dt_traders_hub_onboarding'>
            <Popover
                classNameBubble='account-settings-toggle__tooltip'
                alignment='bottom'
                message={localize('View onboarding')}
                should_disable_pointer_events
                zIndex='9999'
            >
                <Icon
                    data_testid='dt_traders_hub_onboarding_icon'
                    icon={is_dark_mode_on ? 'IcAppstoreTradingHubOnboardingDark' : 'IcAppstoreTradingHubOnboarding'}
                    size={20}
                    onClick={() => {
                        history.push(routes.onboarding);
                        setIsOnboardingVisited(false);
                    }}
                />
            </Popover>
        </div>
    );
});

export default TradersHubOnboarding;
