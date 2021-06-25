import PropTypes from 'prop-types';
import React from 'react';
import UploadComplete from 'Components/poi-upload-complete';
import Expired from 'Components/poi-expired';
import Verified from 'Components/poi-verified';
import RejectedReasons from 'Components/poi-rejected-reasons';
import Limited from 'Components/poi-limited';
import { identity_status_codes } from './proof-of-identity-utils';

const Onfido = ({ handleRequireSubmission, onfido, redirect_button, verification_status }) => {
    const { status, submissions_left, last_rejected: rejected_reasons } = onfido;
    const { needs_poa } = verification_status;

    switch (status) {
        case identity_status_codes.pending:
            return <UploadComplete needs_poa={needs_poa} redirect_button={redirect_button} />;
        case identity_status_codes.rejected:
        case identity_status_codes.suspected:
            if (Number(submissions_left) === 0) return <Limited handleRequireSubmission={handleRequireSubmission} />;
            return (
                <RejectedReasons
                    rejected_reasons={rejected_reasons}
                    handleRequireSubmission={handleRequireSubmission}
                />
            );
        case identity_status_codes.verified:
            return <Verified needs_poa={needs_poa} redirect_button={redirect_button} />;
        case identity_status_codes.expired:
            return <Expired redirect_button={redirect_button} handleRequireSubmission={handleRequireSubmission} />;
        default:
            return null;
    }
};

Onfido.propTypes = {
    country_code: PropTypes.string,
    documents_supported: PropTypes.array,
    handleComplete: PropTypes.func,
    has_poa: PropTypes.bool,
    height: PropTypes.number,
    is_description_enabled: PropTypes.bool,
    onfido_service_token: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    onfido_status: PropTypes.oneOf(Object.keys(identity_status_codes)),
};

export default Onfido;
