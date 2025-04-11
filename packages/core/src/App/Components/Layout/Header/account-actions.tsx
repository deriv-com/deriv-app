import * as PropTypes from 'prop-types';
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
    acc_switcher_disabled_message: string; // Added this property
    account_type: string;
    balance: string | number | undefined;
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
    const { isDesktop } = useDevice();
    const location = useLocation();
    const isDepositButtonVisible = currency && !location.pathname.includes(routes.cashier);

    const accountSettings = (
        <BinaryLink className='account-settings-toggle' to={routes.personal_details}>
            <Icon icon='IcUserOutline' />
        </BinaryLink>
    );

    if (is_logged_in) {
        if (isDesktop) {
            return (
                <React.Fragment>
                    {!is_traders_hub_routes && !is_virtual && !currency && (
                        <div className='set-currency'>
                            <Button
                                onClick={() => openRealAccountSignup('set_currency')}
                                has_effect
                                type='button'
                                text={localize('Set currency')}
                                primary
                            />
                        </div>
                    )}
                    {!is_traders_hub_routes && isDepositButtonVisible && (
                        <Button
                            className='acc-info__button'
                            has_effect
                            text={localize('Deposit')}
                            onClick={onClickDeposit}
                            primary
                        />
                    )}
                    {!is_traders_hub_routes && (
                        <React.Suspense fallback={<div />}>
                            <AccountInfo
                                acc_switcher_disabled_message={acc_switcher_disabled_message}
                                account_type={account_type}
                                balance={
                                    typeof balance === 'undefined' ? balance : formatMoney(currency, balance, true)
                                }
                                is_disabled={is_acc_switcher_disabled}
                                is_eu={is_eu}
                                is_virtual={is_virtual}
                                currency={currency}
                                is_dialog_on={is_acc_switcher_on}
                                toggleDialog={toggleAccountsDialog}
                            />
                        </React.Suspense>
                    )}
                    <ToggleNotifications
                        count={notifications_count}
                        is_visible={is_notifications_visible}
                        toggleDialog={toggleNotifications}
                        tooltip_message={<Localize i18n_default_text='View notifications' />}
                        should_disable_pointer_events
                        showPopover={!isTabletOs}
                    />
                    {isTabletOs ? (
                        accountSettings
                    ) : (
                        <Popover
                            classNameBubble='account-settings-toggle__tooltip'
                            alignment='bottom'
                            message={<Localize i18n_default_text='Manage account settings' />}
                            should_disable_pointer_events
                            zIndex={'9999'}
                        >
                            {accountSettings}
                        </Popover>
                    )}
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                {!is_traders_hub_routes && (
                    <React.Suspense fallback={<div />}>
                        <AccountInfo
                            acc_switcher_disabled_message={acc_switcher_disabled_message}
                            account_type={account_type}
                            balance={typeof balance === 'undefined' ? balance : formatMoney(currency, balance, true)}
                            is_disabled={is_acc_switcher_disabled}
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_eu={is_eu}
                            is_virtual={is_virtual}
                            is_mobile
                            currency={currency}
                            is_dialog_on={is_acc_switcher_on}
                            toggleDialog={toggleAccountsDialog}
                        />
                    </React.Suspense>
                )}
                <ToggleNotifications
                    count={notifications_count}
                    is_visible={is_notifications_visible}
                    toggleDialog={toggleNotifications}
                    tooltip_message={<Localize i18n_default_text='View notifications' />}
                    should_disable_pointer_events
                    showPopover={!isTabletOs}
                />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <LoginButton className='acc-info__button' />
            <SignupButton className='acc-info__button' />
        </React.Fragment>
    );
};

AccountActionsComponent.displayName = 'AccountActions';

AccountActionsComponent.propTypes = {
    account_type: PropTypes.string,
    balance: PropTypes.any,
    currency: PropTypes.any,
    is_acc_switcher_disabled: PropTypes.any,
    is_eu: PropTypes.bool,
    disableApp: PropTypes.any,
    enableApp: PropTypes.any,
    is_acc_switcher_on: PropTypes.any,
    is_logged_in: PropTypes.any,
    is_notifications_visible: PropTypes.any,
    is_virtual: PropTypes.any,
    notifications_count: PropTypes.any,
    onClickDeposit: PropTypes.func,
    openRealAccountSignup: PropTypes.func,
    toggleAccountsDialog: PropTypes.any,
    toggleNotifications: PropTypes.any,
};

const AccountActions = React.memo(AccountActionsComponent);

export { AccountActions };
