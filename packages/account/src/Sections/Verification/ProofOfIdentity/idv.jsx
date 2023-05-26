import React from 'react';
import { formatIDVError } from '@deriv/shared';
import IdvExpired from 'Components/poi/idv-status/idv-expired';
import IdvFailed from 'Components/poi/idv-status/idv-failed';
import IdvLimited from 'Components/poi/idv-status/idv-limited';
import IdvSubmitComplete from 'Components/poi/idv-status/idv-submit-complete';
import IdvVerified from 'Components/poi/idv-status/idv-verified';
import { identity_status_codes } from './proof-of-identity-utils';

const Idv = ({ handleRequireSubmission, idv, is_from_external, needs_poa, redirect_button }) => {
    const { status, submissions_left, last_rejected } = idv;

    // const idv_mismatch_statuses = {
    //     name_dob: 'POI_NAME_DOB_MISMATCH',
    //     name: 'POI_NAME_MISMATCH',
    //     dob: 'POI_DOB_MISMATCH',
    //     expired: 'POI_EXPIRED',
    //     failed: 'POI_FAILED',
    // };
    // const status = 'rejected';

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
            if (Number(submissions_left) < 1) return <IdvLimited handleRequireSubmission={handleRequireSubmission} />;
            return (
                <IdvFailed
                    mismatch_status={
                        formatIDVError(last_rejected)
                        // 'POI_EXPIRED'
                    }
                />
            );
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
