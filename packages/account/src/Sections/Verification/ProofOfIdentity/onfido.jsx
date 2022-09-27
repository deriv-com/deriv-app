import React from 'react';
import UploadComplete from 'Components/poi/status/upload-complete';
import Expired from 'Components/poi/status/expired';
import Verified from 'Components/poi/status/verified';
import RejectedReasons from 'Components/poi/status/rejected-reasons';
import Unsupported from 'Components/poi/status/unsupported';
import { identity_status_codes } from './proof-of-identity-utils';

const Onfido = ({
    handleRequireSubmission,
    is_from_external,
    needs_poa,
    onfido,
    redirect_button,
    manual,
    setIsCfdPoiCompleted,
}) => {
    const { status, submissions_left, last_rejected: rejected_reasons } = onfido;

    switch (status) {
        case identity_status_codes.pending:
            return (
                <UploadComplete
                    is_from_external={is_from_external}
                    needs_poa={needs_poa}
                    redirect_button={redirect_button}
                />
            );
        case identity_status_codes.rejected:
        case identity_status_codes.suspected:
            if (Number(submissions_left) < 1) {
                return (
                    <Unsupported
                        manual={manual}
                        is_from_external={is_from_external}
                        setIsCfdPoiCompleted={setIsCfdPoiCompleted}
                    />
                );
            }
            return (
                <RejectedReasons
                    rejected_reasons={rejected_reasons}
                    handleRequireSubmission={handleRequireSubmission}
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
        default:
            return null;
    }
};

export default Onfido;
