import React from 'react';
import { useHistory } from 'react-router';
import { Button, Icon, MobileDialog, Text } from '@deriv-app/components';
import { routes } from '@deriv-app/shared';
import { Localize } from '@deriv-app/translations';
import { AccountSwitcherWalletList } from './account-switcher-wallet-list';
import { useStoreWalletAccountsList } from '@deriv-app/hooks';
import { observer } from '@deriv-app/stores';
import './account-switcher-wallet-mobile.scss';

type TAccountSwitcherWalletMobile = {
    loginid: string;
    is_visible: boolean;
    toggle: (value: boolean) => void;
};

export const AccountSwitcherWalletMobile = observer(({ is_visible, toggle, loginid }: TAccountSwitcherWalletMobile) => {
    const history = useHistory();
    const { data: wallet_list } = useStoreWalletAccountsList();

    const dtrade_account_wallets = wallet_list?.filter(wallet => wallet.dtrade_loginid);

    const closeAccountsDialog = React.useCallback(() => {
        toggle(false);
    }, [toggle]);

    const handleTradersHubRedirect = () => {
        closeAccountsDialog();
        history.push(routes.traders_hub);
    };

    const handleManageFundsRedirect = () => {
        closeAccountsDialog();
        history.push(routes.wallets_transfer, { toAccountLoginId: loginid });
    };

    const footer = (
        <button className='account-switcher-wallet-mobile__footer' onClick={handleTradersHubRedirect} type='button'>
            <Text weight='normal' size='xs'>
                <Localize i18n_default_text='Looking for CFDs? Go to Trader’s Hub' />
            </Text>
            <Icon icon='IcChevronRightBold' />
        </button>
    );

    return (
        <MobileDialog
            portal_element_id='deriv_app'
            footer={footer}
            visible={is_visible}
            onClose={closeAccountsDialog}
            has_close_icon
            has_full_height
            title={<Localize i18n_default_text='Options accounts' />}
        >
            <div className='account-switcher-wallet-mobile'>
                <AccountSwitcherWalletList wallets={dtrade_account_wallets} closeAccountsDialog={closeAccountsDialog} />
                <Button
                    className='account-switcher-wallet-mobile__button'
                    has_effect
                    primary
                    large
                    onClick={handleManageFundsRedirect}
                >
                    <Localize i18n_default_text='Manage funds' />
                </Button>
            </div>
        </MobileDialog>
    );
});
