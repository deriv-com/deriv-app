import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import { withRouter }                 from 'react-router';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import routes                         from 'Constants/routes';
import { connect }                    from 'Stores/connect';
import ServerTime                     from '../server-time.jsx';
import {
    NetworkStatus,
    ToggleFullScreen,
    TogglePositions,
    ToggleSettings }                  from '../../Components/Layout/Footer';

const Footer = ({
    active_positions,
    hideFullBlur,
    is_fully_blurred,
    is_dark_mode,
    is_language_dialog_visible,
    is_loading,
    is_logged_in,
    is_positions_drawer_on,
    is_route_blurred,
    is_settings_dialog_on,
    location,
    showFullBlur,
    show_positions_toggle,
    togglePositionsDrawer,
    toggleSettingsDialog,
}) => (
    <React.Fragment>
        { (!is_loading || location.pathname !== routes.trade) &&
            <footer className={classNames('footer', {
                'footer--is-blurred': (is_fully_blurred || is_route_blurred),
            })}
            >
                <div className='footer__links footer__links--left'>
                    {
                        (is_logged_in && show_positions_toggle) &&
                        <TogglePositions
                            is_positions_drawer_on={is_positions_drawer_on}
                            togglePositionsDrawer={togglePositionsDrawer}
                            positions_count={active_positions.length || 0}
                        />
                    }
                </div>
                {/*<NetworkStatus />*/}
                <ServerTime />
                <div className='footer__links'>
                    <ToggleSettings
                        is_dark_mode={is_dark_mode}
                        is_language_visible={is_language_dialog_visible}
                        is_settings_visible={is_settings_dialog_on}
                        toggleSettings={toggleSettingsDialog}
                        showFullBlur={showFullBlur}
                        hideFullBlur={hideFullBlur}
                    />
                    <ToggleFullScreen />
                </div>
            </footer>
        }
    </React.Fragment>
);

Footer.propTypes = {
    active_positions          : MobxPropTypes.arrayOrObservableArray,
    is_dark_mode              : PropTypes.bool,
    is_fully_blurred          : PropTypes.bool,
    is_language_dialog_visible: PropTypes.bool,
    is_logged_in              : PropTypes.bool,
    is_positions_drawer_on    : PropTypes.bool,
    is_route_blurred          : PropTypes.bool,
    is_settings_dialog_on     : PropTypes.bool,
    location                  : PropTypes.object,
    show_positions_toggle     : PropTypes.bool,
    togglePositionsDrawer     : PropTypes.func,
    toggleSettingsDialog      : PropTypes.func,
};

export default withRouter(connect(
    ({ client, modules, ui }) => ({
        active_positions          : modules.portfolio.active_positions,
        hideFullBlur              : ui.hideFullBlur,
        is_fully_blurred          : ui.is_fully_blurred,
        is_dark_mode              : ui.is_dark_mode_on,
        is_route_blurred          : ui.is_route_blurred,
        is_logged_in              : client.is_logged_in,
        is_language_dialog_visible: ui.is_language_dialog_on,
        is_loading                : ui.is_loading,
        is_positions_drawer_on    : ui.is_positions_drawer_on,
        is_settings_dialog_on     : ui.is_settings_dialog_on,
        showFullBlur              : ui.showFullBlur,
        show_positions_toggle     : ui.show_positions_toggle,
        togglePositionsDrawer     : ui.togglePositionsDrawer,
        toggleSettingsDialog      : ui.toggleSettingsDialog,
    })
)(Footer));
