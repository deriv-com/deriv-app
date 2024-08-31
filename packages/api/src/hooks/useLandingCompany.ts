import { useMemo } from 'react';
import useQuery from '../useQuery';
import useSettings from './useSettings';

/** A custom hook that returns the available landing companies of the user's country. */
const useLandingCompany = () => {
    const { data: settings_data } = useSettings();
    const { data, ...rest } = useQuery('landing_company', {
        payload: { landing_company: settings_data?.country_code || '' },
        options: { enabled: Boolean(settings_data?.country_code) },
    });

    // Add additional information to the landing company response.
    const modified_landing_company = useMemo(() => {
        if (!data?.landing_company) return;

        return { ...data.landing_company };
    }, [data?.landing_company]);

    return {
        /** The landing company response. */
        data: modified_landing_company,
        ...rest,
    };
};

export default useLandingCompany;
