import * as PropTypes from 'prop-types';
import React from 'react';
import { Button, DesktopWrapper, Icon, MobileWrapper, Popover } from '@deriv/components';
import { routes, formatMoney, PlatformContext, moduleLoader } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
// import { useFeatureFlags, useWalletAccountsList } from '@deriv/hooks';
import { LoginButton } from './login-button.jsx';
import { SignupButton } from './signup-button.jsx';
import ToggleNotifications from './toggle-notifications.jsx';
import { BinaryLink } from '../../Routes';
// import { AccountsInfoLoader } from './Components/Preloader';
import 'Sass/app/_common/components/account-switcher.scss';

const AccountInfo = React.lazy(() =>
    moduleLoader(() =>
        import(
            /* webpackChunkName: "account-info", webpackPreload: true */ 'App/Components/Layout/Header/account-info.jsx'
        )
    )
);

const AccountInfoWallets = React.lazy(() =>
    moduleLoader(() => import('App/Components/Layout/Header/account-info-wallets.tsx'))
);

const AccountActions = React.memo(
    ({
        acc_switcher_disabled_message,
        account_type,
        balance,
        currency,
        country_standpoint,
        disableApp,
        enableApp,
        is_acc_switcher_on,
        is_acc_switcher_disabled,
        is_eu,
        is_logged_in,
        is_notifications_visible,
        is_virtual,
        notifications_count,
        onClickDeposit,
        openRealAccountSignup,
        toggleAccountsDialog,
        toggleNotifications,
        is_deposit_button_disabled,
        // is_mobile,
    }) => {
        const { is_appstore } = React.useContext(PlatformContext);

        // const { is_wallet_enabled } = useFeatureFlags();
        // const { has_wallet, isLoading } = useWalletAccountsList();

        // const should_show_wallets = is_wallet_enabled && has_wallet;

        // if (isLoading) {
        //     return <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={is_mobile} speed={3} />;
        // }

        // TODO: delete it, it's just for testing right now
        const should_show_wallets = true;

        if (is_logged_in) {
            return (
                <React.Fragment>
                    <MobileWrapper>
                        <ToggleNotifications
                            count={notifications_count}
                            is_visible={is_notifications_visible}
                            toggleDialog={toggleNotifications}
                        />
                        <React.Suspense fallback={<div />}>
                            {should_show_wallets ? (
                                <AccountInfoWallets
                                    is_dialog_on={is_acc_switcher_on}
                                    toggleDialog={toggleAccountsDialog}
                                />
                            ) : (
                                <AccountInfo
                                    acc_switcher_disabled_message={acc_switcher_disabled_message}
                                    account_type={account_type}
                                    balance={
                                        typeof balance === 'undefined' ? balance : formatMoney(currency, balance, true)
                                    }
                                    is_disabled={is_acc_switcher_disabled}
                                    disableApp={disableApp}
                                    enableApp={enableApp}
                                    is_eu={is_eu}
                                    is_virtual={is_virtual}
                                    currency={currency}
                                    country_standpoint={country_standpoint}
                                    is_dialog_on={is_acc_switcher_on}
                                    toggleDialog={toggleAccountsDialog}
                                />
                            )}
                        </React.Suspense>
                    </MobileWrapper>
                    <DesktopWrapper>
                        <ToggleNotifications
                            count={notifications_count}
                            is_visible={is_notifications_visible}
                            toggleDialog={toggleNotifications}
                            tooltip_message={<Localize i18n_default_text='View notifications' />}
                            should_disable_pointer_events
                        />
                        <Popover
                            classNameBubble='account-settings-toggle__tooltip'
                            alignment='bottom'
                            message={<Localize i18n_default_text='Manage account settings' />}
                            should_disable_pointer_events
                            zIndex={9999}
                        >
                            <BinaryLink className='account-settings-toggle' to={routes.personal_details}>
                                <Icon icon='IcUserOutline' />
                            </BinaryLink>
                        </Popover>
                        <React.Suspense fallback={<div />}>
                            {should_show_wallets ? (
                                <AccountInfoWallets
                                    is_dialog_on={is_acc_switcher_on}
                                    toggleDialog={toggleAccountsDialog}
                                />
                            ) : (
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
                                    country_standpoint={country_standpoint}
                                    is_dialog_on={is_acc_switcher_on}
                                    toggleDialog={toggleAccountsDialog}
                                />
                            )}
                        </React.Suspense>
                        {!is_virtual && !currency && (
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
                        {currency && (
                            <Button
                                className='acc-info__button'
                                has_effect
                                text={should_show_wallets ? localize('Manage funds') : localize('Deposit')}
                                onClick={should_show_wallets ? () => {} : onClickDeposit}
                                primary
                                as_disabled={is_deposit_button_disabled}
                            />
                        )}
                    </DesktopWrapper>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <LoginButton className='acc-info__button' />
                <SignupButton className='acc-info__button' is_appstore={is_appstore} />
            </React.Fragment>
        );
    }
);

AccountActions.displayName = 'AccountActions';

AccountActions.propTypes = {
    acc_switcher_disabled_message: PropTypes.string,
    account_type: PropTypes.string,
    balance: PropTypes.any,
    currency: PropTypes.any,
    is_acc_switcher_disabled: PropTypes.any,
    is_eu: PropTypes.bool,
    disableApp: PropTypes.any,
    enableApp: PropTypes.any,
    country_standpoint: PropTypes.object,
    is_acc_switcher_on: PropTypes.any,
    is_logged_in: PropTypes.any,
    is_notifications_visible: PropTypes.any,
    is_virtual: PropTypes.any,
    notifications_count: PropTypes.any,
    onClickDeposit: PropTypes.func,
    openRealAccountSignup: PropTypes.func,
    toggleAccountsDialog: PropTypes.any,
    toggleNotifications: PropTypes.any,
    is_deposit_button_disabled: PropTypes.bool,
    is_mobile: PropTypes.bool,
};

export { AccountActions };
