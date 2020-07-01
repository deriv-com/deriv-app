import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { DesktopWrapper, MobileWrapper, ThemedScrollbars, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared/utils/screen';
import { connect } from 'Stores/connect';
// import InstallPWA    from './install-pwa.jsx';

const relaunch_in_mobile = 'Relaunch in Mobile mode';
const relaunch_in_desktop = 'Relaunch in Desktop mode';

const Snackbar = ({ is_active, message, closeSnackBar }) => {
    return (
        <div
            className={classNames('snackbar', {
                'snackbar--fade-in': is_active,
                'snackbar--fade-out': !is_active,
            })}
        >
            <div className='description'>
                <strong>View this site in {message} mode to get the best User Experience</strong>
                <br />
                <Button className='snackbar__btn-dont-accept' secondary onClick={closeSnackBar}>
                    {localize('Dismiss')}
                </Button>
                <Button
                    className='snackbar__btn-dont-accept'
                    secondary
                    onClick={() => {
                        window.location.reload(false);
                        closeSnackBar();
                    }}
                >
                    {localize(message === 'Mobile' ? relaunch_in_mobile : relaunch_in_desktop)}
                </Button>
            </div>
        </div>
    );
};

const useSnackbar = () => {
    const [is_active, setIsActive] = React.useState(false);
    const [message, setMessage] = React.useState();

    const openSnackBar = (msg = 'Something went wrong...') => {
        setMessage(msg);
        setIsActive(true);
    };

    const closeSnackBar = () => {
        setIsActive(false);
    };

    return { is_active, message, openSnackBar, closeSnackBar };
};

const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

const useCurrentWitdh = () => {
    const [width, setWidth] = React.useState(getWidth());

    React.useEffect(() => {
        let timeoutId = null;
        const resizeListener = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setWidth(getWidth()), 150);
        };
        window.addEventListener('resize', resizeListener);

        return () => {
            window.removeEventListener('resize', resizeListener);
        };
    }, []);

    return width;
};

const AppContents = ({
    // addNotificationBar,
    children,
    identifyEvent,
    is_app_disabled,
    is_cashier_visible,
    is_mt5_page,
    is_positions_drawer_on,
    is_route_modal_on,
    pageView,
    // setPWAPromptEvent,
}) => {
    const { is_active, message, openSnackBar, closeSnackBar } = useSnackbar();
    const width = useCurrentWitdh();
    const [view_mode, setViewMode] = React.useState(width <= 767 ? 'Mobile' : 'Desktop');
    const [is_rendered, setIsRendered] = React.useState(false);

    React.useEffect(() => {
        if (is_rendered) {
            if (width <= 767) {
                setViewMode('Mobile');
            } else {
                setViewMode('Desktop');
            }
        }
    }, [width]);

    React.useEffect(() => {
        if (is_rendered) {
            if (view_mode) {
                openSnackBar(view_mode);
            }
        } else {
            setIsRendered(true);
        }
    }, [view_mode]);

    // Segment page view trigger
    identifyEvent();
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
                'app-contents--is-disabled': is_app_disabled,
                'app-contents--is-mobile': isMobile(),
                'app-contents--is-route-modal': is_route_modal_on,
                'app-contents--is-scrollable': is_mt5_page || is_cashier_visible,
            })}
        >
            <MobileWrapper>{children}</MobileWrapper>
            <DesktopWrapper>
                {/* Calculate height of user screen and offset height of header and footer */}
                <ThemedScrollbars height='calc(100vh - 84px)'>{children}</ThemedScrollbars>
            </DesktopWrapper>
            <Snackbar is_active={is_active} message={message} closeSnackBar={closeSnackBar} />
        </div>
    );
};

AppContents.propTypes = {
    addNotificationBar: PropTypes.func,
    children: PropTypes.any,
    is_app_disabled: PropTypes.bool,
    is_cashier_visible: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_page: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    pwa_prompt_event: PropTypes.object,
    setPWAPromptEvent: PropTypes.func,
};

export default withRouter(
    connect(({ ui, segment }) => ({
        // is_logged_in          : client.is_logged_in,
        // addNotificationBar    : ui.addNotificationBar,
        identifyEvent: segment.identifyEvent,
        is_app_disabled: ui.is_app_disabled,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        is_route_modal_on: ui.is_route_modal_on,
        pageView: segment.pageView,
        pwa_prompt_event: ui.pwa_prompt_event,
        is_mt5_page: ui.is_mt5_page,
        is_cashier_visible: ui.is_cashier_visible,
        // setPWAPromptEvent     : ui.setPWAPromptEvent,
    }))(AppContents)
);
