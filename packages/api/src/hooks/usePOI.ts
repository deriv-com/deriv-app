import { useMemo } from 'react';
import useResidenceList from './useResidenceList';
import useGetAccountStatus from './useGetAccountStatus';
import useSettings from './useSettings';
import useAccountStatus from './useAccountStatus';

type TVerificationService = 'onfido' | 'idv' | 'manual';

/** A custom hook to get the user's identity verification status. */
const usePOI = () => {
    const { data: get_account_status_data } = useGetAccountStatus();
    const { data: account_status } = useAccountStatus();
    const { data: residence_list_data } = useResidenceList();
    const { data: get_settings_data } = useSettings();

    const previous_service = useMemo(() => {
        const latest_poi_attempt = get_account_status_data?.authentication?.attempts?.latest;
        return latest_poi_attempt?.service as TVerificationService;
    }, [get_account_status_data?.authentication?.attempts?.latest]);

    /**
     * @description Get the previous POI attempts details (if any)
     */
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

    /**
     * @description Get the next step based on a few check. Returns configuration for document validation as well
     */
    const next_poi = useMemo(() => {
        const user_country_code = get_settings_data?.citizen || get_settings_data?.country_code;
        const matching_residence_data = residence_list_data?.find(r => r.value === user_country_code);
        const is_idv_supported = matching_residence_data?.identity?.services?.idv?.is_country_supported;
        const is_onfido_supported = matching_residence_data?.identity?.services?.onfido?.documents_supported;
        const services = get_account_status_data?.authentication?.identity?.services;
        const idv_submission_left = services?.idv?.submissions_left ?? 0;
        const onfido_submission_left = services?.onfido?.submissions_left ?? 0;
        if (is_idv_supported && idv_submission_left && !account_status?.is_idv_disallowed) {
            return {
                service: 'idv',
                submission_left: idv_submission_left,
                document_supported: matching_residence_data?.identity?.services?.idv?.documents_supported,
            };
        } else if (is_onfido_supported && onfido_submission_left) {
            return {
                service: 'onfido',
                submission_left: onfido_submission_left,
                document_supported: matching_residence_data?.identity?.services?.onfido?.documents_supported,
            };
        }
        return {
            service: 'manual',
        };
    }, [
        account_status?.is_idv_disallowed,
        get_account_status_data?.authentication?.identity?.services,
        get_settings_data?.citizen,
        get_settings_data?.country_code,
        residence_list_data,
    ]);

    return {
        previous: previous_poi,
        next: next_poi,
    };
};

export default usePOI;
