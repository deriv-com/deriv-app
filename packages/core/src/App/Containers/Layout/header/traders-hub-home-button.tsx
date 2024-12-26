import React from 'react';
import { useHistory, useLocation } from 'react-router';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';

const TradersHubHomeButton = observer(() => {
    const { ui, client } = useStore();
    const { is_logged_in, is_wallet_account } = client;
    const { is_dark_mode_on } = ui;
    const history = useHistory();
    const location = useLocation();
    const { pathname } = location;
    const [trigger_login_for_hub_country_list, trigger_login_for_hub_country_list_loaded] =
        useGrowthbookGetFeatureValue({
            featureFlag: 'trigger_login_for_hub_country_list',
        });
    const PRODUCTION_URL = 'app.deriv.com';
    const PRODUCTION_REDIRECT_URL = 'https://hub.deriv.com/tradershub/options';
    const STAGING_REDIRECT_URL = 'https://staging-hub.deriv.com/tradershub/options';

    const onClickTradersHubHomeButton = () => {
        if (
            trigger_login_for_hub_country_list_loaded &&
            trigger_login_for_hub_country_list &&
            is_logged_in &&
            is_wallet_account
        ) {
            const is_production = window.location.hostname === PRODUCTION_URL;
            const redirect_url = is_production ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;
            window.open(redirect_url, '_blank', 'noopener,noreferrer');
            return;
        }
        history.push(routes.traders_hub);
    };

    const TradersHubIcon = is_dark_mode_on ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHomeUpdated';

    return (
        <div
            data-testid='dt_traders_hub_home_button'
            className={classNames('traders-hub-header__tradershub', {
                'traders-hub-header__tradershub--active':
                    pathname === routes.traders_hub || pathname === routes.traders_hub_v2,
            })}
            onClick={onClickTradersHubHomeButton}
        >
            <div className='traders-hub-header__tradershub--home-logo'>
                <Icon icon={TradersHubIcon} size={is_dark_mode_on ? 15 : 17} />
            </div>
            <Text className='traders-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
        </div>
    );
});

export default TradersHubHomeButton;
