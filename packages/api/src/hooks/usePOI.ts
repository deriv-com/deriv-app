import { useMemo } from 'react';
import useAuthentication from './useAuthentication';
import useResidenceList from './useResidenceList';
import useSettings from './useSettings';

/** A custom hook to get the proof of identity verification info of the current user. */
const usePOI = () => {
    const { data: authentication_data, isSuccess: isAuthenticationSuccess, ...rest } = useAuthentication();
    const { data: residence_list_data, isSuccess: isResidenceListSuccess } = useResidenceList();
    const { data: get_settings_data, isSuccess: isGetSettingsSuccess } = useSettings();

    const previous_service = useMemo(() => {
        const latest_poi_attempt = authentication_data?.attempts?.latest;
        return latest_poi_attempt?.service;
    }, [authentication_data?.attempts?.latest]);

    /**
     * @description Get the previous POI attempts details (if any)
     */
    const previous_poi = useMemo(() => {
        if (!previous_service) {
            return null;
        }

        const services = authentication_data?.identity?.services;
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
    }, [previous_service, authentication_data?.identity?.services]);

    /**
     * @description Get the current step based on a few checks. Returns configuration for document validation as well.
     */
    const current_poi = useMemo(() => {
        const user_country_code = get_settings_data?.citizen || get_settings_data?.country_code;
        const matching_residence_data = residence_list_data?.find(r => r.value === user_country_code);
        const is_idv_supported = matching_residence_data?.identity?.services?.idv?.is_country_supported;
        const is_onfido_supported = matching_residence_data?.identity?.services?.onfido?.is_country_supported;
        const services = authentication_data?.identity?.services;
        const idv_submission_left = services?.idv?.submissions_left ?? 0;
        const onfido_submission_left = services?.onfido?.submissions_left ?? 0;
        if (is_idv_supported && idv_submission_left && !authentication_data?.is_idv_disallowed) {
            return {
                country_code: user_country_code,
                service: 'idv',
                status: services?.idv?.status,
                submission_left: idv_submission_left,
                document_supported: matching_residence_data?.identity?.services?.idv?.documents_supported,
            };
        } else if (is_onfido_supported && onfido_submission_left) {
            return {
                country_code: user_country_code,
                service: 'onfido',
                status: services?.onfido?.status,
                submission_left: onfido_submission_left,
                document_supported: matching_residence_data?.identity?.services?.onfido?.documents_supported,
            };
        }
        return {
            country_code: user_country_code,
            service: 'manual',
            status: services?.manual?.status,
        };
    }, [
        get_settings_data?.citizen,
        get_settings_data?.country_code,
        residence_list_data,
        authentication_data?.identity?.services,
        authentication_data?.is_idv_disallowed,
    ]);

    const modified_verification_data = useMemo(() => {
        if (!authentication_data) return;

        return {
            ...authentication_data?.identity,
            previous: previous_poi,
            current: current_poi,
            is_pending: authentication_data?.identity?.status === 'pending',
            is_rejected: authentication_data?.identity?.status === 'rejected',
            is_expired: authentication_data?.identity?.status === 'expired',
            is_suspected: authentication_data?.identity?.status === 'suspected',
            is_verified: authentication_data?.identity?.status === 'verified',
        };
    }, [authentication_data, current_poi, previous_poi]);

    return {
        data: modified_verification_data,
        isSuccess: isAuthenticationSuccess && isGetSettingsSuccess && isResidenceListSuccess,
        ...rest,
    };
};

export default usePOI;
