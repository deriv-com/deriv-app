/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { WS } from '@deriv/shared';
import CountrySelector from 'Components/poi/poi-country-selector';
import IdvDocumentSubmit from 'Components/poi/idv-document-submit';
import IdvUploadComplete from 'Components/poi/idv-status/idv-submit-complete';
import Unsupported from 'Components/poi/status/unsupported';
import UploadComplete from 'Components/poi/status/upload-complete';
import OnfidoUpload from './onfido-sdk-view.jsx';
import { identity_status_codes, submission_status_code, service_code } from './proof-of-identity-utils';

const POISubmission = ({
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
    refreshNotifications,
    residence_list,
    setIsCfdPoiCompleted,
}) => {
    const [submission_status, setSubmissionStatus] = React.useState(); // selecting, submitting, complete
    const [submission_service, setSubmissionService] = React.useState();
    const [selected_country, setSelectedCountry] = React.useState({});

    const handleSelectionNext = () => {
        if (Object.keys(selected_country).length) {
            const { submissions_left: idv_submissions_left } = idv;
            const { submissions_left: onfido_submissions_left } = onfido;
            const is_idv_supported = selected_country.identity.services.idv.is_country_supported;
            const is_onfido_supported =
                selected_country.identity.services.onfido.is_country_supported && selected_country.value !== 'ng';

            if (is_idv_supported && Number(idv_submissions_left) > 0 && !is_idv_disallowed) {
                setSubmissionService(service_code.idv);
            } else if (onfido_submissions_left && is_onfido_supported) {
                setSubmissionService(service_code.onfido);
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

    React.useEffect(() => {
        if (submission_status !== submission_status_code.complete) {
            if ((has_require_submission || allow_poi_resubmission) && identity_last_attempt) {
                switch (identity_last_attempt.service) {
                    case service_code.idv: {
                        if (Number(idv.submissions_left) > 0 || Number(onfido.submissions_left) > 0) {
                            setSubmissionStatus(submission_status_code.selecting);
                        } else {
                            setSubmissionService(service_code.manual);
                            setSubmissionStatus(submission_status_code.submitting);
                        }
                        break;
                    }
                    case service_code.onfido: {
                        if (Number(onfido.submissions_left) > 0) {
                            setSubmissionStatus(submission_status_code.selecting);
                        } else {
                            setSubmissionService(service_code.manual);
                            setSubmissionStatus(submission_status_code.submitting);
                        }
                        break;
                    }
                    case service_code.manual: {
                        setSelectedCountry(getCountryFromResidence(identity_last_attempt.country_code));
                        setSubmissionStatus(submission_status_code.submitting);
                        setSubmissionService(service_code.manual);
                        break;
                    }
                    default:
                        break;
                }
            } else {
                setSubmissionStatus(submission_status_code.selecting);
            }
        }
    }, [
        allow_poi_resubmission,
        getCountryFromResidence,
        has_require_submission,
        identity_last_attempt,
        idv.submissions_left,
        onfido.submissions_left,
    ]);

    switch (submission_status) {
        case submission_status_code.selecting: {
            return (
                <CountrySelector
                    handleSelectionNext={handleSelectionNext}
                    is_from_external={is_from_external}
                    residence_list={residence_list}
                    selected_country={selected_country}
                    setSelectedCountry={setSelectedCountry}
                />
            );
        }
        case submission_status_code.submitting: {
            switch (submission_service) {
                case service_code.idv:
                    return (
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
                        <OnfidoUpload
                            country_code={country_code}
                            documents_supported={documents_supported}
                            handleViewComplete={handleViewComplete}
                            height={height}
                            is_from_external={is_from_external}
                            refreshNotifications={refreshNotifications}
                            OnfidoUpload
                        />
                    );
                }
                case service_code.manual:
                    return (
                        <Unsupported
                            country_code={selected_country.value}
                            is_from_external={is_from_external}
                            setIsCfdPoiCompleted={setIsCfdPoiCompleted}
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
                        <IdvUploadComplete
                            is_from_external={is_from_external}
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
};

export default POISubmission;
