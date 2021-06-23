import React, { useState } from 'react';
import * as Cookies from 'js-cookie';
import { withRouter } from 'react-router-dom';
import { AutoHeightWrapper, Button, Loading } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getPlatformRedirect } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import DemoMessage from 'Components/demo-message';
import ErrorMessage from 'Components/error-component';
import NotRequired from 'Components/poi-not-required';
import MissingPersonalDetails from 'Components/poi-missing-personal-details';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';

const ProofOfIdentity = ({
    account_status,
    app_routing_history,
    history,
    should_allow_authentication,
    is_switching,
    is_virtual,
    refreshNotifications,
    routeBackInApp,
    fetchResidenceList,
}) => {
    const [is_status_loading, setStatusLoading] = useState(true);
    const [api_error, setAPIError] = React.useState();
    const [missing_personal_details, setMissingPersonalDetails] = React.useState(false);
    const [onfido_service_token, setOnfidoToken] = React.useState();
    const [residence_list, setResidenceList] = React.useState();
    const from_platform = getPlatformRedirect(app_routing_history);
    const should_show_redirect_btn = from_platform.name === 'P2P';
    const has_invalid_postal_code = missing_personal_details === 'postal_code';

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
        if (!is_switching) {
            WS.authorized.getAccountStatus().then(response_account_status => {
                if (response_account_status.error) {
                    setAPIError(response_account_status.error);
                    setStatusLoading(false);
                    return;
                }

                fetchResidenceList().then(response_residence_list => {
                    if (response_residence_list.error) {
                        setAPIError(response_residence_list.error);
                        setStatusLoading(false);
                    } else {
                        setResidenceList(response_residence_list.residence_list);
                        // TODO: add check if require onfido
                        getOnfidoServiceToken().then(response_token => {
                            if (response_token.error) {
                                const code = response_token?.error?.code;

                                switch (code) {
                                    case 'MissingPersonalDetails':
                                        setMissingPersonalDetails('all');
                                        break;
                                    case 'InvalidPostalCode':
                                        setMissingPersonalDetails('postal_code');
                                        break;
                                    default:
                                        setAPIError(response_token.error);
                                        break;
                                }
                            } else {
                                setOnfidoToken(response_token);
                            }

                            setStatusLoading(false);
                        });
                    }
                });
            });
        }
    }, [is_switching]);

    if (is_status_loading || is_switching)
        return (
            <div className='proof-of-identity'>
                <div className='proof-of-identity__main-container'>
                    <Loading is_fullscreen={false} />
                </div>
            </div>
        );
    if (api_error) return <ErrorMessage error_message={api_error?.message || api_error} />;
    if (is_virtual) return <DemoMessage />;
    if (!should_allow_authentication) return <NotRequired />;
    if (missing_personal_details)
        return <MissingPersonalDetails has_invalid_postal_code={has_invalid_postal_code} from='proof_of_identity' />;

    return (
        <AutoHeightWrapper default_height={200}>
            {({ setRef, height }) => (
                <div ref={setRef} className='proof-of-identity'>
                    <div className='proof-of-identity__main-container'>
                        <ProofOfIdentityContainer
                            account_status={account_status}
                            setAPIError={setAPIError}
                            refreshNotifications={refreshNotifications}
                            onfido_service_token={onfido_service_token}
                            residence_list={residence_list}
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
                </div>
            )}
        </AutoHeightWrapper>
    );
};

export default connect(({ client, common }) => ({
    account_status: client.account_status,
    has_missing_required_field: client.has_missing_required_field,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: client.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    app_routing_history: common.app_routing_history,
    should_allow_authentication: client.should_allow_authentication,
    fetchResidenceList: client.fetchResidenceList,
}))(withRouter(ProofOfIdentity));
