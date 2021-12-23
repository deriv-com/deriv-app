import React from 'react';
import Verified from 'Components/poi-verified';
import Limited from 'Components/poi-limited';
import Expired from 'Components/poi-expired';
import UploadComplete from 'Components/poi-upload-complete';
import Unsupported from 'Components/poi-unsupported';
import { identity_status_codes } from './proof-of-identity-utils';

const Manual = ({ manual, is_from_external, needs_poa, redirect_button, handleRequireSubmission }) => {
    switch (manual.status) {
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
                <Verified is_from_external={is_from_external} needs_poa={needs_poa} redirect_button={redirect_button} />
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
            return <Unsupported />;
    }
};

export default Manual;
