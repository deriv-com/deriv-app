import classNames from 'classnames';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes, getDecimalPlaces, platforms } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
// import { useWalletMigration } from '@deriv/hooks';
import { AccountActions, MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import TradersHubHomeButton from './traders-hub-home-button';

const DTraderHeader = observer(() => {
    const { client, common, ui, notifications, traders_hub } = useStore();
    const {
        account_type,
        balance,
        currency,
        country_standpoint,
        has_any_real_account,
        is_bot_allowed,
        is_dxtrade_allowed,
        is_eu,
        is_logged_in,
        is_logging_in,
        is_mt5_allowed,
        is_virtual,
        is_switching,
    } = client;
    const { app_routing_history, platform, current_language } = common;
    const {
        account_switcher_disabled_message,
        disableApp,
        enableApp,
        header_extension,
        is_account_switcher_disabled,
        is_accounts_switcher_on,
        is_app_disabled,
        is_desktop,
        is_mobile,
        is_route_modal_on,
        openRealAccountSignup,
        toggleAccountsDialog,
        toggleReadyToDepositModal,
    } = ui;
    const {
        addNotificationMessage,
        client_notifications,
        is_notifications_visible,
        notifications: notifications_array,
        removeNotificationMessage,
        toggleNotificationsModal,
    } = notifications;
    const { setTogglePlatformType } = traders_hub;

    const history = useHistory();

    const addUpdateNotification = () => addNotificationMessage(client_notifications?.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

    //TODO: Uncomment once useWalletMigration hook is optimized for production release.
    // const { is_migrated, is_failed } = useWalletMigration();
    // if (is_migrated) addNotificationMessage(client_notifications.wallets_migrated);
    // if (is_failed) addNotificationMessage(client_notifications.wallets_failed);

    React.useEffect(() => {
        document.addEventListener('IgnorePWAUpdate', removeUpdateNotification);
        return () => document.removeEventListener('IgnorePWAUpdate', removeUpdateNotification);
    }, [removeUpdateNotification]);

    const handleClickCashier = () => {
        if (!has_any_real_account && is_virtual) {
            toggleReadyToDepositModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            if (config.link_to === routes.dxtrade) {
                return is_dxtrade_allowed;
            }
            if (
                config.link_to === routes.bot ||
                config.href === routes.binarybot ||
                config.href === routes.smarttrader
            ) {
                return is_bot_allowed;
            }
            return true;
        });

    return (
        <header
            className={classNames('header', {
                'header--is-disabled': is_app_disabled || is_route_modal_on,
                'header--is-hidden': platforms[platform],
            })}
        >
            <div className='header__menu-items'>
                <div className='header__menu-left'>
                    {is_desktop && (
                        <PlatformSwitcher
                            app_routing_history={app_routing_history}
                            platform_config={filterPlatformsForClients(platform_config)}
                            setTogglePlatformType={setTogglePlatformType}
                            current_language={current_language}
                        />
                    )}
                    {is_mobile && (
                        <React.Fragment>
                            <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />
                            {header_extension && is_logged_in && (
                                <div className='header__menu-left-extensions'>{header_extension}</div>
                            )}
                        </React.Fragment>
                    )}
                    {is_desktop && <TradersHubHomeButton />}
                    <MenuLinks />
                </div>

                <div
                    className={classNames('header__menu-right', {
                        'header__menu-right--hidden': is_mobile && is_logging_in,
                    })}
                >
                    {is_desktop && (
                        <div className='header__menu--dtrader--separator--account'>
                            <div className='header__menu--dtrader--separator' />
                        </div>
                    )}
                    {(is_logging_in || is_switching) && (
                        <div
                            id='dt_core_header_acc-info-preloader'
                            className={classNames('acc-info__preloader__dtrader', {
                                'acc-info__preloader__dtrader--no-currency': !currency,
                                'acc-info__preloader__dtrader--is-crypto': getDecimalPlaces(currency) > 2,
                            })}
                        >
                            <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={is_mobile} speed={3} />
                        </div>
                    )}
                    <div id={'dt_core_header_acc-info-container'} className='acc-info__container'>
                        <AccountActions
                            acc_switcher_disabled_message={account_switcher_disabled_message}
                            account_type={account_type}
                            balance={balance}
                            currency={currency}
                            country_standpoint={country_standpoint}
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_acc_switcher_on={is_accounts_switcher_on}
                            is_acc_switcher_disabled={is_account_switcher_disabled}
                            is_eu={is_eu}
                            is_notifications_visible={is_notifications_visible}
                            is_logged_in={is_logged_in}
                            is_virtual={is_virtual}
                            onClickDeposit={handleClickCashier}
                            notifications_count={notifications_array.length}
                            toggleAccountsDialog={toggleAccountsDialog}
                            toggleNotifications={toggleNotificationsModal}
                            openRealAccountSignup={openRealAccountSignup}
                        />
                    </div>
                </div>
            </div>
            <RealAccountSignup />
            <SetAccountCurrencyModal />
            <NewVersionNotification onUpdate={addUpdateNotification} />
        </header>
    );
});

export default DTraderHeader;
