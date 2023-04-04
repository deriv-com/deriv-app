import * as React from 'react';
import { Button, DesktopWrapper, Icon, MobileWrapper, Money, Popover, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { ToggleNotifications } from 'App/Components/Layout/Header';
import { getPlatformInformation, isMobile, routes } from '@deriv/shared';
import { useHistory, withRouter } from 'react-router-dom';
import { BinaryLink } from 'App/Components/Routes';
import PropTypes from 'prop-types';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { connect } from 'Stores/connect';
import platform_config from 'App/Constants/platform-config';

const Divider = () => {
    return <div className='dashboard-platform-header__divider' />;
};

const MyApps = () => {
    const history = useHistory();

    return (
        <div className='dashboard-platform-header__my-apps' onClick={() => history.push(routes.dashboard)}>
            <Icon icon='IcWalletMyApps' size={16} />
            <Text size='s' line_height='xxl' weight='bold' className='dashboard-platform-header__my-apps--title'>
                {localize('My apps')}
            </Text>
            <Divider />
        </div>
    );
};

const PlatformInformation = ({ app_routing_history }) => {
    return (
        <div className='dashboard-platform-header__platform-information'>
            <Icon
                className='dashboard-platform-header__platform-information--icon'
                icon={getPlatformInformation(app_routing_history).icon}
                size={24}
            />
            <Text size='s' weight='bold' line_height='xxl'>
                {getPlatformInformation(app_routing_history).header}
            </Text>
        </div>
    );
};

const ShowReports = () => {
    return (
        <div className='dashboard-platform-header__report'>
            <BinaryLink id='db_reports_tab' key='db_reports_tab' to={routes.reports}>
                <Icon icon='IcReports' size={20} />
            </BinaryLink>
        </div>
    );
};

const ShowNotifications = ({ is_notifications_visible, notifications_count, toggleNotifications }) => {
    return (
        <div className='dashboard-platform-header__notification'>
            <ToggleNotifications
                count={notifications_count}
                is_visible={is_notifications_visible}
                toggleDialog={toggleNotifications}
                tooltip_message={<Localize i18n_default_text='View notifications' />}
            />
        </div>
    );
};

const ShowSettings = ({ toggleSettings }) => {
    return (
        <div className='dashboard-platform-header__setting'>
            <Popover alignment='top'>
                <a
                    id='dt_settings_toggle'
                    onClick={toggleSettings}
                    className='dashboard-platform-header__setting--icon'
                >
                    <Icon icon='IcGearLight' size={22} />
                </a>
            </Popover>
        </div>
    );
};

const AccountBalance = ({ balance, currency }) => {
    return (
        <div className='dashboard-platform-header__balance'>
            <Divider />
            <Icon icon='IcWalletDerivApps' size={28} className='dashboard-platform-header__balance--icon' />
            <Text size='s' line_height='xxl' weight='bold' color='profit-success'>
                <Money amount={balance} currency={currency} show_currency />
            </Text>
        </div>
    );
};

const DashboardPlatformHeader = ({
    app_routing_history,
    balance,
    currency,
    disableApp,
    enableApp,
    header_extension,
    is_logged_in,
    is_mt5_allowed,
    is_notifications_visible,
    is_settings_modal_on,
    notifications_count,
    settings_extension,
    toggleNotifications,
    toggleSettingsModal,
}) => {
    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            return true;
        });
    const history = useHistory();
    return (
        <header className='dashboard-platform-header'>
            <div className='dashboard-platform-header__menu-left'>
                <MobileWrapper>
                    <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />
                    {header_extension && is_logged_in && <div>{header_extension}</div>}
                </MobileWrapper>
                <DesktopWrapper>
                    <MyApps />
                    <PlatformInformation app_routing_history={app_routing_history} />
                </DesktopWrapper>
            </div>
            <div className='dashboard-platform-header__menu-right'>
                <DesktopWrapper>
                    <ShowReports />
                </DesktopWrapper>
                <ShowNotifications
                    is_notifications_visible={is_notifications_visible}
                    notifications_count={notifications_count}
                    toggleNotifications={toggleNotifications}
                />
                <DesktopWrapper>
                    <ShowSettings
                        disableApp={disableApp}
                        enableApp={enableApp}
                        is_settings_modal_on={is_settings_modal_on}
                        toggleSettingsModal={toggleSettingsModal}
                        settings_extension={settings_extension}
                    />
                </DesktopWrapper>
                <AccountBalance balance={balance} currency={currency} />
                <Button
                    small={isMobile()}
                    has_effect
                    text={localize('Top up')}
                    onClick={() => history.push(routes.dashboard)}
                    primary
                    className='dashboard-platform-header__button'
                />
            </div>
        </header>
    );
};

DashboardPlatformHeader.propTypes = {
    app_routing_history: PropTypes.array,
    balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currency: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    header_extension: PropTypes.any,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    notifications_count: PropTypes.number,
    toggleNotifications: PropTypes.func,
    toggleSettingsModal: PropTypes.func,
    settings_extension: PropTypes.array,
    is_settings_modal_on: PropTypes.bool,
};

export default connect(({ client, common, notifications, ui }) => ({
    app_routing_history: common.app_routing_history,
    balance: client.balance,
    currency: client.currency,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    header_extension: ui.header_extension,
    is_logged_in: client.is_logged_in,
    is_mt5_allowed: client.is_mt5_allowed,
    is_notifications_visible: notifications.is_notifications_visible,
    notifications_count: notifications.notifications.length,
    toggleNotifications: notifications.toggleNotificationsModal,
}))(withRouter(DashboardPlatformHeader));
