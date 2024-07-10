import React from 'react';
import { Text, Icon } from '@deriv-app/components';
import { Localize } from '@deriv-app/translations';

/**
 * Content to be displayed in  the side bar
 * @name TradingHubLogout
 * @param handleOnLogout - function to handle action when user click on logout
 * @returns React Component
 */
const TradingHubLogout = ({ handleOnLogout }: { handleOnLogout: () => void }) => (
    <div className='dc-vertical-tab__header-account__logout-tab' onClick={handleOnLogout} data-testid='dt_logout_tab'>
        <div className='dc-vertical-tab__header-account__logout'>
            <Icon icon='IcLogout' className='dc-vertical-tab__header-account__logout--icon' />
            <Text size='xs' weight='bold'>
                <Localize i18n_default_text='Log out' />
            </Text>
        </div>
    </div>
);

export default TradingHubLogout;
