import React from 'react';
import { useHistory } from 'react-router';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const TradersHubHomeButton = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const history = useHistory();
    const { pathname } = history.location;

    return (
        <div
            data-testid='dt_traders_hub_home_button'
            className={classNames('trading-hub-header__tradershub', {
                'trading-hub-header__tradershub--active': pathname === routes.traders_hub,
            })}
            onClick={() => history.push(routes.traders_hub)}
        >
            <div className='trading-hub-header__tradershub--home-logo'>
                <Icon
                    icon={is_dark_mode_on ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                    size={is_dark_mode_on ? 15 : 17}
                />
            </div>
            <Text className='trading-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
        </div>
    );
});

export default TradersHubHomeButton;
