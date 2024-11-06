/* eslint-disable no-console */
import { useContext, useEffect } from 'react';
import { POIContext } from '@deriv/shared';
import { useKycAuthStatus } from '../../../../hooks';
import { submission_status_code } from '../proof-of-identity-utils';
import IdvDocumentSubmit from 'Components/poi/idv-document-submit';
import { observer } from '@deriv/stores';

const PoiService = observer(() => {
    const { submission_service, setSubmissionService, setSubmissionStatus, selected_country } = useContext(POIContext);

    const { kyc_auth_status, isLoading } = useKycAuthStatus(
        {
            country: selected_country,
        },
        true
    );

    const { identity } = kyc_auth_status;

    useEffect(() => {
        if (!isLoading && kyc_auth_status) {
            const { identity } = kyc_auth_status;
            const available_services = identity?.available_services;

            if (available_services) {
                setSubmissionService(available_services[0] as 'idv' | 'onfido' | 'manual');
            }
            setSubmissionStatus(submission_status_code.submitting);
        }
    }, [kyc_auth_status, isLoading, setSubmissionService, setSubmissionStatus]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    switch (submission_service) {
        case 'idv': {
            return <IdvDocumentSubmit supported_documents={identity?.supported_documents || []} />;
        }
        case 'onfido': {
            return <div>onfido component {selected_country}</div>;
        }
        case 'manual': {
            return <div>manual component</div>;
        }
        default: {
            return null;
        }
    }
});

export default PoiService;
