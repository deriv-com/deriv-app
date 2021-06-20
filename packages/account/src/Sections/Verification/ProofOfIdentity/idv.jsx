import React from 'react';
import IdvUploadComplete from 'Components/poi-idv-upload-complete';
import Expired from 'Components/poi-expired';
import Verified from 'Components/poi-verified';
import RejectedReasons from 'Components/poi-rejected-reasons';
import IDVNoSubmissions from 'Components/poi-limited';
import { identity_status_codes } from './proof-of-identity-utils';

const Idv = ({ idv, handleRequireSubmission, verification_status, redirect_button }) => {
    const { status, submissions_left, last_rejected: rejected_reasons } = idv;
    const { needs_poa } = verification_status;

    switch (status) {
        case identity_status_codes.pending:
            return <IdvUploadComplete needs_poa={needs_poa} />;
        case identity_status_codes.rejected:
        case identity_status_codes.suspected:
            // TODO: use IDV component
            if (!submissions_left) return <IDVNoSubmissions handleRequireSubmission={handleRequireSubmission} />;

            // TODO: use IDV component
            return (
                <RejectedReasons
                    rejected_reasons={rejected_reasons}
                    handleRequireSubmission={handleRequireSubmission}
                />
            );
        case identity_status_codes.verified:
            // TODO: use IDV component
            return <Verified needs_poa={needs_poa} redirect_button={redirect_button} />;
        case identity_status_codes.expired:
            // TODO: use IDV component
            return <Expired redirect_button={redirect_button} handleRequireSubmission={handleRequireSubmission} />;
        default:
            return null;
    }
};

export default Idv;
