import React from 'react';
import { Loading } from '@deriv/components';
import { WS } from '@deriv/shared';
import DemoMessage from 'Components/demo-message';
import ErrorMessage from 'Components/error-component';
import Verified from 'Components/poi/status/verified';
import Limited from 'Components/poi/status/limited';
import Expired from 'Components/poi/status/expired';
import UploadComplete from 'Components/poi/status/upload-complete';
import NotRequired from 'Components/poi/status/not-required';
import Onfido from './onfido.jsx';
import IdvContainer from './idv.jsx';
import Unsupported from 'Components/poi/status/unsupported';
import POISubmissionForMT5 from './proof-of-identity-submission-for-mt5.jsx';
import { identity_status_codes, service_code } from './proof-of-identity-utils';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIdentityContainerforMt5 = ({
    account_status,
    fetchResidenceList,
    height,
    is_from_external,
    is_switching,
    is_virtual,
    onStateChange,
    refreshNotifications,
    should_allow_authentication,
    citizen_data,
}) => {
    const [api_error, setAPIError] = React.useState();
    const [has_require_submission, setHasRequireSubmission] = React.useState(false);
    const [residence_list, setResidenceList] = React.useState();
    const [is_status_loading, setStatusLoading] = React.useState(true);

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
    }, [fetchResidenceList, is_switching]);

    if (is_status_loading || is_switching) {
        return <Loading is_fullscreen={false} />;
    } else if (is_virtual) {
        return <DemoMessage />;
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
        is_age_verified,
        is_idv_disallowed,
        manual,
        needs_poa,
        onfido,
    } = verification_status;

    if (!should_allow_authentication && !is_age_verified) {
        return <NotRequired />;
    }

    if (identity_status === identity_status_codes.none || allow_poi_resubmission || has_require_submission) {
        return (
            <POISubmissionForMT5
                has_attempted_idv={has_attempted_idv}
                height={height ?? null}
                identity_last_attempt={identity_last_attempt}
                idv={idv}
                is_from_external={!!is_from_external}
                is_idv_disallowed={is_idv_disallowed}
                manual={manual}
                needs_poa={needs_poa}
                onfido={onfido}
                onStateChange={onStateChange}
                refreshNotifications={refreshNotifications}
                residence_list={residence_list}
                citizen_data={citizen_data}
            />
        );
    } else if (
        !identity_last_attempt ||
        // Prioritise verified status from back office. How we know this is if there is mismatch between current statuses (Should be refactored)
        (identity_status === 'verified' && identity_status !== identity_last_attempt.status)
    ) {
        switch (identity_status) {
            case identity_status_codes.pending:
                return <UploadComplete is_from_external={is_from_external} needs_poa={needs_poa} />;
            case identity_status_codes.verified:
                return <Verified is_from_external={is_from_external} needs_poa={needs_poa} />;
            case identity_status_codes.expired:
                return (
                    <Expired is_from_external={is_from_external} handleRequireSubmission={handleRequireSubmission} />
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
                />
            );
        case service_code.onfido:
            return (
                <Onfido
                    handleRequireSubmission={handleRequireSubmission}
                    is_from_external={!!is_from_external}
                    needs_poa={needs_poa}
                    onfido={onfido}
                />
            );
        case service_code.manual:
            return <Unsupported manual={manual} />;
        default:
            return null;
    }
};

export default ProofOfIdentityContainerforMt5;
