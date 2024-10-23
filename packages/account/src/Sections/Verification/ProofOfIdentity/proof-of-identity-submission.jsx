import React from 'react';
import { formatIDVError, WS, IDV_ERROR_STATUS, POIContext, isIDVReportNotAvailable } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import CountrySelector from '../../../Components/poi/poi-country-selector';
import IdvDocumentSubmit from '../../../Components/poi/idv-document-submit';
import IdvFailed from '../../../Components/poi/idv-status/idv-failed';
import IdvSubmitComplete from '../../../Components/poi/idv-status/idv-submit-complete';
import Unsupported from '../../../Components/poi/status/unsupported';
import UploadComplete from '../../../Components/poi/status/upload-complete';
import OnfidoSdkViewContainer from './onfido-sdk-view-container';
import { identity_status_codes, submission_status_code, service_code } from './proof-of-identity-utils';
import { useKycAuthStatusMocked } from '../../../hooks';

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

        const { client, notifications } = useStore();

        const { account_settings, getChangeableFields, account_status } = client;
        const { kyc_auth_status } = useKycAuthStatusMocked();
        const { refreshNotifications } = notifications;
        const is_high_risk = account_status.risk_classification === 'high';

        const handleSelectionNext = () => {
            if (Object.keys(selected_country).length) {
                const { identity } = kyc_auth_status;
                if (identity.available_services) {
                    setSubmissionService(identity.available_services[0]);
                } else {
                    setSubmissionService(service_code.manual);
                }
                setSubmissionStatus(submission_status_code.submitting);
            }
        };

        const handleViewComplete = () => {
            if (onStateChange && typeof onStateChange === 'function') {
                onStateChange(identity_status_codes.pending);
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
        const is_report_not_available = isIDVReportNotAvailable(idv);
        const mismatch_status = formatIDVError(idv.last_rejected, idv.status, is_high_risk, is_report_not_available);

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
                                handleSelectionNext={handleSelectionNext}
                                report_available={!!idv?.report_available}
                            />
                        ) : (
                            <IdvDocumentSubmit
                                handleSelectionNext={handleSelectionNext}
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
                                allow_poi_resubmission={allow_poi_resubmission}
                                handleViewComplete={handleViewComplete}
                                onfido={onfido}
                                handleBack={handleBack}
                                is_resubmission={needs_resubmission}
                            />
                        );
                    default:
                        return null;
                }
            }
            case submission_status_code.complete: {
                switch (submission_service) {
                    case service_code.idv:
                        return (
                            <IdvSubmitComplete
                                is_from_external={is_from_external}
                                mismatch_status={mismatch_status}
                                needs_poa={needs_poa}
                                redirect_button={redirect_button}
                            />
                        );
                    // This will be replaced in the next Manual Upload Project
                    case service_code.manual:
                        return (
                            <UploadComplete
                                is_from_external={is_from_external}
                                needs_poa={needs_poa}
                                redirect_button={redirect_button}
                                is_manual_upload
                            />
                        );
                    case service_code.onfido:
                        return (
                            <UploadComplete
                                is_from_external={is_from_external}
                                needs_poa={needs_poa}
                                redirect_button={redirect_button}
                            />
                        );
                    default:
                        return null;
                }
            }
            default:
                return null;
        }
    }
);

export default POISubmission;
