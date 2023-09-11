import React from 'react';
import { useHistory } from 'react-router';
import { MobileDialog, Button, Modal } from '@deriv/components';
import { useActiveAccount, useWalletAccountsList } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { AccountSwitcherWalletList } from './account-switcher-wallet-list';
import { AccountSwitcherSelectedWalletMobile } from './account-switcher-selected-wallet-mobile';
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

    const active_account = useActiveAccount();

    const selected_account = React.useMemo(
        () =>
            wallets?.find(
                wallet =>
                    wallet.is_active || wallet.linked_to?.some(account => account.loginid === active_account?.loginid)
            ),
        [wallets, active_account]
    );

    const filtered_list = React.useMemo(
        () => dtrade_account_wallets?.filter(wallet => wallet.loginid !== selected_account?.loginid),
        [dtrade_account_wallets, selected_account?.loginid]
    );

    const content = (
        <div className='account-switcher-wallet-mobile'>
            <AccountSwitcherSelectedWalletMobile selected_account={selected_account} />
            <AccountSwitcherWalletList wallets={filtered_list} closeAccountsDialog={closeAccountsDialog} />
            <Modal.Footer className='account-switcher-wallet-mobile__footer-button' has_separator>
                <Button
                    className='account-switcher-wallet-mobile__footer-button'
                    has_effect
                    onClick={handleTradersHubRedirect}
                    secondary
                    small
                >
                    <Localize i18n_default_text='Looking for CFDs? Go to Trader’s hub' />
                </Button>
            </Modal.Footer>
        </div>
    );

    return (
        <MobileDialog
            portal_element_id='deriv_app'
            visible={is_visible}
            onClose={closeAccountsDialog}
            has_close_icon
            has_full_height
            title={<Localize i18n_default_text='Deriv Apps accounts' />}
        >
            {content}
        </MobileDialog>
    );
};
