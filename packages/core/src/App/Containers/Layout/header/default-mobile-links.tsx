import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@deriv/components';
import { useIsRealAccountNeededForCashier } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { BinaryLink } from 'App/Components/Routes';
import ShowNotifications from './show-notifications';
import TradersHubOnboarding from './traders-hub-onboarding';

const DefaultMobileLinks = React.memo(() => {
    const { client, ui } = useStore();
    const { has_any_real_account, has_wallet, is_virtual } = client;
    const { toggleNeedRealAccountForCashierModal, toggleReadyToDepositModal } = ui;

    const history = useHistory();

    const real_account_needed_for_cashier = useIsRealAccountNeededForCashier();

    const toggleModal = () => {
        if (!has_any_real_account) {
            toggleReadyToDepositModal();
        } else if (history.location.pathname === routes.traders_hub) {
            toggleNeedRealAccountForCashierModal();
        }
    };

    const handleClickCashier = () => {
        if ((!has_any_real_account && is_virtual) || real_account_needed_for_cashier) {
            toggleModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

    return (
        <React.Fragment>
            {has_wallet && (
                <div className='traders-hub-header__menu-right--items--onboarding'>
                    <TradersHubOnboarding />
                </div>
            )}
            <div className='traders-hub-header__menu-right--items--notifications'>
                <ShowNotifications />
            </div>
            <BinaryLink className='account-settings-toggle' to={routes.personal_details}>
                <Icon icon='IcUserOutline' size={20} />
            </BinaryLink>
            {!has_wallet && (
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
