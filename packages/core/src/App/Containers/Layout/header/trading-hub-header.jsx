import * as React from 'react';
import classNames from 'classnames';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { DesktopWrapper, Icon, MobileWrapper, Popover, Text, Button, StaticUrl } from '@deriv/components';
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
import {
    useActiveWallet,
    useFeatureFlags,
    useIsRealAccountNeededForCashier,
    useWalletsList,
    useWalletMigration,
} from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';

const Divider = () => {
    return <div className='trading-hub-header__divider' />;
};

export const TradersHubHomeButton = observer(() => {
    const history = useHistory();
    const { pathname } = history.location;
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    return (
        <div
            className={classNames('trading-hub-header__tradershub', {
                'trading-hub-header__tradershub--active': pathname === routes.traders_hub,
            })}
            onClick={() => history.push(routes.traders_hub)}
        >
            <div className='trading-hub-header__tradershub--home-logo'>
                <Icon
                    icon={is_dark_mode_on ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                    size={is_dark_mode_on ? 15 : 17}
                />
            </div>
            <Text className='trading-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
        </div>
    );
});

const TradingHubOnboarding = observer(() => {
    const history = useHistory();
    const { client, traders_hub, ui } = useStore();
    const { is_dark_mode_on, is_wallet_modal_visible, setIsWalletModalVisible } = ui;
    const { setIsOnboardingVisited, toggleIsWalletTourOpen } = traders_hub;
    const { is_logged_in, is_switching, switchAccount, is_landing_company_loaded } = client;

    const { data } = useWalletsList();
    const { is_wallet_enabled } = useFeatureFlags();
    const wallet_account = useActiveWallet();

    const first_loginid = data?.[0]?.loginid;

    const handleSwitchAndToggle = async () => {
        // if the modal is open, then close it and open the tour
        if (is_wallet_modal_visible) await setIsWalletModalVisible(false);
        // switch to the first account when the tour is opened
        if (wallet_account?.loginid !== first_loginid) {
            await switchAccount(first_loginid);
        }
        // open the tour
        if (!is_switching && is_logged_in && is_landing_company_loaded) {
            toggleIsWalletTourOpen(true);
        }
    };

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
                        icon={is_dark_mode_on ? 'IcAppstoreTradingHubOnboardingDark' : 'IcAppstoreTradingHubOnboarding'}
                        size={20}
                        onClick={() => {
                            if (data?.length > 0 && is_wallet_enabled) {
                                handleSwitchAndToggle();
                            } else {
                                history.push(routes.onboarding);
                                setIsOnboardingVisited(false);
                            }
                        }}
                    />
                </Popover>
            </div>
        </div>
    );
});

const ShowNotifications = observer(() => {
    const { notifications } = useStore();
    const { is_notifications_visible, toggleNotificationsModal } = notifications;
    const notifications_count = notifications.notifications.length;
    return (
        <div className='trading-hub-header__notification'>
            <ToggleNotifications
                count={notifications_count}
                is_visible={is_notifications_visible}
                toggleDialog={toggleNotificationsModal}
                tooltip_message={<Localize i18n_default_text='View notifications' />}
            />
        </div>
    );
});

const DefaultMobileLinks = observer(() => {
    const history = useHistory();
    const { is_in_progress } = useWalletMigration();
    const { client, ui } = useStore();
    const { has_any_real_account, setWalletsMigrationInProgressPopup, is_virtual } = client;
    const { toggleReadyToDepositModal, toggleNeedRealAccountForCashierModal } = ui;
    const real_account_needed_for_cashier = useIsRealAccountNeededForCashier();

    const toggleModal = () => {
        if (!has_any_real_account) {
            toggleReadyToDepositModal();
        } else if (window.location.pathname === routes.traders_hub) {
            toggleNeedRealAccountForCashierModal();
        }
    };

    const handleClickCashier = () => {
        if (is_in_progress) {
            setWalletsMigrationInProgressPopup(true);
        } else if ((!has_any_real_account && is_virtual) || real_account_needed_for_cashier) {
            toggleModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

    return (
        <React.Fragment>
            <div className='trading-hub-header__menu-right--items--onboarding'>
                <TradingHubOnboarding />
            </div>
            <div className='trading-hub-header__menu-right--items--notifications'>
                <ShowNotifications />
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
                <Button primary small onClick={handleClickCashier} as_disabled={is_in_progress}>
                    <Localize i18n_default_text='Cashier' />
                </Button>
            </div>
        </React.Fragment>
    );
});

const TradingHubHeader = observer(() => {
    const { client, ui, common, traders_hub } = useStore();
    const {
        toggleAccountsDialog,
        is_accounts_switcher_on,
        account_switcher_disabled_message,
        is_route_modal_on,
        is_app_disabled,
        header_extension,
    } = ui;
    const { is_virtual, country_standpoint, currency, balance, account_type, is_mt5_allowed, is_logged_in, is_eu } =
        client;
    const { platform } = common;
    const { modal_data } = traders_hub;

    const { pathname } = useLocation();
    const cashier_routes = pathname.startsWith(routes.cashier);
    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            return true;
        });

    const AccountInfoComponent = React.useCallback(
        () => (
            <AccountInfo
                acc_switcher_disabled_message={account_switcher_disabled_message}
                account_type={account_type}
                balance={formatMoney(currency, balance, true)}
                is_eu={is_eu}
                is_virtual={is_virtual}
                currency={currency}
                country_standpoint={country_standpoint}
                is_dialog_on={!!is_accounts_switcher_on}
                toggleDialog={toggleAccountsDialog}
            />
        ),
        [
            is_accounts_switcher_on,
            is_eu,
            is_virtual,
            currency,
            country_standpoint,
            toggleAccountsDialog,
            account_type,
            balance,
            account_switcher_disabled_message,
        ]
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
                <div
                    className={classNames('trading-hub-header__logo-wrapper', {
                        'trading-hub-header__logo-wrapper--cashier': cashier_routes,
                    })}
                >
                    <StaticUrl href='/'>
                        <DerivBrandLogo className='trading-hub-header__logo' />
                    </StaticUrl>
                </div>
                <DesktopWrapper>
                    <Divider />
                    <TradersHubHomeButton />
                </DesktopWrapper>
                <MenuLinks is_traders_hub_routes />
            </div>
            <DesktopWrapper>
                <div className='trading-hub-header__menu-right'>
                    <Divider />
                    <div className='trading-hub-header__menu-right--items'>
                        <div className='trading-hub-header__menu-right--items--onboarding'>
                            <TradingHubOnboarding />
                        </div>
                        <div className='trading-hub-header__menu-right--items--notifications'>
                            <ShowNotifications />
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
                                    <ShowNotifications />
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

export default withRouter(TradingHubHeader);
