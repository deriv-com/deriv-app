import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { useActiveAccount, useWalletMigration } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { routes, getDecimalPlaces, platforms } from '@deriv/shared';
import { AccountActionsWallets, MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import AccountsInfoLoaderWallets from 'App/Components/Layout/Header/wallets/accounts-info-loader-wallets';
import { TradersHubHomeButton } from './trading-hub-header';

const Divider = () => <div className='header__menu--dtrader--separator' />;

const DTraderHeaderWallets = observer(() => {
    const { client, common, ui, notifications, traders_hub } = useStore();
    const { is_bot_allowed, is_logged_in, is_logging_in, is_mt5_allowed, is_dxtrade_allowed, is_switching } = client;
    const { app_routing_history, platform, current_language } = common;
    const { header_extension, is_app_disabled, is_route_modal_on, is_mobile } = ui;
    const { addNotificationMessage, client_notifications, removeNotificationMessage } = notifications;
    const { setTogglePlatformType } = traders_hub;

    const addUpdateNotification = () => addNotificationMessage(client_notifications.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

    const { is_in_progress } = useWalletMigration();
    const active_account = useActiveAccount();
    const currency = active_account?.currency ?? '';

    React.useEffect(() => {
        document.addEventListener('IgnorePWAUpdate', removeUpdateNotification);
        return () => document.removeEventListener('IgnorePWAUpdate', removeUpdateNotification);
    }, [removeUpdateNotification]);

    const filterPlatformsForClients = (payload: typeof platform_config) =>
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
                            current_language={current_language}
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
                        'header__menu-right--hidden': is_mobile && is_logging_in,
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
                            className={classNames(
                                'acc-info__preloader__dtrader acc-info__preloader__dtrader--wallets',
                                {
                                    'acc-info__preloader__dtrader--no-currency': !currency,
                                    'acc-info__preloader__dtrader--is-crypto': getDecimalPlaces(currency) > 2,
                                }
                            )}
                        >
                            <AccountsInfoLoaderWallets is_logged_in={is_logged_in} is_mobile={is_mobile} speed={3} />
                        </div>
                    )}
                    <div id={'dt_core_header_acc-info-container'} className='acc-info__container'>
                        <AccountActionsWallets is_deposit_button_disabled={is_in_progress} />
                    </div>
                </div>
            </div>
            <RealAccountSignup />
            <SetAccountCurrencyModal />
            <NewVersionNotification onUpdate={addUpdateNotification} />
        </header>
    );
});

export default withRouter(DTraderHeaderWallets);
