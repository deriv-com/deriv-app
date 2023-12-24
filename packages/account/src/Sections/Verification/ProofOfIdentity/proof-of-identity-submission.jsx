import React from 'react';
import { useHistory } from 'react-router';
import {
    AUTH_STATUS_CODES,
    formatIDVError,
    getPlatformRedirect,
    IDV_ERROR_STATUS,
    platforms,
    POIContext,
    service_code,
    submission_status_code,
    WS,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import CountrySelector from '../../../Components/poi/poi-country-selector';
import IdvDocumentSubmit from '../../../Components/poi/idv-document-submit';
import IdvFailed from '../../../Components/poi/idv-status/idv-failed';
import Unsupported from '../../../Components/poi/status/unsupported';
import VerificationStatus from '../../../Components/verification-status/verification-status';
import OnfidoSdkViewContainer from './onfido-sdk-view-container';
import { getIDVStatusMessages, getUploadCompleteStatusMessages } from './proof-of-identity-configs';

const POISubmission = observer(
    ({
        allow_poi_resubmission,
        has_require_submission,
        height,
        identity_last_attempt,
        idv,
        is_from_external,
        is_idv_disallowed,
        needs_poa,
        onfido,
        onStateChange,
        redirect_button,
        residence_list,
        setIsCfdPoiCompleted,
        should_show_mismatch_form,
    }) => {
        const {
            submission_service,
            setSubmissionService,
            submission_status,
            setSubmissionStatus,
            selected_country,
            setSelectedCountry,
        } = React.useContext(POIContext);

        const history = useHistory();

        const { client, common, notifications, ui } = useStore();

        const { account_settings, getChangeableFields, account_status, is_already_attempted } = client;
        const { app_routing_history, routeBackInApp } = common;
        const { refreshNotifications } = notifications;
        const { is_mobile } = ui;

        const is_high_risk = account_status.risk_classification === 'high';

        const from_platform = getPlatformRedirect(app_routing_history);

        const routeBackTo = redirect_route => routeBackInApp(history, [redirect_route]);

        const handleSelectionNext = () => {
            if (Object.keys(selected_country).length) {
                const { submissions_left: idv_submissions_left } = idv;
                const { submissions_left: onfido_submissions_left } = onfido;
                const is_idv_supported = selected_country.identity.services.idv.is_country_supported;
                const is_onfido_supported =
                    selected_country.identity.services.onfido.is_country_supported && selected_country.value !== 'ng';
                if (is_idv_supported && Number(idv_submissions_left) > 0 && !is_idv_disallowed) {
                    setSubmissionService(service_code.idv);
                } else if (Number(onfido_submissions_left) > 0 && is_onfido_supported) {
                    setSubmissionService(service_code.onfido);
                } else {
                    setSubmissionService(service_code.manual);
                }
                setSubmissionStatus(submission_status_code.submitting);
            }
        };

        const handleViewComplete = () => {
            if (onStateChange && typeof onStateChange === 'function') {
                onStateChange(AUTH_STATUS_CODES.PENDING);
            }
            setSubmissionStatus(submission_status_code.complete);

            WS.authorized.getAccountStatus().then(() => {
                refreshNotifications();
            });
        };
        const handleBack = () => setSubmissionStatus(submission_status_code.selecting);
        const getCountryFromResidence = React.useCallback(
            country_code => residence_list.find(residence => residence.value === country_code),
            [residence_list]
        );
        const needs_resubmission = has_require_submission || allow_poi_resubmission;

        const mismatch_status = formatIDVError(idv.last_rejected, idv.status, is_high_risk);

        const idv_status_content = getIDVStatusMessages(
            idv.status,
            { needs_poa, is_already_attempted, mismatch_status },
            !!redirect_button,
            is_from_external
        );

        const manual_upload_complete_status_content = getUploadCompleteStatusMessages(
            AUTH_STATUS_CODES.PENDING,
            { needs_poa, is_manual_upload: true },
            !!redirect_button,
            is_from_external
        );

        const onfido_upload_complete_status_content = getUploadCompleteStatusMessages(
            AUTH_STATUS_CODES.PENDING,
            { needs_poa },
            !!redirect_button,
            is_from_external
        );

        const onClickRedirectButton = () => {
            const platform = platforms[from_platform.ref];
            const { is_hard_redirect = false, url = '' } = platform ?? {};
            if (is_hard_redirect) {
                window.location.href = url;
                window.sessionStorage.removeItem('config.platform');
            } else {
                routeBackTo(from_platform.route);
            }
        };

        const setIdentityService = React.useCallback(
            identity_last_attempt => {
                const { service, country_code } = identity_last_attempt;
                setSelectedCountry(getCountryFromResidence(country_code));
                switch (service) {
                    case service_code.idv:
                    case service_code.onfido: {
                        if (Number(idv.submissions_left) > 0 || Number(onfido.submissions_left) > 0) {
                            setSubmissionStatus(submission_status_code.selecting);
                        } else {
                            setSubmissionService(service_code.manual);
                            setSubmissionStatus(submission_status_code.submitting);
                        }
                        break;
                    }
                    case service_code.manual: {
                        setSubmissionService(service_code.manual);
                        setSubmissionStatus(submission_status_code.submitting);
                        break;
                    }
                    default:
                        break;
                }
            },
            [
                getCountryFromResidence,
                idv.submissions_left,
                onfido.submissions_left,
                setSelectedCountry,
                setSubmissionService,
                setSubmissionStatus,
                is_idv_disallowed,
            ]
        );
        React.useEffect(() => {
            if (submission_status != submission_status_code.selecting) {
                return;
            }
            if (needs_resubmission && identity_last_attempt) {
                setIdentityService(identity_last_attempt);
            } else if (
                mismatch_status &&
                [
                    IDV_ERROR_STATUS.DobMismatch.code,
                    IDV_ERROR_STATUS.NameMismatch.code,
                    IDV_ERROR_STATUS.NameDobMismatch.code,
                ].includes(mismatch_status) &&
                idv.submissions_left > 0
            ) {
                setSubmissionService(service_code.idv);
                setSubmissionStatus(submission_status_code.submitting);
            } else {
                setSubmissionStatus(submission_status_code.selecting);
            }
        }, [
            allow_poi_resubmission,
            identity_last_attempt,
            needs_resubmission,
            setIdentityService,
            submission_status,
            idv,
            mismatch_status,
            setSubmissionService,
            setSubmissionStatus,
        ]);
        switch (submission_status) {
            case submission_status_code.selecting: {
                return (
                    <CountrySelector
                        handleSelectionNext={handleSelectionNext}
                        is_from_external={is_from_external}
                        mismatch_status={mismatch_status}
                    />
                );
            }
            case submission_status_code.submitting: {
                switch (submission_service) {
                    case service_code.idv:
                        return should_show_mismatch_form ? (
                            <IdvFailed
                                account_settings={account_settings}
                                getChangeableFields={getChangeableFields}
                                mismatch_status={mismatch_status}
                                residence_list={residence_list}
                                handleSubmit={handleViewComplete}
                                latest_status={identity_last_attempt}
                                selected_country={selected_country}
                            />
                        ) : (
                            <IdvDocumentSubmit
                                handleViewComplete={handleViewComplete}
                                handleBack={handleBack}
                                selected_country={selected_country}
                            />
                        );
                    case service_code.onfido: {
                        const country_code = selected_country.value;
                        const doc_obj = selected_country.identity.services.onfido.documents_supported;
                        const documents_supported = Object.keys(doc_obj).map(d => doc_obj[d].display_name);
                        return (
                            <OnfidoSdkViewContainer
                                country_code={country_code}
                                documents_supported={documents_supported}
                                getChangeableFields={getChangeableFields}
                                handleViewComplete={handleViewComplete}
                                height={height}
                            />
                        );
                    }
                    case service_code.manual:
                        return (
                            <Unsupported
                                country_code={selected_country.value}
                                is_from_external={is_from_external}
                                setIsCfdPoiCompleted={setIsCfdPoiCompleted}
                                allow_poi_resubmission={allow_poi_resubmission}
                                handleViewComplete={handleViewComplete}
                                onfido={onfido}
                            />
                        );
                    default:
                        return null;
                }
            }
            case submission_status_code.complete: {
                let content = {};
                if (submission_service === service_code.idv) {
                    content = idv_status_content;
                }
                if (submission_service === service_code.manual) {
                    content = manual_upload_complete_status_content;
                }
                if (submission_service === service_code.onfido) {
                    content = onfido_upload_complete_status_content;
                }

                return (
                    <VerificationStatus
                        icon={content.icon}
                        is_mobile={is_mobile}
                        status_description={content.description}
                        status_title={content.title}
                    >
                        {content.action_button?.({ onClick: onClickRedirectButton, platform_name: from_platform.name })}
                    </VerificationStatus>
                );
            }
            default:
                return null;
        }
    }
);
export default POISubmission;
