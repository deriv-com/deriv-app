import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { DesktopWrapper, MobileWrapper, ThemedScrollbars, Dialog } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';
// import InstallPWA    from './install-pwa.jsx';

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
    const [external_link_statue, setExternalLinkStatus] = React.useState(false);
    const [dialog_status, setDialogStatus] = React.useState(false);
    const [external_link, setExternalLink] = React.useState(false);
    const onCancelDialog = () => {
        setDialogStatus(false);
    };
    const onConfirmDialog = () => {
        setDialogStatus(false);
        window.open(external_link);
    };
    React.useEffect(() => {
        document.addEventListener('click', function(e) {
            if (e.target.relList && e.target.relList.value !== '') {
                setExternalLink(e.target.href);
                e.preventDefault();
                setExternalLinkStatus(true);
                setDialogStatus(true);
            }
        });
    }, []);

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
                {external_link_statue && (
                    <Dialog
                        className='redirect-notice'
                        is_visible={dialog_status}
                        title='Redirect notice'
                        is_open={dialog_status}
                        cancel_button_text={localize('Cancel')}
                        confirm_button_text={localize('Proceed')}
                        onCancel={onCancelDialog}
                        onConfirm={onConfirmDialog}
                    >
                        {'You are being redirected to an external website.'}
                    </Dialog>
                )}
                {/* Calculate height of user screen and offset height of header and footer */}
                <ThemedScrollbars height='calc(100vh - 84px)'>{children}</ThemedScrollbars>
            </DesktopWrapper>
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
