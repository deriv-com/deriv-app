import React from 'react';
import { formatOnfidoError } from '@deriv/shared';
import UploadComplete from '../../../Components/poi/status/upload-complete';
import Verified from '../../../Components/poi/status/verified';
import RejectedReasons from '../../../Components/poi/status/rejected-reasons';
import Unsupported from '../../../Components/poi/status/unsupported';
import { identity_status_codes, service_code } from './proof-of-identity-utils';

const Onfido = ({
    handleRequireSubmission,
    is_from_external,
    needs_poa,
    onfido,
    redirect_button,
    manual,
    country_code,
    handleViewComplete,
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
        case identity_status_codes.expired: {
            const submission_errors = formatOnfidoError(status, rejected_reasons);
            if (Number(submissions_left) < 1) {
                return (
                    <Unsupported
                        manual={manual}
                        is_from_external={is_from_external}
                        country_code={country_code}
                        handleViewComplete={handleViewComplete}
                        onfido={onfido}
                    />
                );
            }
            return (
                <RejectedReasons
                    rejected_reasons={submission_errors}
                    handleRequireSubmission={handleRequireSubmission}
                />
            );
        }
        case identity_status_codes.verified:
            return (
                <Verified
                    is_from_external={is_from_external}
                    needs_poa={needs_poa}
                    redirect_button={redirect_button}
                    service={service_code.onfido}
                />
            );
        default:
            return null;
    }
};

export default Onfido;
