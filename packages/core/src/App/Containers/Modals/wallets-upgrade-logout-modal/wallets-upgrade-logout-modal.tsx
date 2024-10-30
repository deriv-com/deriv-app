import React from 'react';
import { Analytics, TEvents } from '@deriv-com/analytics';
import Cookies from 'js-cookie';
import { Dialog, Icon, Text } from '@deriv/components';
import { redirectToLogin, routes } from '@deriv/shared';
import { useOauth2 } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { getLanguage, localize, Localize } from '@deriv/translations';
import './wallets-upgrade-logout-modal.scss';

const trackAnalyticsEvent = (
    action: TEvents['ce_tradershub_popup']['action'],
    account_mode: TEvents['ce_tradershub_popup']['account_mode']
) => {
    Analytics.trackEvent('ce_tradershub_popup', {
        action,
        form_name: 'ce_tradershub_popup',
        account_mode,
        popup_name: 'almost_there_wallets_step_3_1',
        popup_type: 'with_cta',
    });
};

const WalletsUpgradeLogoutModal = observer(() => {
    const { client, ui } = useStore();
    const { is_virtual, logout } = client;
    const { is_desktop } = ui;
    const account_mode = is_virtual ? 'demo' : 'real';

    React.useEffect(() => {
        trackAnalyticsEvent('open', account_mode);
    }, [account_mode]);

    const onConfirmHandler = async () => {
        Cookies.set('recent_wallets_migration', 'true', {
            path: '/', // not available on other subdomains
            expires: 0.5, // 12 hours expiration time
            secure: true,
        });
        await logout().then(() => {
            window.location.href = routes.traders_hub;
            redirectToLogin(false, getLanguage());
        });
        trackAnalyticsEvent('click_cta', account_mode);
    };

    const { oAuthLogout } = useOauth2({ handleLogout: onConfirmHandler });

    return (
        <Dialog
            className='wallets-upgrade-logout-modal'
            confirm_button_text={localize('Log out')}
            onConfirm={oAuthLogout}
            is_closed_on_confirm
            is_visible
            dismissable={false}
            has_close_icon={false}
        >
            <Icon className='wallets-upgrade-logout-modal__pic' icon='IcWalletUpgradeLogout' />
            <div className='wallets-upgrade-logout-modal__content'>
                <Localize
                    i18n_default_text="<0>You're almost there!</0>"
                    components={[<Text key={0} weight='bold' size={is_desktop ? 'm' : 's'} />]}
                />
                <Localize
                    i18n_default_text='<0>To complete your Wallet setup, log out and then log in again.</0>'
                    components={[
                        <Text align={is_desktop ? 'left' : 'center'} key={0} size={is_desktop ? 's' : 'xxs'} />,
                    ]}
                />
            </div>
        </Dialog>
    );
});

export default WalletsUpgradeLogoutModal;
