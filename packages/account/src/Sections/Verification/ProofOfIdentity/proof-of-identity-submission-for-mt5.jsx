/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { WS } from '@deriv/shared';
import Unsupported from 'Components/poi/status/unsupported';
import OnfidoUpload from './onfido-sdk-view.jsx';
import { identity_status_codes, submission_status_code, service_code } from './proof-of-identity-utils';
import { IdvDocSubmitOnSignup } from '../../../Components/poi/poi-form-on-signup/idv-doc-submit-on-signup/idv-doc-submit-on-signup.jsx';
import { AutoHeightWrapper } from '@deriv/components';

const POISubmissionForMT5 = ({
    idv,
    is_from_external,
    is_idv_disallowed,
    onfido,
    onStateChange,
    refreshNotifications,
    citizen_data,
    has_idv_error,
    jurisdiction_selected_shortcode,
}) => {
    const [submission_status, setSubmissionStatus] = React.useState(); // submitting
    const [submission_service, setSubmissionService] = React.useState();
    React.useEffect(() => {
        if (citizen_data) {
            const { submissions_left: idv_submissions_left } = idv;
            const { submissions_left: onfido_submissions_left } = onfido;
            const is_idv_supported = citizen_data.identity.services.idv.is_country_supported;
            const is_onfido_supported = citizen_data.identity.services.onfido.is_country_supported;
            if (
                is_idv_supported &&
                Number(idv_submissions_left) > 0 &&
                !is_idv_disallowed &&
                jurisdiction_selected_shortcode !== 'vanuatu'
            ) {
                setSubmissionService(service_code.idv);
            } else if (onfido_submissions_left && is_onfido_supported) {
                setSubmissionService(service_code.onfido);
            } else {
                setSubmissionService(service_code.manual);
            }
            setSubmissionStatus(submission_status_code.submitting);
        }
    }, [citizen_data]);

    const handlePOIComplete = () => {
        if (onStateChange && typeof onStateChange === 'function') {
            onStateChange(identity_status_codes.pending);
        }
        WS.authorized.getAccountStatus().then(() => {
            refreshNotifications();
        });
    };
    const handleIdvSubmit = (values, { setSubmitting, setErrors }) => {
        setSubmitting(true);
        const { document_number, document_type } = values;
        const submit_data = {
            identity_verification_document_add: 1,
            document_number,
            document_type: document_type.id,
            issuing_country: citizen_data.value,
        };

        WS.send(submit_data).then(response => {
            setSubmitting(false);
            if (response.error) {
                setErrors({ error_message: response.error.message });
                return;
            }
            handlePOIComplete();
        });
    };

    if (submission_status === submission_status_code.submitting) {
        switch (submission_service) {
            case service_code.idv:
                return (
                    <IdvDocSubmitOnSignup
                        citizen_data={citizen_data}
                        onNext={handleIdvSubmit}
                        has_idv_error={has_idv_error}
                    />
                );
            case service_code.onfido: {
                const country_code = citizen_data.value;
                const doc_obj = citizen_data.identity.services.onfido.documents_supported;
                const documents_supported = Object.keys(doc_obj).map(d => doc_obj[d].display_name);

                return (
                    <AutoHeightWrapper default_height={620} height_offset={50}>
                        {({ setRef, height }) => (
                            <div ref={setRef} style={{ height }}>
                                <OnfidoUpload
                                    country_code={country_code}
                                    documents_supported={documents_supported}
                                    handleViewComplete={handlePOIComplete}
                                    height={height}
                                    is_from_external={is_from_external}
                                    refreshNotifications={refreshNotifications}
                                />
                            </div>
                        )}
                    </AutoHeightWrapper>
                );
            }
            case service_code.manual:
                return <Unsupported is_mt5 handlePOIforMT5Complete={handlePOIComplete} />;
            default:
                return null;
        }
    } else {
        return null;
    }
};

export default POISubmissionForMT5;
