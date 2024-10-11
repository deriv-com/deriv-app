import React from 'react';
import { useOauth2 } from '@deriv/hooks';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';

/**
 * Content to be displayed in  the side bar
 * @name TradingHubLogout
 * @param handleOnLogout - function to handle action when user click on logout
 * @returns React Component
 */
const TradingHubLogout = ({ handleOnLogout }: { handleOnLogout: () => Promise<void> }) => {
    const { oAuthLogout } = useOauth2({ handleLogout: handleOnLogout });
    return (
        <div
            className='dc-vertical-tab__header-account__logout-tab'
            onClick={oAuthLogout}
            data-testid='dt_logout_tab'
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    oAuthLogout();
                }
            }}
            role='button'
            tabIndex={0}
        >
            <div className='dc-vertical-tab__header-account__logout'>
                <Icon icon='IcLogout' className='dc-vertical-tab__header-account__logout--icon' />
                <Text size='xs' weight='bold'>
                    <Localize i18n_default_text='Log out' />
                </Text>
            </div>
        </div>
    );
};

export default TradingHubLogout;
