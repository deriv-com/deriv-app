import React from 'react';

import { Button, Icon } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';

import { BinaryLink } from 'App/Components/Routes';

import ShowNotifications from './show-notifications';
import TradersHubOnboarding from './traders-hub-onboarding';
import { useFeatureFlags } from '@deriv/hooks';

type TDefaultMobileLinks = {
    handleClickCashier: () => void;
};

const DefaultMobileLinks = React.memo(({ handleClickCashier }: TDefaultMobileLinks) => {
    const { is_next_wallet_enabled } = useFeatureFlags();
    return (
        <React.Fragment>
            <div className='traders-hub-header__menu-right--items--onboarding'>
                <TradersHubOnboarding />
            </div>
            <div className='traders-hub-header__menu-right--items--notifications'>
                <ShowNotifications />
            </div>
            <BinaryLink className='traders-hub-header__setting' to={routes.personal_details}>
                <Icon icon='IcUserOutline' size={20} />
            </BinaryLink>
            {!is_next_wallet_enabled && (
                <div className='traders-hub-header__cashier-button'>
                    <Button primary small onClick={handleClickCashier}>
                        <Localize i18n_default_text='Cashier' />
                    </Button>
                </div>
            )}
        </React.Fragment>
    );
});

DefaultMobileLinks.displayName = 'DefaultMobileLinks';

export default DefaultMobileLinks;
