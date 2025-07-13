import React from 'react';
import { useHistory } from 'react-router';
import { routes, isTabletOs, getDomainUrl } from '@deriv/shared';
import { Button, Icon, Popover } from '@deriv/components';
import { useIsHubRedirectionEnabled, useAccountSettingsRedirect } from '@deriv/hooks';
import { useDevice } from '@deriv-com/ui';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { LoginButton } from '../login-button.jsx';
import { SignupButton } from '../signup-button.jsx';
import ToggleNotifications from '../toggle-notifications.jsx';
import TradersHubOnboarding from '../../../../Containers/Layout/header/traders-hub-onboarding';
import AccountInfoWallets from './account-info-wallets';
import 'Sass/app/_common/components/account-switcher.scss';

type TUiStore = ReturnType<typeof useStore>['ui'];

type TAccountActionsWallets = {
    is_traders_hub_routes: boolean;
};

// Helper components
const AccountSettingsToggle = () => {
    const { redirect_url } = useAccountSettingsRedirect();

    const accountSettings = (
        <a className='account-settings-toggle' href={redirect_url}>
            <Icon icon='IcUserOutline' />
        </a>
    );

    if (isTabletOs) return accountSettings;

    return (
        <Popover
            classNameBubble='account-settings-toggle__tooltip'
            alignment='bottom'
            message={<Localize i18n_default_text='Manage account settings' />}
            should_disable_pointer_events
            zIndex='9999'
        >
            {accountSettings}
        </Popover>
    );
};

const NotificationsToggle = ({
    count,
    is_visible,
    toggleDialog,
    is_mobile = false,
}: {
    count?: number;
    is_visible?: boolean;
    toggleDialog?: () => void;
    is_mobile?: boolean;
}) => (
    <ToggleNotifications
        count={count}
        is_visible={is_visible}
        toggleDialog={toggleDialog}
        tooltip_message={is_mobile ? undefined : <Localize i18n_default_text='View notifications' />}
        should_disable_pointer_events={!is_mobile}
        showPopover={!is_mobile && !isTabletOs}
    />
);

const CurrencyButton = ({ openRealAccountSignup }: { openRealAccountSignup: TUiStore['openRealAccountSignup'] }) => (
    <div className='set-currency'>
        <Button
            onClick={() => openRealAccountSignup('set_currency')}
            has_effect
            type='button'
            text={localize('Set currency')}
            primary
        />
    </div>
);

const ManageFundsButton = ({ onClick }: { onClick: () => void }) => (
    <Button className='acc-info__button' has_effect text={localize('Manage funds')} onClick={onClick} primary />
);

const LoggedOutView = () => (
    <>
        <LoginButton className='acc-info__button' />
        <SignupButton className='acc-info__button' />
    </>
);

const AccountActionsWallets = observer(({ is_traders_hub_routes }: TAccountActionsWallets) => {
    const { client, ui, notifications } = useStore();
    const { is_logged_in, accounts, loginid, has_wallet } = client;
    const { openRealAccountSignup, toggleAccountsDialog, is_accounts_switcher_on } = ui;
    const { isDesktop } = useDevice();
    const { isHubRedirectionEnabled } = useIsHubRedirectionEnabled();
    const { is_notifications_visible, notifications: notificationsArray, toggleNotificationsModal } = notifications;

    const notifications_count = notificationsArray?.length;

    const active_account = accounts?.[loginid ?? ''];
    const is_virtual = active_account?.is_virtual;
    const currency = active_account?.currency;

    const isCurrencyButtonVisible = isDesktop && !is_traders_hub_routes && !is_virtual && !currency;
    const isManageFundsButtonVisible = isDesktop && !is_traders_hub_routes && currency;

    const history = useHistory();

    const handleManageFundsRedirect = () => {
        if (isHubRedirectionEnabled) {
            const PRODUCTION_REDIRECT_URL = `https://hub.${getDomainUrl()}/tradershub`;
            const STAGING_REDIRECT_URL = `https://staging-hub.${getDomainUrl()}/tradershub`;
            const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;

            const url_query_string = window.location.search;
            const url_params = new URLSearchParams(url_query_string);
            const account_currency = window.sessionStorage.getItem('account') || url_params.get('account');

            window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=wallet${account_currency ? `&account=${account_currency}` : ''}`;
        } else {
            history.push(routes.wallets_transfer as unknown as Parameters<typeof history.push>[0], {
                toAccountLoginId: loginid,
                is_from_dtrader: window.location.pathname?.includes('dtrader'),
            });
        }
    };

    if (!is_logged_in) {
        return <LoggedOutView />;
    }

    return (
        <>
            {isCurrencyButtonVisible && <CurrencyButton openRealAccountSignup={openRealAccountSignup} />}
            {isManageFundsButtonVisible && <ManageFundsButton onClick={handleManageFundsRedirect} />}
            {!is_traders_hub_routes && (
                <AccountInfoWallets is_dialog_on={is_accounts_switcher_on} toggleDialog={toggleAccountsDialog} />
            )}
            {is_traders_hub_routes && <TradersHubOnboarding />}
            <NotificationsToggle
                count={notifications_count}
                is_visible={is_notifications_visible}
                toggleDialog={toggleNotificationsModal}
                is_mobile={!isDesktop}
            />
            {isDesktop && <AccountSettingsToggle />}
        </>
    );
});

export { AccountActionsWallets };
