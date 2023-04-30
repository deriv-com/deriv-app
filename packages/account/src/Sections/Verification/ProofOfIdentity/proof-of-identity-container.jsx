import { Button, Loading } from '@deriv/components';
import { WS, getPlatformRedirect, platforms } from '@deriv/shared';
import { identity_status_codes, service_code } from './proof-of-identity-utils';
import DemoMessage from 'Components/demo-message';
import ErrorMessage from 'Components/error-component';
import Expired from 'Components/poi/status/expired';
import IdvContainer from './idv.jsx';
import Limited from 'Components/poi/status/limited';
import { Localize } from '@deriv/translations';
import NotRequired from 'Components/poi/status/not-required';
import Onfido from './onfido.jsx';
import POISubmission from './proof-of-identity-submission.jsx';
import React from 'react';
import Unsupported from 'Components/poi/status/unsupported';
import UploadComplete from 'Components/poi/status/upload-complete';
import Verified from 'Components/poi/status/verified';
import { populateVerificationStatus } from '../Helpers/verification';
import { useHistory } from 'react-router';

const ProofOfIdentityContainer = ({
    account_settings,
    account_status,
    app_routing_history,
    fetchResidenceList,
    getChangeableFields,
    height,
    is_from_external,
    is_switching,
    is_virtual,
    is_high_risk,
    is_withdrawal_lock,
    onStateChange,
    refreshNotifications,
    routeBackInApp,
    should_allow_authentication,
    setIsCfdPoiCompleted,
    updateAccountStatus,
}) => {
    const history = useHistory();
    const [api_error, setAPIError] = React.useState();
    const [has_require_submission, setHasRequireSubmission] = React.useState(false);
    const [residence_list, setResidenceList] = React.useState();
    const [is_status_loading, setStatusLoading] = React.useState(true);

    const from_platform = getPlatformRedirect(app_routing_history);

    const should_show_redirect_btn = Object.keys(platforms).includes(from_platform.ref);

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
        identity_last_attempt,
        identity_status,
        is_age_verified,
        is_idv_disallowed,
        manual,
        needs_poa,
        onfido,
    } = verification_status;
    const last_attempt_status = identity_last_attempt?.status;
    const is_last_attempt_idv = identity_last_attempt?.service === 'idv';
    const is_last_attempt_onfido = identity_last_attempt?.service === 'onfido';
    const should_ignore_idv = is_high_risk && is_withdrawal_lock;

    if (!should_allow_authentication && !is_age_verified) {
        return <NotRequired />;
    }

    const onClickRedirectButton = () => {
        const platform = platforms[from_platform.ref];
        const { is_hard_redirect = false, url = '' } = platform ?? {};
        if (is_hard_redirect) {
            window.location.href = url;
            window.localStorage.removeItem('config.platform');
        } else {
            routeBackTo(from_platform.route);
        }
    };

    const redirect_button = should_show_redirect_btn && (
        <Button primary className='proof-of-identity__redirect' onClick={onClickRedirectButton}>
            <Localize i18n_default_text='Back to {{platform_name}}' values={{ platform_name: from_platform.name }} />
        </Button>
    );

    if (
        identity_status === identity_status_codes.none ||
        has_require_submission ||
        allow_poi_resubmission ||
        (should_ignore_idv && is_last_attempt_idv && manual?.status !== 'verified' && manual?.status !== 'pending') ||
        (should_ignore_idv && is_last_attempt_onfido && last_attempt_status === 'rejected')
    ) {
        return (
            <POISubmission
                account_settings={account_settings}
                allow_poi_resubmission={allow_poi_resubmission}
                has_require_submission={has_require_submission}
                height={height ?? null}
                getChangeableFields={getChangeableFields}
                identity_last_attempt={identity_last_attempt}
                idv={idv}
                is_from_external={!!is_from_external}
                is_idv_disallowed={is_idv_disallowed || should_ignore_idv}
                manual={manual}
                needs_poa={needs_poa}
                onfido={onfido}
                onStateChange={onStateChange}
                redirect_button={redirect_button}
                refreshNotifications={refreshNotifications}
                residence_list={residence_list}
                setIsCfdPoiCompleted={setIsCfdPoiCompleted}
                updateAccountStatus={updateAccountStatus}
            />
        );
    } else if (
        !identity_last_attempt ||
        // Prioritise verified status from back office. How we know this is if there is mismatch between current statuses (Should be refactored)
        (identity_status === identity_status_codes.verified && identity_status !== identity_last_attempt.status)
    ) {
        switch (identity_status) {
            case identity_status_codes.pending:
                return (
                    <UploadComplete
                        is_from_external={!!is_from_external}
                        needs_poa={needs_poa}
                        redirect_button={redirect_button}
                        is_manual_upload={manual?.status === 'pending'}
                    />
                );
            case identity_status_codes.verified:
                return (
                    <Verified
                        is_from_external={!!is_from_external}
                        needs_poa={needs_poa}
                        redirect_button={redirect_button}
                    />
                );
            case identity_status_codes.expired:
                return (
                    <Expired
                        is_from_external={!!is_from_external}
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
                    manual={manual}
                    setIsCfdPoiCompleted={setIsCfdPoiCompleted}
                    redirect_button={redirect_button}
                />
            );
        case service_code.manual:
            return (
                <Unsupported
                    manual={manual}
                    is_from_external={is_from_external}
                    setIsCfdPoiCompleted={setIsCfdPoiCompleted}
                    needs_poa={needs_poa}
                    redirect_button={redirect_button}
                    handleRequireSubmission={handleRequireSubmission}
                />
            );
        default:
            return null;
    }
};

export default ProofOfIdentityContainer;
