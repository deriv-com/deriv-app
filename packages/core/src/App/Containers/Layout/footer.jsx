import classNames from 'classnames';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import {
    AccountLimits,
    EndpointNote,
    GoToDeriv,
    HelpCentre,
    NetworkStatus,
    RegulatoryInformation,
    ResponsibleTrading,
    ToggleFullScreen,
    ToggleSettings,
} from 'App/Components/Layout/Footer';
import LiveChat from 'App/Components/Elements/live-chat.jsx';
import { connect } from 'Stores/connect';
import ServerTime from '../server-time.jsx';

const FooterIconSeparator = () => <div className='footer-icon-separator' />;

const FooterExtensionRenderer = (footer_extension, idx) => {
    const { Component: FooterExtensionComponent } = footer_extension;
    return (
        <React.Fragment key={`footer-link-${footer_extension.position}`}>
            {footer_extension.has_left_separator && <FooterIconSeparator />}
            <FooterExtensionComponent />
            {footer_extension.has_right_separator && <FooterIconSeparator />}
        </React.Fragment>
    );
};

const Footer = ({
    enableApp,
    footer_extensions,
    is_app_disabled,
    is_eu,
    is_eu_enabled, // TODO [deriv-eu] remove is_eu_enabled check once EU is ready for production
    is_route_modal_on,
    is_settings_modal_on,
    disableApp,
    toggleSettingsModal,
    settings_extension,
    standpoint,
}) => {
    const footer_extensions_left = footer_extensions.filter(footer_extension => footer_extension.position === 'left');
    const footer_extensions_right = footer_extensions.filter(footer_extension => footer_extension.position === 'right');

    return (
        <footer
            className={classNames('footer', {
                'footer--is-disabled': is_app_disabled || is_route_modal_on,
            })}
        >
            {footer_extensions_left.length > 0 && (
                <div className='footer__links footer__links--left'>
                    {footer_extensions_left.map(FooterExtensionRenderer)}
                </div>
            )}
            <EndpointNote />
            <NetworkStatus />
            <ServerTime />
            <div className='footer__links'>
                {footer_extensions_right.map(FooterExtensionRenderer)}
                <LiveChat />
                <FooterIconSeparator />
                <GoToDeriv />
                <ResponsibleTrading />
                <AccountLimits />
                {is_eu_enabled && (
                    <RegulatoryInformation
                        standpoint={
                            standpoint // TODO [deriv-eu] remove is_eu_enabled check once EU is ready for production
                        }
                        is_eu={is_eu}
                    />
                )}
                <FooterIconSeparator />
                <HelpCentre />
                <ToggleSettings
                    is_settings_visible={is_settings_modal_on}
                    toggleSettings={toggleSettingsModal}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    settings_extension={settings_extension}
                />
                <ToggleFullScreen />
            </div>
        </footer>
    );
};

Footer.propTypes = {
    is_app_disabled: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    is_settings_modal_on: PropTypes.bool,
    location: PropTypes.object,
    toggleSettingsModal: PropTypes.func,
};

export default withRouter(
    connect(({ client, ui }) => ({
        enableApp: ui.enableApp,
        footer_extensions: ui.footer_extensions,
        settings_extension: ui.settings_extension,
        is_app_disabled: ui.is_app_disabled,
        is_route_modal_on: ui.is_route_modal_on,
        is_logged_in: client.is_logged_in,
        is_eu_enabled: ui.is_eu_enabled, // TODO [deriv-eu] remove is_eu_enabled check once EU is ready for production
        is_eu: client.is_eu,
        standpoint: client.standpoint,
        is_loading: ui.is_loading,
        is_settings_modal_on: ui.is_settings_modal_on,
        disableApp: ui.disableApp,
        toggleSettingsModal: ui.toggleSettingsModal,
    }))(Footer)
);
