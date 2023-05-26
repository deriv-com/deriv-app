import React from 'react';
import { formatIDVError } from '@deriv/shared';
// import IdvExpired from 'Components/poi/idv-status/idv-expired';
import IdvFailed from 'Components/poi/idv-status/idv-failed';
import IdvLimited from 'Components/poi/idv-status/idv-limited';
import IdvSubmitComplete from 'Components/poi/idv-status/idv-submit-complete';
import IdvVerified from 'Components/poi/idv-status/idv-verified';
import { identity_status_codes } from './proof-of-identity-utils';

const Idv = ({
    account_settings,
    getChangeableFields,
    handleRequireSubmission,
    idv,
    is_from_external,
    needs_poa,
    redirect_button,
    residence_list,
}) => {
    const { status, submissions_left, last_rejected } = idv;

    switch (status) {
        case identity_status_codes.pending:
            return (
                <IdvSubmitComplete
                    is_from_external={is_from_external}
                    mismatch_status={formatIDVError(last_rejected)}
                    needs_poa={needs_poa}
                    redirect_button={redirect_button}
                />
            );
        case identity_status_codes.rejected:
        case identity_status_codes.suspected:
        case identity_status_codes.expired:
            if (Number(submissions_left) < 1) return <IdvLimited handleRequireSubmission={handleRequireSubmission} />;
            return (
                <IdvFailed
                    account_settings={account_settings}
                    getChangeableFields={getChangeableFields}
                    mismatch_status={formatIDVError(last_rejected, status)}
                    residence_list={residence_list}
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
        default:
            return null;
    }
};

export default Idv;
