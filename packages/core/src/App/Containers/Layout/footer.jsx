import classNames     from 'classnames';
import { withRouter } from 'react-router';
import PropTypes      from 'prop-types';
import React          from 'react';
import {
    NetworkStatus,
    ToggleFullScreen,
    ToggleSettings }  from 'App/Components/Layout/Footer';
import { connect }    from 'Stores/connect';
import ServerTime     from '../server-time.jsx';

const Footer = ({
    enableApp,
    footer_extension,
    is_app_disabled,
    is_route_modal_on,
    is_settings_modal_on,
    disableApp,
    toggleSettingsModal,
    settings_extension,
}) => (
    <footer className={classNames('footer', {
        'footer--is-disabled': (is_app_disabled || is_route_modal_on),
    })}
    >
        { footer_extension &&
            <div className='footer__links footer__links--left'>
                { footer_extension }
            </div>
        }
        <NetworkStatus />
        <ServerTime />
        <div className='footer__links'>
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

Footer.propTypes = {
    is_app_disabled       : PropTypes.bool,
    is_logged_in          : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_route_modal_on     : PropTypes.bool,
    is_settings_modal_on  : PropTypes.bool,
    location              : PropTypes.object,
    togglePositionsDrawer : PropTypes.func,
    toggleSettingsModal   : PropTypes.func,
};

export default withRouter(connect(
    ({ client, ui }) => ({
        enableApp             : ui.enableApp,
        footer_extension      : ui.footer_extension,
        settings_extension    : ui.settings_extension,
        is_app_disabled       : ui.is_app_disabled,
        is_route_modal_on     : ui.is_route_modal_on,
        is_logged_in          : client.is_logged_in,
        is_loading            : ui.is_loading,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        is_settings_modal_on  : ui.is_settings_modal_on,
        disableApp            : ui.disableApp,
        show_positions_toggle : ui.show_positions_toggle,
        togglePositionsDrawer : ui.togglePositionsDrawer, // TODO: Remove positions drawer logic from UI store
        toggleSettingsModal   : ui.toggleSettingsModal,
    })
)(Footer));
