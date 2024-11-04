import React from 'react';
import { POIContext } from '@deriv/shared';
import { submission_status_code } from '../proof-of-identity-utils';
import CountrySelector from 'Components/poi/poi-country-selector';
import IdvDocumentSubmit from 'Components/poi/idv-document-submit';
import IdvSubmitComplete from 'Components/poi/idv-status/idv-submit-complete';

// these are the components that will be rendered based on the identity status:


// these are the components that will be rendered based on the identity status:
// 1. CountrySelector
// 2. IdvDocumentSubmit
// 3. IdvFailed
// 4. IdvSubmitComplete
// 5. OnfidoSdkViewContainer
const POISubmission = ({
    identity,
}: {
    identity: {
        /**
         * Available services for the next POI attempt.
         */
        available_services?: string[];
        /**
         * Details on the rejected POI attempt.
         */
        last_rejected?: {
            /**
             * Document type of the rejected POI attempt (IDV only).
             */
            document_type?: null | string;
            /**
             * Reason(s) for the rejected POI attempt.
             */
            rejected_reasons?: string[];
            /**
             * Indicate if the verification report was returned by the provider (IDV only).
             */
            report_available?: 0 | 1;
        };
        /**
         * Service used for the current POI status.
         */
        service?: 'none' | 'idv' | 'onfido' | 'manual';
        /**
         * Current POI status.
         */
        status?: 'none' | 'pending' | 'rejected' | 'verified' | 'expired' | 'suspected';
        /**
         * Supported documents per service.
         */
        supported_documents?: {
            idv?: {
                [k: string]: {
                    additional?: {
                        display_name?: string;
                        format?: string;
                        [k: string]: unknown;
                    };
                    display_name?: string;
                    format?: string;
                    [k: string]: unknown;
                };
            };
            onfido?: {
                [k: string]: {
                    display_name?: string;
                    [k: string]: unknown;
                };
            };
            [k: string]: unknown;
        };
    };
}) => {
    const {
        submission_service,
        setSubmissionService,
        submission_status,
        setSubmissionStatus,
        selected_country,
        setSelectedCountry,
    } = React.useContext(POIContext);

    // console.log('identity', identity);

    const handleSelectionNext = () => {
        if (Object.keys(selected_country).length) {
            if (identity.available_services) {
                setSubmissionService(identity.available_services[0] as 'idv' | 'onfido' | 'manual');
            } else {
                setSubmissionService(submission_service);
            }
            setSubmissionStatus(submission_status_code.submitting);
        }
    };

    switch (submission_status) {
        case submission_status_code.selecting: {
            return <CountrySelector is_from_external={false} handleSelectionNext={handleSelectionNext} />;
        }
        case submission_status_code.submitting: {
            return (
                <IdvDocumentSubmit
                    handleBack={() => setSubmissionStatus(submission_status_code.selecting)}
                    handleViewComplete={() => setSubmissionStatus(submission_status_code.complete)}
                    selected_country={selected_country}
                    getChangeableFields={() => []}
                />
            );
        }
        case submission_status_code.complete: {
            return <IdvSubmitComplete />;
        }
        default: {
            return null;
        }
    }
};

export default POISubmission;
