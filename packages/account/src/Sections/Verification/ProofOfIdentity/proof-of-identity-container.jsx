import React from 'react';
import { withRouter } from 'react-router-dom';
import * as Cookies from 'js-cookie';
import { Button, Loading } from '@deriv/components';
import { getPlatformRedirect, WS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import DemoMessage from 'Components/demo-message';
import ErrorMessage from 'Components/error-component';
import NotRequired from 'Components/poi-not-required';
import Unsupported from 'Components/poi-unsupported';
import MissingPersonalDetails from 'Components/poi-missing-personal-details';
import { connect } from 'Stores/connect';
import POISubmission from './proof-of-identity-submission.jsx';
import Onfido from './onfido.jsx';
import IdvContainer from './idv.jsx';
import { identity_status_codes, service_code } from './proof-of-identity-utils';
// Enable for testing
// import { figmaAccountStatus } from './mock/account_status';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIdentityContainer = ({
    account_status,
    app_routing_history,
    fetchResidenceList,
    height,
    is_from_external,
    is_switching,
    is_virtual,
    onStateChange,
    refreshNotifications,
    routeBackInApp,
    should_allow_authentication,
}) => {
    const [api_error, setAPIError] = React.useState();
    const [has_require_submission, setHasRequireSubmission] = React.useState(false);
    const [residence_list, setResidenceList] = React.useState();
    const [onfido_service_token, setOnfidoToken] = React.useState();
    const [missing_personal_details, setMissingPersonalDetails] = React.useState(false);
    const [is_status_loading, setStatusLoading] = React.useState(true);

    const has_invalid_postal_code = missing_personal_details === 'postal_code';
    const from_platform = getPlatformRedirect(app_routing_history);
    const should_show_redirect_btn = from_platform.name === 'P2P';

    const routeBackTo = redirect_route => routeBackInApp(history, [redirect_route]);

    const handleRequireSubmission = () => {
        setHasRequireSubmission(true);
    };

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

                fetchResidenceList()
                    .then(response_residence_list => {
                        if (response_residence_list.error) {
                            setAPIError(response_residence_list.error);
                            setStatusLoading(false);
                        } else {
                            setResidenceList(response_residence_list.residence_list);
                        }
                    })
                    .then(() => {
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
                    });
            });
        }
    }, [is_switching]);

    // const new_account_status = figmaAccountStatus('idv_none') || account_status;
    const verification_status = populateVerificationStatus(account_status);
    const { idv, onfido, manual, identity_status, identity_last_attempt, needs_poa } = verification_status;
    const redirect_button = should_show_redirect_btn && (
        <Button primary className='proof-of-identity__redirect' onClick={() => routeBackTo(from_platform.route)}>
            <Localize i18n_default_text='Back to {{platform_name}}' values={{ platform_name: from_platform.name }} />
        </Button>
    );

    if (is_status_loading || is_switching) {
        return <Loading is_fullscreen={false} />;
    }

    if (api_error) {
        return <ErrorMessage error_message={api_error?.message || api_error} />;
    }

    if (missing_personal_details) {
        return <MissingPersonalDetails has_invalid_postal_code={has_invalid_postal_code} from='proof_of_identity' />;
    }

    if (is_virtual) {
        return <DemoMessage />;
    }

    if (!should_allow_authentication) {
        return <NotRequired />;
    }

    if (identity_status === identity_status_codes.none || has_require_submission) {
        return (
            <POISubmission
                residence_list={residence_list}
                height={height ?? null}
                is_from_external={is_from_external}
                onfido_service_token={onfido_service_token}
                identity_last_attempt={identity_last_attempt}
                has_require_submission={has_require_submission}
                idv={idv}
                onfido={onfido}
                onStateChange={onStateChange}
                needs_poa={needs_poa}
                setAPIError={setAPIError}
                manual={manual}
                refreshNotifications={refreshNotifications}
                redirect_button={redirect_button}
            />
        );
    }

    switch (identity_last_attempt.service) {
        case service_code.idv:
            return (
                <IdvContainer
                    // TODO: start deprecated
                    is_from_external={is_from_external}
                    redirect_button={redirect_button}
                    // End deprecation
                    idv={idv}
                    residence_list={residence_list}
                    handleRequireSubmission={handleRequireSubmission}
                    setAPIError={setAPIError}
                    refreshNotifications={refreshNotifications}
                    verification_status={verification_status}
                />
            );
        case service_code.onfido:
            return (
                <Onfido
                    // TODO: start deprecated
                    is_from_external={is_from_external}
                    redirect_button={redirect_button}
                    // End deprecated
                    verification_status={verification_status}
                    handleRequireSubmission={handleRequireSubmission}
                    residence_list={residence_list}
                    onfido={onfido}
                    onfido_service_token={onfido_service_token}
                    onStateChange={onStateChange}
                    height={height ?? null}
                    refreshNotifications={refreshNotifications}
                    setAPIError={setAPIError}
                />
            );
        case service_code.manual:
            return <Unsupported manual={manual} />;
        default:
            return null;
    }
};

export default connect(({ client, common }) => ({
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    fetchResidenceList: client.fetchResidenceList,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: client.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
}))(withRouter(ProofOfIdentityContainer));
