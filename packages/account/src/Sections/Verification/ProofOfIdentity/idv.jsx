import IdvExpired from 'Components/poi/idv-status/idv-expired';
import IdvNoSubmissions from 'Components/poi/idv-status/idv-limited';
import IdvRejected from 'Components/poi/idv-status/idv-rejected';
import IdvSubmitComplete from 'Components/poi/idv-status/idv-submit-complete';
import IdvVerified from 'Components/poi/idv-status/idv-verified';
import React from 'react';
import { identity_status_codes } from './proof-of-identity-utils';

const Idv = ({ handleRequireSubmission, idv, is_from_external, needs_poa, redirect_button }) => {
    const { status, submissions_left } = idv;

    switch (status) {
        case identity_status_codes.pending:
            return (
                <IdvSubmitComplete
                    is_from_external={is_from_external}
                    needs_poa={needs_poa}
                    redirect_button={redirect_button}
                />
            );
        case identity_status_codes.rejected:
        case identity_status_codes.suspected:
            if (Number(submissions_left) < 1)
                return <IdvNoSubmissions handleRequireSubmission={handleRequireSubmission} />;
            return <IdvRejected handleRequireSubmission={handleRequireSubmission} />;
        case identity_status_codes.verified:
            return (
                <IdvVerified
                    is_from_external={is_from_external}
                    needs_poa={needs_poa}
                    redirect_button={redirect_button}
                />
            );
        case identity_status_codes.expired:
            return <IdvExpired redirect_button={redirect_button} handleRequireSubmission={handleRequireSubmission} />;
        default:
            return null;
    }
};

export default Idv;
