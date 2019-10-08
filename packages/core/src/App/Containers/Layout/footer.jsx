import classNames                     from 'classnames';
// import { PropTypes as MobxPropTypes } from 'mobx-react';
import { withRouter }                 from 'react-router';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from 'Stores/connect';
import ServerTime                     from '../server-time.jsx';
import {
    NetworkStatus,
    ToggleFullScreen,
    // TogglePositions,
    ToggleSettings }                  from '../../Components/Layout/Footer';

const Footer = ({
    // active_positions,
    enableApp,
    is_app_disabled,
    // is_logged_in,
    // is_positions_drawer_on,
    is_route_modal_on,
    is_settings_modal_on,
    disableApp,
    // show_positions_toggle,
    // togglePositionsDrawer,
    toggleSettingsModal,
}) => (
    <footer className={classNames('footer', {
        'footer--is-disabled': (is_app_disabled || is_route_modal_on),
    })}
    >
        <div className='footer__links footer__links--left'>
            {/* { */}
            {/*    (is_logged_in && show_positions_toggle) && */}
            {/*    <TogglePositions */}
            {/*        is_positions_drawer_on={is_positions_drawer_on} */}
            {/*        togglePositionsDrawer={togglePositionsDrawer} */}
            {/*        positions_count={0} */}
            {/*        // positions_count={active_positions.length || 0} */}
            {/*    /> */}
            {/* } */}
        </div>
        <NetworkStatus />
        <ServerTime />
        <div className='footer__links'>
            <ToggleSettings
                is_settings_visible={is_settings_modal_on}
                toggleSettings={toggleSettingsModal}
                disableApp={disableApp}
                enableApp={enableApp}
            />
            <ToggleFullScreen />
        </div>
    </footer>
);

Footer.propTypes = {
    // active_positions      : MobxPropTypes.arrayOrObservableArray,
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
    ({ client/* , modules */, ui }) => ({
        // active_positions      : modules.portfolio.active_positions,
        enableApp             : ui.enableApp,
        is_app_disabled       : ui.is_app_disabled,
        is_route_modal_on     : ui.is_route_modal_on,
        is_logged_in          : client.is_logged_in,
        is_loading            : ui.is_loading,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        is_settings_modal_on  : ui.is_settings_modal_on,
        disableApp            : ui.disableApp,
        show_positions_toggle : ui.show_positions_toggle,
        togglePositionsDrawer : ui.togglePositionsDrawer,
        toggleSettingsModal   : ui.toggleSettingsModal,
    })
)(Footer));
