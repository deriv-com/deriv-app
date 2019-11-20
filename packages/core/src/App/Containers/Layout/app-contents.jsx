import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import { withRouter }       from 'react-router';
import { ThemedScrollbars } from 'deriv-components';
import { connect }          from 'Stores/connect';
// import InstallPWA    from './install-pwa.jsx';

const AppContents = ({
    // addNotificationBar,
    children,
    is_app_disabled,
    is_positions_drawer_on,
    is_route_modal_on,
    pageView,
    // setPWAPromptEvent,
}) => {
    // Segment page view trigger
    pageView();

    // if (is_logged_in) {
    // TODO: uncomment these after the issues with showing the prompt too often and in the app are fixed
    // window.addEventListener('beforeinstallprompt', e => {
    //     console.log('Going to show the installation prompt'); // eslint-disable-line no-console
    //
    //     e.preventDefault();
    //
    //     setPWAPromptEvent(e);
    //     addNotificationBar({
    //         content : <InstallPWA />,
    //         autoShow: 10000, // show after 10 secs
    //         msg_type: 'pwa',
    //     });
    // });
    // }

    return (
        <div
            id='app_contents'
            className={classNames('app-contents', {
                'app-contents--show-positions-drawer': is_positions_drawer_on,
                'app-contents--is-disabled'          : is_app_disabled,
                'app-contents--is-route-modal'       : is_route_modal_on,
            })}
        >
            {/* Calculate height of user screen and offset height of header and footer */}
            <ThemedScrollbars
                autoHide
                style={{ height: 'calc(100vh - 83px)' }}
            >
                {children}
            </ThemedScrollbars>
        </div>
    );
};

AppContents.propTypes = {
    addNotificationBar    : PropTypes.func,
    children              : PropTypes.any,
    is_app_disabled       : PropTypes.bool,
    is_logged_in          : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_route_modal_on     : PropTypes.bool,
    pwa_prompt_event      : PropTypes.object,
    setPWAPromptEvent     : PropTypes.func,
};

export default withRouter(connect(
    ({ ui, segment }) => ({
        // is_logged_in          : client.is_logged_in,
        // addNotificationBar    : ui.addNotificationBar,
        is_app_disabled       : ui.is_app_disabled,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        is_route_modal_on     : ui.is_route_modal_on,
        pageView              : segment.pageView,
        pwa_prompt_event      : ui.pwa_prompt_event,
        // setPWAPromptEvent     : ui.setPWAPromptEvent,
    })
)(AppContents));
