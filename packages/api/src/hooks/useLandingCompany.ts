import { useMemo } from 'react';
import useFetch from '../useFetch';
import useSettings from './useSettings';

/** A custom hook that returns the available landing companies of the user's country. */
const useLandingCompany = () => {
    const { data: settings_data } = useSettings();
    const { data, ...rest } = useFetch('landing_company', {
        payload: { landing_company: settings_data?.country_code || '' },
        options: { enabled: Boolean(settings_data?.country_code) },
    });

    const modified_data = useMemo(() => {
        if (!data?.landing_company) return;
        const { financial_company, virtual_company } = data.landing_company;
        return {
            ...data.landing_company,
            /** Short code of financial landing company */
            financial_company_shortcode: financial_company?.shortcode,
            /** Short code of virtual landing company */
            virtual_company_shortcode: virtual_company,
        };
    }, [data?.landing_company]);

    return {
        /** List of available landing companies */
        data: modified_data,
        ...rest,
    };
};

export default useLandingCompany;
