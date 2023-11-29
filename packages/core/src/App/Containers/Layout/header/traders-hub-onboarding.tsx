import React from 'react';
import { useHistory } from 'react-router';
import { Icon, Popover } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useFeatureFlags } from '@deriv/hooks';
import { useLocalStorage } from 'usehooks-ts';

const TradersHubOnboarding = observer(() => {
    const history = useHistory();
    const { traders_hub, ui } = useStore();
    const { setIsOnboardingVisited, setIsFirstTimeVisit } = traders_hub;
    const { is_dark_mode_on, is_mobile } = ui;
    const { is_next_wallet_enabled } = useFeatureFlags();
    const [, setWalletsOnboarding] = useLocalStorage('walletsOnboarding', '');

    const onClickHandler = is_next_wallet_enabled
        ? () => {
              setWalletsOnboarding('started');
          }
        : () => {
              history.push(routes.onboarding);
              setIsOnboardingVisited(false);
              setIsFirstTimeVisit(false);
          };

    return (
        <div data-testid='dt_traders_hub_onboarding'>
            <div className='traders-hub-header__tradershub--onboarding--logo'>
                <Popover
                    classNameBubble='account-settings-toggle__tooltip'
                    alignment='bottom'
                    message={!is_mobile && <Localize i18n_default_text='View onboarding' />}
                    should_disable_pointer_events
                    zIndex='9999'
                >
                    <Icon
                        data_testid='dt_traders_hub_onboarding_icon'
                        icon={is_dark_mode_on ? 'IcAppstoreTradingHubOnboardingDark' : 'IcAppstoreTradingHubOnboarding'}
                        size={20}
                        onClick={onClickHandler}
                    />
                </Popover>
            </div>
        </div>
    );
});

export default TradersHubOnboarding;
