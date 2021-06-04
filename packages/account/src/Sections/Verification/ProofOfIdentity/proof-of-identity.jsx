import React, { useState } from 'react';
import * as Cookies from 'js-cookie';
import { withRouter } from 'react-router-dom';
import { AutoHeightWrapper, Button, Loading } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getPlatformRedirect, useIsMounted } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import DemoMessage from 'Components/demo-message';
import ErrorMessage from 'Components/error-component';
import MissingPersonalDetails from 'Components/poi-missing-personal-details';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';

const ProofOfIdentity = ({
    account_status,
    app_routing_history,
    history,
    is_mx_mlt,
    is_switching,
    is_virtual,
    refreshNotifications,
    routeBackInApp,
    should_allow_authentication,
}) => {
    const [is_status_loading, setStatusLoading] = useState(true);
    const [api_error, setAPIError] = React.useState();
    const [is_missing_personal_details, setMissingPersonalDetails] = React.useState(false);
    const [onfido_service_token, setOnfidoToken] = React.useState();
    const isMounted = useIsMounted();
    const from_platform = getPlatformRedirect(app_routing_history);
    const should_show_redirect_btn = from_platform.name === 'P2P';

    const routeBackTo = redirect_route => routeBackInApp(history, [redirect_route]);

    const getOnfidoServiceToken = React.useCallback(
        () =>
            new Promise(resolve => {
                const onfido_cookie_name = 'onfido_token';
                const onfido_cookie = Cookies.get(onfido_cookie_name);

                if (!onfido_cookie) {
                    WS.serviceToken({
                        service_token: 1,
                        service: 'onfido',
                    }).then(response => {
                        if (response.error) {
                            resolve({ error: response.error });
                            return;
                        }

                        const { token } = response.service_token.onfido;
                        const in_90_minutes = 1 / 16;
                        Cookies.set(onfido_cookie_name, token, {
                            expires: in_90_minutes,
                            secure: true,
                            sameSite: 'strict',
                        });
                        resolve(token);
                    });
                } else {
                    resolve(onfido_cookie);
                }
            }),
        []
    );

    React.useEffect(() => {
        // only re-mount logic when switching is done
        if (isMounted && !is_switching) {
            WS.authorized.getAccountStatus().then(response => {
                if (response.error) {
                    setAPIError(response.error);
                }
                if (!should_allow_authentication) {
                    routeBackInApp(history, [from_platform]);
                }
                getOnfidoServiceToken().then(response_token => {
                    if (response_token.error) {
                        if (response_token.error.code === 'MissingPersonalDetails') {
                            setMissingPersonalDetails(true);
                        } else {
                            setAPIError(response_token.error);
                        }
                    }

                    setStatusLoading(false);
                    setOnfidoToken(response_token);
                });
            });
        }
    }, [
        getOnfidoServiceToken,
        from_platform,
        history,
        isMounted,
        routeBackInApp,
        should_allow_authentication,
        is_switching,
    ]);

    if (is_status_loading || is_switching) return <Loading is_fullscreen={false} />;
    if (api_error) return <ErrorMessage error_message={api_error.message} />;
    if (is_virtual) return <DemoMessage />;
    if (is_missing_personal_details) return <MissingPersonalDetails />;

    return (
        <AutoHeightWrapper default_height={200}>
            {({ setRef, height }) => (
                <div ref={setRef} className='proof-of-identity'>
                    <ProofOfIdentityContainer
                        account_status={account_status}
                        setAPIError={setAPIError}
                        is_mx_mlt={is_mx_mlt}
                        refreshNotifications={refreshNotifications}
                        onfido_service_token={onfido_service_token}
                        height={height}
                        redirect_button={
                            should_show_redirect_btn && (
                                <Button
                                    primary
                                    className='proof-of-identity__redirect'
                                    onClick={() => routeBackTo(from_platform.route)}
                                >
                                    <Localize
                                        i18n_default_text='Back to {{platform_name}}'
                                        values={{ platform_name: from_platform.name }}
                                    />
                                </Button>
                            )
                        }
                        is_description_enabled
                    />
                </div>
            )}
        </AutoHeightWrapper>
    );
};

export default connect(({ client, common }) => ({
    account_status: client.account_status,
    has_missing_required_field: client.has_missing_required_field,
    is_mx_mlt: client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta',
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: client.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    app_routing_history: common.app_routing_history,
    should_allow_authentication: client.should_allow_authentication,
}))(withRouter(ProofOfIdentity));
