import React from 'react';
import { POIContext } from '@deriv/shared';
import { submission_status_code } from '../proof-of-identity-utils';
import CountrySelector from 'Components/poi/poi-country-selector';
// import IdvDocumentSubmit from 'Components/poi/idv-document-submit';
import IdvSubmitComplete from 'Components/poi/idv-status/idv-submit-complete';
import { useKycAuthStatus } from '../../../../hooks';
import PoiService from './poi-service';
// import OnfidoSdkViewContainer from '../onfido-sdk-view-container';
// import Unsupported from 'Components/poi/status/unsupported';

// these are the components that will be rendered based on the identity status:

// these are the components that will be rendered based on the identity status:
// 1. CountrySelector
// 2. IdvDocumentSubmit
// 3. IdvFailed
// 4. IdvSubmitComplete
// 5. OnfidoSdkViewContainer
const POISubmission = () => {
    const {
        submission_service,
        setSubmissionService,
        submission_status,
        setSubmissionStatus,
        selected_country,
        setSelectedCountry,
    } = React.useContext(POIContext);

    // const { kyc_auth_status } = useKycAuthStatus({
    //     country: selected_country,
    // // });

    // const identity = kyc_auth_status?.identity;

    const handleSelectionNext = () => {
        if (selected_country === '') {
            if (identity?.available_services) {
                setSubmissionService(identity.available_services[0] as 'idv' | 'onfido' | 'manual');
            } else {
                setSubmissionService(submission_service);
            }
            setSubmissionStatus(submission_status_code.submitting);
        }
    };

    // TODO: add useEffect to makesure service code and status is updated when selected country changes

    // TODO: we also need sth like setIdentityService to handle the service code and status
    // when we show other screens rather than select country component
    if (submission_status === submission_status_code.selecting)
        return <CountrySelector is_from_external={false} handleSelectionNext={handleSelectionNext} />;

    return <PoiService />;
};

export default POISubmission;
