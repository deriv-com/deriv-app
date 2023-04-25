import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { routes, isMobile, getDecimalPlaces, platforms } from '@deriv/shared';
import { AccountActions, MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import { TradersHubHomeButton } from './trading-hub-header';
import { observer, useStore } from '@deriv/stores';

const Divider = () => <div className='header__menu--dtrader--separator' />;

const DTraderHeader = observer(({ history }) => {
    const { client, common, ui, notifications, traders_hub } = useStore();
    const {
        has_any_real_account,
        is_switching,
        is_virtual,
        is_logged_in,
        is_logging_in,
        is_mt5_allowed,
        is_dxtrade_allowed,
        is_bot_allowed,
        is_eu,
        currency,
        country_standpoint,
        balance,
        account_type,
    } = client;
    const { app_routing_history, platform } = common;
    const {
        addNotificationMessage,
        client_notifications,
        is_notifications_visible,
        removeNotificationMessage,
        toggleNotificationsModal: toggleNotifications,
    } = notifications;
    const { setTogglePlatformType } = traders_hub;
    const notifications_count = notifications.notifications.length;
    const {
        account_switcher_disabled_message: acc_switcher_disabled_message,
        disableApp,
        enableApp,
        header_extension,
        is_account_switcher_disabled: is_acc_switcher_disabled,
        is_accounts_switcher_on: is_acc_switcher_on,
        is_app_disabled,
        is_route_modal_on,
        openRealAccountSignup,
        toggleAccountsDialog,
        toggleReadyToDepositModal,
    } = ui;
    const addUpdateNotification = () => addNotificationMessage(client_notifications.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

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
                    <DesktopWrapper>
                        <PlatformSwitcher
                            app_routing_history={app_routing_history}
                            platform_config={filterPlatformsForClients(platform_config)}
                            setTogglePlatformType={setTogglePlatformType}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />

                        {header_extension && is_logged_in && (
                            <div className='header__menu-left-extensions'>{header_extension}</div>
                        )}
                    </MobileWrapper>
                    <DesktopWrapper>
                        <TradersHubHomeButton />
                    </DesktopWrapper>
                    <MenuLinks />
                </div>

                <div
                    className={classNames('header__menu-right', {
                        'header__menu-right--hidden': isMobile() && is_logging_in,
                    })}
                >
                    <DesktopWrapper>
                        <div className='header__menu--dtrader--separator--account'>
                            <Divider />
                        </div>
                    </DesktopWrapper>
                    {(is_logging_in || is_switching) && (
                        <div
                            id='dt_core_header_acc-info-preloader'
                            className={classNames('acc-info__preloader__dtrader', {
                                'acc-info__preloader__dtrader--no-currency': !currency,
                                'acc-info__preloader__dtrader--is-crypto': getDecimalPlaces(currency) > 2,
                            })}
                        >
                            <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={isMobile()} speed={3} />
                        </div>
                    )}
                    <div id={'dt_core_header_acc-info-container'} className='acc-info__container'>
                        <AccountActions
                            acc_switcher_disabled_message={acc_switcher_disabled_message}
                            account_type={account_type}
                            balance={balance}
                            currency={currency}
                            country_standpoint={country_standpoint}
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_acc_switcher_on={is_acc_switcher_on}
                            is_acc_switcher_disabled={is_acc_switcher_disabled}
                            is_eu={is_eu}
                            is_notifications_visible={is_notifications_visible}
                            is_logged_in={is_logged_in}
                            is_virtual={is_virtual}
                            onClickDeposit={handleClickCashier}
                            notifications_count={notifications_count}
                            toggleAccountsDialog={toggleAccountsDialog}
                            toggleNotifications={toggleNotifications}
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

DTraderHeader.propTypes = {
    history: PropTypes.object,
};

export default withRouter(DTraderHeader);
