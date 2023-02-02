import * as React from 'react';
import PropTypes from 'prop-types';
import { useHistory, withRouter } from 'react-router-dom';
import { DesktopWrapper, Icon, MobileWrapper, Popover, Text, Button } from '@deriv/components';
import { routes, PlatformContext } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { ToggleNotifications, MenuLinks } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { connect } from 'Stores/connect';
import { BinaryLink } from 'App/Components/Routes';
import DerivBrandLogo from 'Assets/SvgComponents/header/deriv-brand-logo.svg';
import DerivBrandLogoDark from 'Assets/SvgComponents/header/deriv-brand-logo-dark.svg';
import RealAccountSignup from 'App/Containers/RealAccountSignup';

const Divider = () => {
    return <div className='trading-hub-header__divider' />;
};

const TradingHubMenuHomepage = () => {
    const history = useHistory();

    return (
        <div className='trading-hub-header__tradinghub' onClick={() => history.push(routes.trading_hub)}>
            <Icon icon='IcAppstoreMenuHomepage' size={30} />
        </div>
    );
};

const RedirectToOldInterface = () => {
    const platform_store = React.useContext(PlatformContext);
    const disablePreAppstore = () => {
        platform_store.setIsPreAppStore(false);
    };
    return (
        <div className='trading-hub-header__redirect'>
            <BinaryLink to={routes.trade} className='trading-hub-header__redirect--link' onClick={disablePreAppstore}>
                <Text as='p' size='xs' color='general'>
                    <Localize i18n_default_text="Exit Trader's hub" />
                </Text>
                <Icon className='trading-hub-header__redirect--beta' icon='IcAppstoreTradingHubBeta' size={50} />
                <Icon icon='IcArrowRight' size={18} color='red' />
            </BinaryLink>
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
const MemoizedMenuLinks = React.memo(MenuLinks);
const TradingHubHeader = ({
    loginid,
    is_eu,
    is_eu_country,
    setIsOnboardingVisited,
    header_extension,
    is_dark_mode,
    is_logged_in,
    is_mt5_allowed,
    is_notifications_visible,
    notifications_count,
    toggleNotifications,
    replaceCashierMenuOnclick,
    menu_items,
    toggleIsTourOpen,
}) => {
    const is_mf = loginid?.startsWith('MF');
    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            return true;
        });
    const history = useHistory();
    const { is_pre_appstore } = React.useContext(PlatformContext);

    return (
        <header className='trading-hub-header'>
            <div className='trading-hub-header__menu-left'>
                <MobileWrapper>
                    <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />
                    {header_extension && is_logged_in && <div>{header_extension}</div>}
                </MobileWrapper>
                <DesktopWrapper>
                    <TradingHubMenuHomepage />
                </DesktopWrapper>
                {is_dark_mode ? (
                    <DerivBrandLogoDark className='trading-hub-header__logo' />
                ) : (
                    <DerivBrandLogo className='trading-hub-header__logo' />
                )}
                <Divider />
                {menu_items && is_logged_in && replaceCashierMenuOnclick()}
                <MemoizedMenuLinks is_logged_in={is_logged_in} items={menu_items} is_pre_appstore={is_pre_appstore} />
            </div>
            <DesktopWrapper>
                <div className='trading-hub-header__menu-right'>
                    <RedirectToOldInterface />
                    <Divider />
                    <TradingHubOnboarding is_dark_mode={is_dark_mode} setIsOnboardingVisited={setIsOnboardingVisited} />
                    <ShowNotifications
                        is_notifications_visible={is_notifications_visible}
                        notifications_count={notifications_count}
                        toggleNotifications={toggleNotifications}
                    />
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
                </div>
                <RealAccountSignup />
            </DesktopWrapper>
            <MobileWrapper>
                <div className='trading-hub-header__mobile-parent'>
                    <div className='trading-hub-header__menu-middle'>
                        <TradingHubOnboarding
                            is_dark_mode={is_dark_mode}
                            toggleIsTourOpen={toggleIsTourOpen}
                            is_mf={is_mf}
                            is_eu={is_eu}
                            is_eu_country={is_eu_country}
                        />
                        <ShowNotifications
                            is_notifications_visible={is_notifications_visible}
                            notifications_count={notifications_count}
                            toggleNotifications={toggleNotifications}
                        />

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
                    </div>
                    <div className='trading-hub-header__cashier-button'>
                        <Button primary small onClick={() => history.push(routes.cashier_deposit)}>
                            <Localize i18n_default_text='Cashier' />
                        </Button>
                    </div>
                </div>
                <RealAccountSignup />
            </MobileWrapper>
        </header>
    );
};

TradingHubHeader.propTypes = {
    header_extension: PropTypes.any,
    is_dark_mode: PropTypes.bool,
    loginid: PropTypes.string,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    notifications_count: PropTypes.number,
    toggleNotifications: PropTypes.func,
    setIsOnboardingVisited: PropTypes.func,
    settings_extension: PropTypes.array,
    is_settings_modal_on: PropTypes.bool,
    menu_items: PropTypes.array,
    replaceCashierMenuOnclick: PropTypes.func,
    toggleIsTourOpen: PropTypes.func,
    is_eu: PropTypes.bool,
    is_eu_country: PropTypes.bool,
};

export default connect(({ client, modules, notifications, ui, menu, tradinghub }) => ({
    is_eu: client.is_eu,
    is_eu_country: client.is_eu_country,
    header_extension: ui.header_extension,
    is_dark_mode: ui.is_dark_mode_on,
    is_logged_in: client.is_logged_in,
    is_mt5_allowed: client.is_mt5_allowed,
    is_notifications_visible: notifications.is_notifications_visible,
    notifications_count: notifications.notifications.length,
    toggleNotifications: notifications.toggleNotificationsModal,
    menu_items: menu.extensions,
    replaceCashierMenuOnclick: modules.cashier.general_store.replaceCashierMenuOnclick,
    toggleIsTourOpen: tradinghub.toggleIsTourOpen,
    setIsOnboardingVisited: tradinghub.setIsOnboardingVisited,
    loginid: client.loginid,
}))(withRouter(TradingHubHeader));
