import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React from 'react';
import { withRouter }       from 'react-router';
import { ThemedScrollbars } from 'deriv-components';
import { connect }          from 'Stores/connect';
import { get as getLanguage } from '_common/language';
// import InstallPWA    from './install-pwa.jsx';

const AppContents = ({
    // addNotificationBar,
    children,
    client_account_settings,
    client_currency,
    client_device_data,
    client_loginid,
    is_app_disabled,
    is_logged_in,
    is_positions_drawer_on,
    is_route_modal_on,
    // setPWAPromptEvent,
}) => {
    if (is_logged_in) {
        const {
            address_city,
            address_postcode,
            address_state,
            citizen,
            email,
            first_name,
            last_name,
            phone,
            place_of_birth,
            residence,
            tax_identification_number,
            tax_residence,
        } = client_account_settings;

        const {
            affiliate_token,
            date_first_contact,
            gclid_url,
            signup_device,
            utm_campaign,
            utm_medium,
            utm_source,
        } = client_device_data;

        // First data appraoch
        window.analytics.identify(client_loginid, {
            address_city,
            address_postcode,
            address_state,
            affiliate_token,
            citizen,
            currency: client_currency,
            date_first_contact,
            email,
            gclid_url,
            language: getLanguage().toLowerCase(),
            name    : `${first_name} ${last_name}`,
            phone,
            place_of_birth,
            residence,
            signup_device,
            tax_identification_number,
            tax_residence,
            utm_campaign,
            utm_medium,
            utm_source,
        });

        window.analytics.page();

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
    }

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
    addNotificationBar     : PropTypes.func,
    children               : PropTypes.any,
    client_account_settings: PropTypes.object,
    client_currency        : PropTypes.string,
    client_device_data     : PropTypes.object,
    client_loginid         : PropTypes.string,
    is_app_disabled        : PropTypes.bool,
    is_logged_in           : PropTypes.bool,
    is_positions_drawer_on : PropTypes.bool,
    is_route_modal_on      : PropTypes.bool,
    pwa_prompt_event       : PropTypes.object,
    setPWAPromptEvent      : PropTypes.func,
};

export default withRouter(connect(
    ({ client, ui }) => ({
        client_account_settings: client.account_settings,
        client_currency        : client.currency,
        client_device_data     : client.device_data,
        client_loginid         : client.loginid,
        is_logged_in           : client.is_logged_in,
        // addNotificationBar    : ui.addNotificationBar,
        is_app_disabled        : ui.is_app_disabled,
        is_positions_drawer_on : ui.is_positions_drawer_on,
        is_route_modal_on      : ui.is_route_modal_on,
        pwa_prompt_event       : ui.pwa_prompt_event,
        // setPWAPromptEvent     : ui.setPWAPromptEvent,
    })
)(AppContents));
