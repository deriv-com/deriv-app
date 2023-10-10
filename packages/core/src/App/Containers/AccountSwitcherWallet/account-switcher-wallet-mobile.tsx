import React from 'react';
import { useHistory } from 'react-router';
import { Button, Icon, MobileDialog, Text } from '@deriv/components';
import { useWalletAccountsList } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { AccountSwitcherWalletList } from './account-switcher-wallet-list';
import './account-switcher-wallet-mobile.scss';

type TAccountSwitcherWalletMobile = {
    is_visible: boolean;
    toggle: (value: boolean) => void;
};

export const AccountSwitcherWalletMobile = ({ is_visible, toggle }: TAccountSwitcherWalletMobile) => {
    const { data: wallets } = useWalletAccountsList();
    const history = useHistory();
    const dtrade_account_wallets = React.useMemo(() => wallets?.filter(wallet => wallet.dtrade_loginid), [wallets]);

    const closeAccountsDialog = React.useCallback(() => {
        toggle(false);
    }, [toggle]);

    const handleTradersHubRedirect = async () => {
        closeAccountsDialog();
        history.push(routes.traders_hub);
    };

    const footer = (
        <div onClick={handleTradersHubRedirect} className='account-switcher-wallet-mobile__footer'>
            <Text weight='bold' size='xs'>
                <Localize i18n_default_text='Looking for CFDs? Go to Trader’s hub' />
            </Text>
            <Icon icon='IcChevronRightBold' />
        </div>
    );

    return (
        <MobileDialog
            portal_element_id='deriv_app'
            footer={footer}
            visible={is_visible}
            onClose={closeAccountsDialog}
            has_close_icon
            has_full_height
            title={<Localize i18n_default_text='Deriv Apps accounts' />}
        >
            <div className='account-switcher-wallet-mobile'>
                <AccountSwitcherWalletList wallets={dtrade_account_wallets} closeAccountsDialog={closeAccountsDialog} />
                <Button className='account-switcher-wallet-mobile__button' has_effect primary large>
                    <Localize i18n_default_text='Manage funds' />
                </Button>
            </div>
        </MobileDialog>
    );
};
