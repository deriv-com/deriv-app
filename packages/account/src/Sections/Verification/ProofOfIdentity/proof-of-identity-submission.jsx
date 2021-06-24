import React from 'react';
import { WS } from '@deriv/shared';
import CountrySelector from 'Components/poi-country-selector';
import IdvDocumentSubmit from 'Components/poi-idv-document-submit';
import IdvUploadComplete from 'Components/poi-idv-upload-complete';
import Unsupported from 'Components/poi-unsupported';
import UploadComplete from 'Components/poi-upload-complete';
import OnfidoUpload from './onfido-sdk-view.jsx';
import { submission_status_code, service_code } from './proof-of-identity-utils';

const POISelector = ({
    residence_list,
    height,
    is_description_enabled,
    has_require_submission,
    identity_last_attempt,
    idv,
    onfido_service_token,
    onfido,
    needs_poa,
    setAPIError,
    manual,
    refreshNotifications,
    redirect_button,
}) => {
    const [submission_status, setSubmissionStatus] = React.useState(); // selecting, submitting, complete
    const [submission_service, setSubmissionService] = React.useState();
    const [selected_country, setSelectedCountry] = React.useState();

    const handleSelectionNext = () => {
        if (selected_country) {
            const { submissions_left: idv_submissions_left } = idv;
            const { submissions_left: onfido_submissions_left } = onfido;
            const is_idv_supported = selected_country.identity.services.idv.is_country_supported;
            const is_onfido_supported = selected_country.identity.services.onfido.is_country_supported;

            if (is_idv_supported && idv_submissions_left) {
                setSubmissionService('idv');
            } else if (is_onfido_supported && onfido_submissions_left) {
                setSubmissionService('onfido');
            } else {
                setSubmissionService('manual');
            }
            setSubmissionStatus(submission_status_code.submitting);
        }
    };

    const handleViewComplete = () => {
        setSubmissionStatus(submission_status_code.complete);

        WS.authorized.getAccountStatus().then(() => {
            refreshNotifications();
        });
    };

    const handleBack = () => {
        setSubmissionStatus(submission_status_code.selecting);
    };

    React.useEffect(() => {
        if (has_require_submission) {
            switch (identity_last_attempt.service) {
                case service_code.idv:
                    setSubmissionStatus(submission_status_code.selecting);
                    break;
                case service_code.onfido:
                    setSelectedCountry(identity_last_attempt.country);
                    setSubmissionStatus(submission_status_code.submitting);
                    break;
                case service_code.manual:
                    setSelectedCountry(identity_last_attempt.country);
                    setSubmissionStatus(submission_status_code.submitting);
                    break;
                default:
                    break;
            }
        } else {
            setSubmissionStatus(submission_status_code.selecting);
        }
    }, []);

    switch (submission_status) {
        case submission_status_code.selecting:
            return (
                <CountrySelector
                    residence_list={residence_list}
                    selected_country={selected_country}
                    setSelectedCountry={setSelectedCountry}
                    handleSelectionNext={handleSelectionNext}
                />
            );
        case submission_status_code.submitting: {
            switch (submission_service) {
                case service_code.idv:
                    return (
                        <IdvDocumentSubmit
                            idv={idv}
                            handleViewComplete={handleViewComplete}
                            handleBack={handleBack}
                            selected_country={selected_country}
                        />
                    );
                case service_code.onfido:
                    return (
                        <OnfidoUpload
                            height={height}
                            is_description_enabled={is_description_enabled}
                            onfido_service_token={onfido_service_token}
                            onfido={onfido}
                            residence_list={residence_list}
                            setAPIError={setAPIError}
                            refreshNotifications={refreshNotifications}
                            handleViewComplete={handleViewComplete}
                            handleBack={handleBack}
                        />
                    );
                case service_code.manual:
                    return <Unsupported manual={manual} handleViewComplete={handleViewComplete} />;
                default:
                    return null;
            }
        }
        case submission_status_code.complete: {
            switch (submission_service) {
                case service_code.idv:
                    return <IdvUploadComplete needs_poa={needs_poa} redirect_button={redirect_button} />;
                case service_code.onfido:
                    return <UploadComplete needs_poa={needs_poa} redirect_button={redirect_button} />;
                case service_code.manual:
                    // TODO: add manual upload complete
                    return <UploadComplete needs_poa={needs_poa} redirect_button={redirect_button} />;
                default:
                    return null;
            }
        }
        default:
            return null;
    }
};

export default POISelector;
