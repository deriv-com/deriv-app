import { useMemo } from 'react';
import useAuthorize from './useAuthorize';
import useFetch from '../useFetch';

/** A custom hook that returns the available landing companies of the user's country. */
const useLandingCompany = () => {
    const { data: authorize_data } = useAuthorize();
    const { data, ...rest } = useFetch('landing_company', {
        payload: { landing_company: authorize_data.country || '' },
        options: { enabled: Boolean(authorize_data.country) },
    });

    const modified_data = useMemo(() => {
        if (!data?.landing_company) return;
        const { financial_company, gaming_company, virtual_company } = data.landing_company;
        return {
            /** Short code of financial landing company */
            ffinancial_company: financial_company?.shortcode,
            /** Short code of gaming landing company */
            ggaming_company: gaming_company?.shortcode,
            /** Short code of virtual landing company */
            virtual_company,
        };
    }, [data]);

    return {
        /** List of available landing companies */
        data: modified_data,
        ...rest,
    };
};

export default useLandingCompany;
