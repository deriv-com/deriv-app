import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Icon, Popover } from '@deriv/components';
import { routes, formatMoney, isTabletOs } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { LoginButton } from './login-button.jsx';
import { SignupButton } from './signup-button.jsx';
import ToggleNotifications from './toggle-notifications.jsx';
import { BinaryLink } from '../../Routes/index.js';
import 'Sass/app/_common/components/account-switcher.scss';
import { useDevice } from '@deriv-com/ui';

type TUiStore = ReturnType<typeof useStore>['ui'];

type TAccountActionsProps = {
    acc_switcher_disabled_message: string;
    account_type: string;
    balance: string | number;
    currency: string;
    disableApp: () => void;
    enableApp: () => void;
    is_acc_switcher_on: boolean;
    is_acc_switcher_disabled: boolean;
    is_eu: boolean;
    is_notifications_visible: boolean;
    is_logged_in: boolean;
    is_traders_hub_routes: boolean;
    is_virtual: boolean;
    notifications_count: number;
    onClickDeposit: () => void;
    toggleAccountsDialog: () => void;
    toggleNotifications: () => void;
    openRealAccountSignup: TUiStore['openRealAccountSignup'];
};

const AccountInfo = React.lazy(
    () =>
        import(
            /* webpackChunkName: "account-info", webpackPreload: true */ 'App/Components/Layout/Header/account-info.jsx'
        )
);

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
            zIndex={'9999'}
        >
            {accountSettings}
        </Popover>
    );
};

const NotificationsToggle = ({
    count,
    is_visible,
    toggleDialog,
}: {
    count?: number;
    is_visible?: boolean;
    toggleDialog?: () => void;
}) => (
    <ToggleNotifications
        count={count}
        is_visible={is_visible}
        toggleDialog={toggleDialog}
        tooltip_message={<Localize i18n_default_text='View notifications' />}
        should_disable_pointer_events
        showPopover={!isTabletOs}
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

const DepositButton = ({ onClickDeposit }: { onClickDeposit: () => void }) => (
    <Button className='acc-info__button' has_effect text={localize('Deposit')} onClick={onClickDeposit} primary />
);

const LoggedOutView = () => (
    <>
        <LoginButton className='acc-info__button' />
        <SignupButton className='acc-info__button' />
    </>
);

const AccountActionsComponent = ({
    acc_switcher_disabled_message,
    account_type,
    balance,
    currency,
    disableApp,
    enableApp,
    is_acc_switcher_on,
    is_acc_switcher_disabled,
    is_eu,
    is_logged_in,
    is_notifications_visible,
    is_traders_hub_routes,
    is_virtual,
    notifications_count,
    onClickDeposit,
    openRealAccountSignup,
    toggleAccountsDialog,
    toggleNotifications,
}: TAccountActionsProps) => {
    const { isMobile } = useDevice();
    const location = useLocation();

    const isDepositButtonVisible =
        !isMobile && !is_traders_hub_routes && currency && !location.pathname.includes(routes.cashier);
    const isCurrencyButtonVisible = !isMobile && !is_traders_hub_routes && !is_virtual && !currency;

    const formattedBalance = balance != null ? formatMoney(currency, balance, true) : undefined;

    const renderAccountInfo = () => (
        <React.Suspense fallback={<div />}>
            <AccountInfo
                acc_switcher_disabled_message={acc_switcher_disabled_message}
                account_type={account_type}
                balance={formattedBalance}
                is_disabled={is_acc_switcher_disabled}
                is_eu={is_eu}
                is_virtual={is_virtual}
                currency={currency}
                is_dialog_on={is_acc_switcher_on}
                toggleDialog={toggleAccountsDialog}
                {...(isMobile && {
                    disableApp,
                    enableApp,
                    is_mobile: true,
                })}
            />
        </React.Suspense>
    );

    if (!is_logged_in) {
        return <LoggedOutView />;
    }

    return (
        <React.Fragment>
            {isCurrencyButtonVisible && <CurrencyButton openRealAccountSignup={openRealAccountSignup} />}
            {isDepositButtonVisible && <DepositButton onClickDeposit={onClickDeposit} />}
            {!is_traders_hub_routes && renderAccountInfo()}
            <NotificationsToggle
                count={notifications_count}
                is_visible={is_notifications_visible}
                toggleDialog={toggleNotifications}
            />
            {!isMobile && <AccountSettingsToggle />}
        </React.Fragment>
    );
};

AccountActionsComponent.displayName = 'AccountActions';

const AccountActions = React.memo(AccountActionsComponent);

export { AccountActions };
