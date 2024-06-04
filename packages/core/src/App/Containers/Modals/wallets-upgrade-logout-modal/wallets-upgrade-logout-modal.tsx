import React from 'react';
import Cookies from 'js-cookie';
import { Dialog, Icon, Text } from '@deriv/components';
import { redirectToLogin, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getLanguage, localize, Localize } from '@deriv/translations';
import './wallets-upgrade-logout-modal.scss';

const WalletsUpgradeLogoutModal = observer(() => {
    const { client, ui } = useStore();
    const { logout } = client;
    const { is_mobile } = ui;

    return (
        <Dialog
            className='wallets-upgrade-logout-modal'
            confirm_button_text={localize('Log out')}
            onConfirm={() => {
                Cookies.set('recent_wallets_migration', 'true', {
                    path: '/', // not available on other subdomains
                    expires: 0.5, // 12 hours expiration time
                    secure: true,
                });
                logout().then(() => {
                    window.location.href = routes.traders_hub;
                    redirectToLogin(false, getLanguage());
                });
            }}
            is_closed_on_confirm
            is_visible
            dismissable={false}
            has_close_icon={false}
        >
            <Icon className='wallets-upgrade-logout-modal__pic' icon='IcWalletUpgradeLogout' />
            <div className='wallets-upgrade-logout-modal__content'>
                <Localize
                    i18n_default_text="<0>You're almost there!</0>"
                    components={[<Text key={0} weight='bold' size={is_mobile ? 's' : 'm'} />]}
                />
                <Localize
                    i18n_default_text='<0>To complete your Wallet setup, log out and then log in again.</0>'
                    components={[<Text align={is_mobile ? 'center' : 'left'} key={0} size={is_mobile ? 'xxs' : 's'} />]}
                />
            </div>
        </Dialog>
    );
});

export default WalletsUpgradeLogoutModal;
