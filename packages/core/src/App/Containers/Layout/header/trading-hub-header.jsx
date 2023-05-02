import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { DesktopWrapper, Icon, MobileWrapper, Popover, Text, Button } from '@deriv/components';
import { routes, platforms, formatMoney } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { ToggleNotifications, MenuLinks } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { BinaryLink } from 'App/Components/Routes';
import DerivBrandLogo from 'Assets/SvgComponents/header/deriv-rebranding-logo.svg';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import CurrencySelectionModal from '../../CurrencySelectionModal';
import AccountInfo from 'App/Components/Layout/Header/account-info';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import { useIsRealAccountNeededForCashier } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';

const Divider = () => {
    return <div className='trading-hub-header__divider' />;
};

export const TradersHubHomeButton = ({ is_dark_mode }) => {
    const history = useHistory();
    const { pathname } = history.location;

    return (
        <div
            className={classNames('trading-hub-header__tradershub', {
                'trading-hub-header__tradershub--active': pathname === routes.traders_hub,
            })}
            onClick={() => history.push(routes.traders_hub)}
        >
            <div className='trading-hub-header__tradershub--home-logo'>
                <Icon
                    icon={is_dark_mode ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                    size={is_dark_mode ? 15 : 17}
                />
            </div>
            <Text className='trading-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
        </div>
    );
};

const TradingHubOnboarding = ({ is_dark_mode, setIsOnboardingVisited }) => {
    const history = useHistory();
    return (
        <div className='trading-hub-header__tradinghub--onboarding'>
            <div className='trading-hub-header__tradinghub--onboarding--logo'>
                <Popover
                    classNameBubble='account-settings-toggle__tooltip'
                    alignment='bottom'
                    message={<Localize i18n_default_text='View onboarding' />}
                    should_disable_pointer_events
                    zIndex={9999}
                >
                    <Icon
                        icon={is_dark_mode ? 'IcAppstoreTradingHubOnboardingDark' : 'IcAppstoreTradingHubOnboarding'}
                        size={20}
                        onClick={() => {
                            history.push(routes.onboarding);
                            setIsOnboardingVisited(false);
                        }}
                    />
                </Popover>
            </div>
        </div>
    );
};

const ShowNotifications = ({ is_notifications_visible, notifications_count, toggleNotifications }) => {
    return (
        <div className='trading-hub-header__notification'>
            <ToggleNotifications
                count={notifications_count}
                is_visible={is_notifications_visible}
                toggleDialog={toggleNotifications}
                tooltip_message={<Localize i18n_default_text='View notifications' />}
            />
        </div>
    );
};

const TradingHubHeader = observer(({ is_acc_switcher_disabled }) => {
    const { client, common, notifications, ui, traders_hub } = useStore();
    const { platform } = common;
    const {
        account_type,
        balance,
        currency,
        country_standpoint,
        has_any_real_account,
        is_eu_country,
        is_eu,
        is_logged_in,
        is_mt5_allowed,
        is_virtual,
        loginid,
    } = client;
    const { toggleNotificationsModal: toggleNotifications, is_notifications_visible } = notifications;
    const { modal_data, setIsOnboardingVisited, toggleIsTourOpen } = traders_hub;
    const {
        header_extension,
        is_app_disabled,
        is_dark_mode_on: is_dark_mode,
        is_route_modal_on,
        account_switcher_disabled_message: acc_switcher_disabled_message,
        is_accounts_switcher_on,
        toggleAccountsDialog,
        toggleReadyToDepositModal,
        toggleNeedRealAccountForCashierModal,
    } = ui;
    const is_acc_switcher_on = !!is_accounts_switcher_on;
    const notifications_count = notifications.notifications.length;
    const { pathname } = useLocation();
    const cashier_routes = pathname.startsWith(routes.cashier);
    const is_mf = loginid?.startsWith('MF');
    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            return true;
        });
    const history = useHistory();

    const real_account_needed_for_cashier = useIsRealAccountNeededForCashier();

    const toggleModal = () => {
        if (!has_any_real_account) {
            toggleReadyToDepositModal();
        } else if (window.location.pathname === routes.traders_hub) {
            toggleNeedRealAccountForCashierModal();
        }
    };

    const handleClickCashier = () => {
        if ((!has_any_real_account && is_virtual) || real_account_needed_for_cashier) {
            toggleModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

    const AccountInfoComponent = React.useCallback(
        () => (
            <AccountInfo
                acc_switcher_disabled_message={acc_switcher_disabled_message}
                account_type={account_type}
                balance={formatMoney(currency, balance, true)}
                is_disabled={is_acc_switcher_disabled}
                is_eu={is_eu}
                is_virtual={is_virtual}
                currency={currency}
                country_standpoint={country_standpoint}
                is_dialog_on={is_acc_switcher_on}
                toggleDialog={toggleAccountsDialog}
            />
        ),
        [is_acc_switcher_on]
    );

    const DefaultMobileLinks = () => (
        <React.Fragment>
            <div className='trading-hub-header__menu-right--items--onboarding'>
                <TradingHubOnboarding
                    is_dark_mode={is_dark_mode}
                    toggleIsTourOpen={toggleIsTourOpen}
                    is_mf={is_mf}
                    is_eu={is_eu}
                    is_eu_country={is_eu_country}
                    setIsOnboardingVisited={setIsOnboardingVisited}
                />
            </div>
            <div className='trading-hub-header__menu-right--items--notifications'>
                <ShowNotifications
                    is_notifications_visible={is_notifications_visible}
                    notifications_count={notifications_count}
                    toggleNotifications={toggleNotifications}
                />
            </div>
            <Popover
                classNameBubble='account-settings-toggle__tooltip'
                alignment='bottom'
                message={<Localize i18n_default_text='Manage account settings' />}
                should_disable_pointer_events
                zIndex={9999}
            >
                <BinaryLink className='trading-hub-header__setting' to={routes.personal_details}>
                    <Icon icon='IcUserOutline' size={20} />
                </BinaryLink>
            </Popover>
            <div className='trading-hub-header__cashier-button'>
                <Button primary small onClick={handleClickCashier}>
                    <Localize i18n_default_text='Cashier' />
                </Button>
            </div>
        </React.Fragment>
    );

    return (
        <header
            className={classNames('trading-hub-header', {
                'trading-hub-header--is-disabled': is_app_disabled || is_route_modal_on,
                'trading-hub-header--is-hidden': platforms[platform],
            })}
        >
            <div className='trading-hub-header__menu-left'>
                <MobileWrapper>
                    <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />

                    {header_extension && is_logged_in && <div>{header_extension}</div>}
                </MobileWrapper>
                <DerivBrandLogo className='trading-hub-header__logo' />
                <DesktopWrapper>
                    <Divider />
                    <TradersHubHomeButton is_dark_mode={is_dark_mode} />
                </DesktopWrapper>
                <MenuLinks is_traders_hub_routes />
            </div>
            <DesktopWrapper>
                <div className='trading-hub-header__menu-right'>
                    <Divider />
                    <div className='trading-hub-header__menu-right--items'>
                        <div className='trading-hub-header__menu-right--items--onboarding'>
                            <TradingHubOnboarding
                                is_dark_mode={is_dark_mode}
                                setIsOnboardingVisited={setIsOnboardingVisited}
                            />
                        </div>
                        <div className='trading-hub-header__menu-right--items--notifications'>
                            <ShowNotifications
                                is_notifications_visible={is_notifications_visible}
                                notifications_count={notifications_count}
                                toggleNotifications={toggleNotifications}
                            />
                        </div>
                        <Popover
                            classNameBubble='account-settings-toggle__tooltip'
                            alignment='bottom'
                            message={<Localize i18n_default_text='Manage account settings' />}
                            should_disable_pointer_events
                            zIndex={9999}
                        >
                            <BinaryLink className='trading-hub-header__setting' to={routes.personal_details}>
                                <Icon icon='IcUserOutline' size={20} />
                            </BinaryLink>
                        </Popover>
                        {cashier_routes && (
                            <div className='trading-hub-header__menu-right--items--account-toggle'>
                                <AccountInfoComponent />
                            </div>
                        )}
                    </div>
                </div>
                <RealAccountSignup />
            </DesktopWrapper>
            <MobileWrapper>
                <div className='trading-hub-header__mobile-parent'>
                    <div className='trading-hub-header__menu-middle'>
                        {cashier_routes ? (
                            <React.Fragment>
                                <div className='trading-hub-header__menu-right--items--notifications__cashier'>
                                    <ShowNotifications
                                        is_notifications_visible={is_notifications_visible}
                                        notifications_count={notifications_count}
                                        toggleNotifications={toggleNotifications}
                                    />
                                </div>
                                <div className='trading-hub-header__menu-right--items--account-toggle'>
                                    <AccountInfoComponent />
                                </div>
                            </React.Fragment>
                        ) : (
                            <DefaultMobileLinks />
                        )}
                    </div>
                </div>
                <RealAccountSignup />
            </MobileWrapper>
            <SetAccountCurrencyModal />
            <CurrencySelectionModal is_visible={modal_data.active_modal === 'currency_selection'} />
        </header>
    );
});

TradingHubHeader.propTypes = {
    is_acc_switcher_disabled: PropTypes.bool,
};

export default withRouter(TradingHubHeader);
