import React from 'react';
import { Button, Loading } from '@deriv/components';
import { getPlatformRedirect, WS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router';
import DemoMessage from 'Components/demo-message';
import ErrorMessage from 'Components/error-component';
import NotRequired from 'Components/poi-not-required';
import Unsupported from 'Components/poi-unsupported';
import Verified from 'Components/poi-verified';
import Limited from 'Components/poi-limited';
import Expired from 'Components/poi-expired';
import UploadComplete from 'Components/poi-upload-complete';
import POISubmission from './proof-of-identity-submission.jsx';
import Onfido from './onfido.jsx';
import IdvContainer from './idv.jsx';
import { identity_status_codes, service_code } from './proof-of-identity-utils';
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
    const history = useHistory();
    const [api_error, setAPIError] = React.useState();
    const [has_require_submission, setHasRequireSubmission] = React.useState(false);
    const [residence_list, setResidenceList] = React.useState();
    const [is_status_loading, setStatusLoading] = React.useState(true);

    const from_platform = getPlatformRedirect(app_routing_history);
    const should_show_redirect_btn = from_platform.name === 'P2P';

    const routeBackTo = redirect_route => routeBackInApp(history, [redirect_route]);
    const handleRequireSubmission = () => setHasRequireSubmission(true);

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
                    } else {
                        setResidenceList(response_residence_list.residence_list);
                    }
                    setStatusLoading(false);
                });
            });
        }
    }, [is_switching]);

    if (is_status_loading || is_switching) {
        return <Loading is_fullscreen={false} />;
    } else if (is_virtual) {
        return <DemoMessage />;
    } else if (!should_allow_authentication) {
        return <NotRequired />;
    } else if (api_error) {
        return <ErrorMessage error_message={api_error?.message || api_error} />;
    }

    const verification_status = populateVerificationStatus(account_status);
    const {
        idv,
        allow_poi_resubmission,
        has_attempted_idv,
        identity_last_attempt,
        identity_status,
        is_idv_disallowed,
        manual,
        needs_poa,
        onfido,
    } = verification_status;

    const redirect_button = should_show_redirect_btn && (
        <Button primary className='proof-of-identity__redirect' onClick={() => routeBackTo(from_platform.route)}>
            <Localize i18n_default_text='Back to {{platform_name}}' values={{ platform_name: from_platform.name }} />
        </Button>
    );

    if (identity_status === identity_status_codes.none || has_require_submission || allow_poi_resubmission) {
        return (
            <POISubmission
                allow_poi_resubmission={allow_poi_resubmission}
                has_attempted_idv={has_attempted_idv}
                has_require_submission={has_require_submission}
                height={height ?? null}
                identity_last_attempt={identity_last_attempt}
                idv={idv}
                is_from_external={!!is_from_external}
                is_idv_disallowed={is_idv_disallowed}
                manual={manual}
                needs_poa={needs_poa}
                onfido={onfido}
                onStateChange={onStateChange}
                redirect_button={redirect_button}
                refreshNotifications={refreshNotifications}
                residence_list={residence_list}
            />
        );
        // Client status modified from BO does not get their latest attempts populated
    } else if (!identity_last_attempt) {
        switch (identity_status) {
            case identity_status_codes.pending:
                return (
                    <UploadComplete
                        is_from_external={is_from_external}
                        needs_poa={needs_poa}
                        redirect_button={redirect_button}
                    />
                );
            case identity_status_codes.verified:
                return (
                    <Verified
                        is_from_external={is_from_external}
                        needs_poa={needs_poa}
                        redirect_button={redirect_button}
                    />
                );
            case identity_status_codes.expired:
                return (
                    <Expired
                        is_from_external={is_from_external}
                        redirect_button={redirect_button}
                        handleRequireSubmission={handleRequireSubmission}
                    />
                );
            case identity_status_codes.rejected:
            case identity_status_codes.suspected:
                return <Limited handleRequireSubmission={handleRequireSubmission} />;
            default:
                break;
        }
    }

    switch (identity_last_attempt.service) {
        case service_code.idv:
            return (
                <IdvContainer
                    handleRequireSubmission={handleRequireSubmission}
                    idv={idv}
                    is_from_external={!!is_from_external}
                    needs_poa={needs_poa}
                    redirect_button={redirect_button}
                />
            );
        case service_code.onfido:
            return (
                <Onfido
                    handleRequireSubmission={handleRequireSubmission}
                    is_from_external={!!is_from_external}
                    needs_poa={needs_poa}
                    onfido={onfido}
                    redirect_button={redirect_button}
                />
            );
        case service_code.manual:
            return <Unsupported manual={manual} />;
        default:
            return null;
    }
};

export default ProofOfIdentityContainer;
