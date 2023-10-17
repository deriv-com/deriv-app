import { useMemo } from 'react';
import useResidenceList from './useResidenceList';
import useGetAccountStatus from './useGetAccountStatus';
import useSettings from './useSettings';

type TNextPOISubmission = {
    service: 'onfido' | 'idv' | 'manual';
    submission_left: number;
    document_supported: Record<string, { display_name: string; format: string }>;
};

type TVerificationService = 'onfido' | 'idv' | 'manual';

/** A custom hook to get the user's identity verification status. */
const usePOI = () => {
    const { data: get_account_status_data } = useGetAccountStatus();
    const { data: residence_list_data } = useResidenceList();
    const { data: get_settings_data } = useSettings();

    const previous_service = useMemo(() => {
        const latest_poi_attempt = get_account_status_data?.authentication?.attempts?.latest;
        return latest_poi_attempt?.service as TVerificationService;
    }, [get_account_status_data?.authentication?.attempts?.latest]);

    const previous_poi = useMemo(() => {
        if (!previous_service) {
            return null;
        }

        const services = get_account_status_data?.authentication?.identity?.services;
        if (services && services.manual) {
            return {
                service: previous_service,
                status: services.manual.status,
            };
        }

        const current_service = services?.[previous_service as 'idv' | 'onfido'];
        return {
            service: previous_service,
            status: current_service?.status,
            reported_properties: current_service?.reported_properties,
            last_rejected: current_service?.last_rejected,
            submissions_left: current_service?.submissions_left || 0,
        };
    }, [get_account_status_data?.authentication?.identity?.services, previous_service]);

    const next_poi = useMemo(() => {
        const user_country_code = get_settings_data?.citizen || get_settings_data?.country_code;
        const matching_residence_data = residence_list_data?.find(r => r.value === user_country_code);
    }, [get_settings_data?.citizen, get_settings_data?.country_code, residence_list_data]);

    return {
        previous: previous_poi,
        next: next_poi,
    };
};

export default usePOI;
