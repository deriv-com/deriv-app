import { useCallback, useMemo } from 'react';
import useQuery from '../useQuery';

/** A custom hook to get the country config information from `residence_list` endpoint. */
const useCountryConfig = () => {
    const { data: residence_list_data, ...rest } = useQuery('residence_list');

    // Add additional information to the country config.
    const modified_residence_list = useMemo(
        () =>
            residence_list_data?.residence_list?.map(country_config => {
                return {
                    ...country_config,
                    /** Determine if the country is disabled */
                    is_disabled: country_config.disabled !== undefined,
                    /** 2-letter country code */
                    code: `${country_config.value}`.toUpperCase(),
                    /** Country name */
                    name: `${country_config.text}`,
                    /** Determine if the IDV service is supported for the country */
                    is_idv_supported: country_config.identity?.services?.idv?.is_country_supported === 1,
                    /** Determine if the Onfido service is supported for the country */
                    is_onfido_supported: country_config.identity?.services?.onfido?.is_country_supported === 1,
                };
            }),
        [residence_list_data?.residence_list]
    );

    // Transform the country config array into a record object.
    const transformed_residence_list = useMemo(() => {
        return modified_residence_list?.reduce<Record<string, typeof modified_residence_list[number]>>(
            (previous, current) => ({ ...previous, [current.code]: current }),
            {}
        );
    }, [modified_residence_list]);

    const getConfig = useCallback(
        (currency: string) => transformed_residence_list?.[currency as string],
        [transformed_residence_list]
    );

    return {
        /** Available countries and their information */
        data: transformed_residence_list,
        /** Returns the country config object for the given country code */
        getConfig,
        ...rest,
    };
};

export default useCountryConfig;
