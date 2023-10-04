import React from 'react';
import { Button, Icon, Popover } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { BinaryLink } from 'App/Components/Routes';
import ShowNotifications from './show-notifications';
import TradersHubOnboarding from './traders-hub-onboarding';

type TDefaultMobileLinks = {
    handleClickCashier: () => void;
    is_next_wallet_enabled?: boolean;
};

const DefaultMobileLinks = React.memo(({ handleClickCashier, is_next_wallet_enabled = false }: TDefaultMobileLinks) => (
    <React.Fragment>
        <div className='traders-hub-header__menu-right--items--onboarding'>
            <TradersHubOnboarding />
        </div>
        <div className='traders-hub-header__menu-right--items--notifications'>
            <ShowNotifications />
        </div>
        <Popover
            alignment='bottom'
            classNameBubble='account-settings-toggle__tooltip'
            message={<Localize i18n_default_text='Manage account settings' />}
            should_disable_pointer_events
            zIndex='9999'
        >
            <BinaryLink className='traders-hub-header__setting' to={routes.personal_details}>
                <Icon icon='IcUserOutline' size={20} />
            </BinaryLink>
        </Popover>
        {!is_next_wallet_enabled && (
            <div className='traders-hub-header__cashier-button'>
                <Button primary small onClick={handleClickCashier}>
                    <Localize i18n_default_text='Cashier' />
                </Button>
            </div>
        )}
    </React.Fragment>
));

DefaultMobileLinks.displayName = 'DefaultMobileLinks';

export default DefaultMobileLinks;
