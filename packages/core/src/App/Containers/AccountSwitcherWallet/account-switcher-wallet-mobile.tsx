import React from 'react';
import { useHistory } from 'react-router';
import { Button, Icon, MobileDialog, Text } from '@deriv/components';
import { platforms, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { AccountSwitcherWalletList } from './account-switcher-wallet-list';
import { useIsHubRedirectionEnabled, useIsRtl, useStoreWalletAccountsList } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import './account-switcher-wallet-mobile.scss';

type TAccountSwitcherWalletMobile = {
    loginid: string;
    is_visible: boolean;
    toggle: (value: boolean) => void;
};

export const AccountSwitcherWalletMobile = observer(({ is_visible, toggle, loginid }: TAccountSwitcherWalletMobile) => {
    const history = useHistory();
    const isRtl = useIsRtl();
    const { data: wallet_list } = useStoreWalletAccountsList();

    const dtrade_account_wallets = wallet_list?.filter(wallet => wallet.dtrade_loginid);
    const { isHubRedirectionEnabled } = useIsHubRedirectionEnabled();

    const closeAccountsDialog = React.useCallback(() => {
        toggle(false);
    }, [toggle]);

    const handleTradersHubRedirect = () => {
        const url_query_string = window.location.search;
        const url_params = new URLSearchParams(url_query_string);
        const account_currency = url_params.get('account') || window.sessionStorage.getItem('account');
        if (isHubRedirectionEnabled) {
            window.location.assign(
                `${platforms.tradershub_os.url}/redirect?action=redirect_to&redirect_to=cfds${account_currency ? `&account=${account_currency}` : ''}`
            );
            return;
        }
        closeAccountsDialog();
        history.push(routes.traders_hub);
    };

    const handleManageFundsRedirect = () => {
        closeAccountsDialog();
        if (isHubRedirectionEnabled) {
            const PRODUCTION_REDIRECT_URL = 'https://hub.deriv.com/tradershub';
            const STAGING_REDIRECT_URL = 'https://staging-hub.deriv.com/tradershub';
            const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;

            const url_query_string = window.location.search;
            const url_params = new URLSearchParams(url_query_string);
            const account_currency = url_params.get('account') || window.sessionStorage.getItem('account');

            window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=wallet${account_currency ? `&account=${account_currency}` : ''}`;
        } else {
            history.push(routes.wallets_transfer, { toAccountLoginId: loginid });
        }
    };

    const footer = (
        <React.Fragment>
            <hr className='account-switcher-wallet-mobile__divider' />
            <button className='account-switcher-wallet-mobile__footer' onClick={handleTradersHubRedirect} type='button'>
                <Text weight='normal' size='xs'>
                    <Localize i18n_default_text='Looking for CFDs? Go to Trader’s Hub' />
                </Text>
                <Icon icon={isRtl ? 'IcChevronLeftBold' : 'IcChevronRightBold'} />
            </button>
        </React.Fragment>
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
