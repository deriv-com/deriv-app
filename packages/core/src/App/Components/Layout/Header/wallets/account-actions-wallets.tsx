import React from 'react';
import { useHistory } from 'react-router';
import { routes, isTabletOs, TRoute } from '@deriv/shared';
import { Button, Icon, Popover } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { LoginButton } from '../login-button.jsx';
import { SignupButton } from '../signup-button.jsx';
import { BinaryLink } from '../../../Routes/index.js';
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
    const accountSettings = (
        <BinaryLink className='account-settings-toggle' to={routes.personal_details}>
            <Icon icon='IcUserOutline' />
        </BinaryLink>
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
    const { is_logged_in, accounts, loginid } = client;
    const { openRealAccountSignup, toggleAccountsDialog, is_accounts_switcher_on } = ui;
    const { isMobile } = useDevice();
    const { is_notifications_visible, notifications: notificationsArray, toggleNotificationsModal } = notifications;

    const notifications_count = notificationsArray?.length;

    const active_account = accounts?.[loginid ?? ''];
    const is_virtual = active_account?.is_virtual;
    const currency = active_account?.currency;

    const isCurrencyButtonVisible = !isMobile && !is_traders_hub_routes && !is_virtual && !currency;
    const isManageFundsButtonVisible = !isMobile && !is_traders_hub_routes && currency;

    const history = useHistory();

    const handleManageFundsRedirect = () => {
        localStorage.setItem('redirect_to_th_os', 'wallet');
        // Cast the route to any to bypass TypeScript error
        history.push(routes.wallets_transfer, { toAccountLoginId: loginid });
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
                is_mobile={isMobile}
            />
            {!isMobile && <AccountSettingsToggle />}
        </>
    );
});

export { AccountActionsWallets };
