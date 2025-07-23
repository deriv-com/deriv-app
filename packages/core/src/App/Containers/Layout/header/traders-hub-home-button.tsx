import React from 'react';
import { useHistory, useLocation } from 'react-router';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { getDomainUrl, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useIsHubRedirectionEnabled } from '@deriv/hooks';

const TradersHubHomeButton = observer(() => {
    const { client } = useStore();
    const history = useHistory();
    const location = useLocation();
    const { isHubRedirectionEnabled } = useIsHubRedirectionEnabled();
    const { has_wallet } = client;
    const { pathname } = location;

    const handleTradershubRedirect = () => {
        if (isHubRedirectionEnabled && has_wallet) {
            const PRODUCTION_REDIRECT_URL = `https://hub.${getDomainUrl()}/tradershub`;
            const STAGING_REDIRECT_URL = `https://staging-hub.${getDomainUrl()}/tradershub`;
            const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;

            const url_query_string = window.location.search;
            const url_params = new URLSearchParams(url_query_string);
            const account_currency = url_params.get('account') || window.sessionStorage.getItem('account');

            window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=home${account_currency ? `&account=${account_currency}` : ''}`;
        } else {
            history.push(routes.traders_hub);
        }
    };

    return (
        <div
            data-testid='dt_traders_hub_home_button'
            className={classNames('traders-hub-header__tradershub', {
                'traders-hub-header__tradershub--active':
                    pathname === routes.traders_hub || pathname === routes.traders_hub_v2,
            })}
            onClick={handleTradershubRedirect}
        >
            <div className='traders-hub-header__tradershub--home-logo'>
                <Icon icon={'IcAppstoreTradersHubHome'} size={16} />
            </div>
            <Text className='traders-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
        </div>
    );
});

export default TradersHubHomeButton;
