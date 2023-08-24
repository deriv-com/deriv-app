import React from 'react';
import { Button, Icon, Popover } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { BinaryLink } from 'App/Components/Routes';
import ShowNotifications from './show-notifications';
import TradersHubOnboarding from './traders-hub-onboarding';

type TDefaultMobileLinks = {
    handleClickCashier: () => void;
};

const DefaultMobileLinks = ({ handleClickCashier }: TDefaultMobileLinks) => (
    <React.Fragment>
        <div className='trading-hub-header__menu-right--items--onboarding'>
            <TradersHubOnboarding />
        </div>
        <div className='trading-hub-header__menu-right--items--notifications'>
            <ShowNotifications />
        </div>
        <Popover
            alignment='bottom'
            classNameBubble='account-settings-toggle__tooltip'
            message={localize('Manage account settings')}
            should_disable_pointer_events
            zIndex='9999'
        >
            <BinaryLink className='trading-hub-header__setting' to={routes.personal_details}>
                <Icon icon='IcUserOutline' size={20} />
            </BinaryLink>
        </Popover>
        <div className='trading-hub-header__cashier-button'>
            <Button primary small onClick={handleClickCashier}>
                <Localize i18n_default_text='Cashier' />
            </Button>
        </div>
    </React.Fragment>
);

export default DefaultMobileLinks;
