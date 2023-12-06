import { useMemo } from 'react';
import { useQuery } from '@deriv/api';
import { TSocketResponseData } from '@deriv/api/types';

const usePOI = () => {
    const { data: get_account_status_data, ...rest_of_account_status } = useQuery('get_account_status');
    const { data: get_account_settings_data, ...rest_of_get_settings } = useQuery('get_settings');
    const { data: residence_list_data, ...rest_of_residence_list } = useQuery('residence_list');

    const { get_account_status } = get_account_status_data as DeepRequired<TSocketResponseData<'get_account_status'>>;

    const { get_settings } = get_account_settings_data as DeepRequired<TSocketResponseData<'get_settings'>>;
    const { residence_list } = residence_list_data as DeepRequired<TSocketResponseData<'residence_list'>>;

    const { status, authentication, risk_classification } = get_account_status;
    const { citizen, country_code } = get_settings;
    const { identity, attempts } = authentication;

    const is_idv_disallowed = status.includes('idv_disallowed');

    const previous_service = useMemo(() => {
        const latest_poi_attempt = attempts?.latest;
        return latest_poi_attempt?.service;
    }, [attempts?.latest]);

    const previous_poi = useMemo(() => {
        if (!previous_service) {
            return null;
        }

        const services = identity?.services;
        if (services?.manual) {
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
    }, [previous_service, identity?.services]);

    const current_poi = useMemo(() => {
        const user_country_code = citizen ?? country_code;
        const matching_residence_data = residence_list?.find(r => r.value === user_country_code);
        const is_idv_supported = matching_residence_data?.identity?.services?.idv?.is_country_supported;
        const is_onfido_supported = matching_residence_data?.identity?.services?.onfido?.is_country_supported;
        const services = identity?.services;
        const idv_submission_left = services?.idv?.submissions_left ?? 0;
        const onfido_submission_left = services?.onfido?.submissions_left ?? 0;

        if (is_idv_supported && idv_submission_left && !is_idv_disallowed && risk_classification !== 'high') {
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
    }, [citizen, country_code, identity?.services, is_idv_disallowed, residence_list, risk_classification]);

    const modified_verification_data = useMemo(() => {
        if (!identity) return;

        return {
            previous: previous_poi,
            current: current_poi,
            status: identity?.status,
        };
    }, [current_poi, identity, previous_poi]);

    return {
        data: modified_verification_data,
        isSuccess:
            rest_of_account_status.isSuccess && rest_of_get_settings.isSuccess && rest_of_residence_list.isSuccess,
        isLoading:
            rest_of_account_status.isLoading || rest_of_get_settings.isLoading || rest_of_residence_list.isLoading,
        isError: rest_of_account_status.isError || rest_of_get_settings.isError || rest_of_residence_list.isError,
    };
};

export default usePOI;
