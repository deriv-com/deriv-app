import { useContext, useEffect } from 'react';
import { POIContext } from '@deriv/shared';
import { useKycAuthStatus } from '../../../../hooks';

const PoiService = () => {
    const {
        submission_service,
        setSubmissionService,
        // submission_status,
        // setSubmissionStatus,
        selected_country,
        // setSelectedCountry,
    } = useContext(POIContext);

    const { kyc_auth_status, isLoading } = useKycAuthStatus({
        country: selected_country,
    });

    useEffect(() => {
        if (!isLoading && kyc_auth_status) {
            const { identity } = kyc_auth_status;
            const available_services = identity?.available_services;

            if (available_services) {
                setSubmissionService(available_services[0] as 'idv' | 'onfido' | 'manual');
            }
        }
    }, [kyc_auth_status, isLoading, setSubmissionService]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    // here we need to call useKycAuthStatus with the selected_country from poi context
    switch (submission_service) {
        case 'idv': {
            return <div>idv component</div>;
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
};

export default PoiService;
