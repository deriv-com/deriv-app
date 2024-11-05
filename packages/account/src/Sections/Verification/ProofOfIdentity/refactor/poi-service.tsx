import { useContext } from 'react';
import { POIContext } from '@deriv/shared';

const PoiService = () => {
    const {
        submission_service,
        setSubmissionService,
        submission_status,
        setSubmissionStatus,
        selected_country,
        setSelectedCountry,
    } = useContext(POIContext);

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
