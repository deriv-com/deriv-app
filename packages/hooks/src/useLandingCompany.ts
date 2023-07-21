import React from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

/** A custom hook to get the list of active symbols. */
const useLandingCompany = () => {
    const { client } = useStore();
    const { residence } = client;

    const { data, ...rest } = useFetch('landing_company', {
        payload: { landing_company: residence },
    });

    const landing_company = React.useMemo(
        () => ({
            ...data?.landing_company,
        }),
        [data?.landing_company, residence]
    );

    return {
        /** List of active symbols. */
        data: landing_company,
        ...rest,
    };
};

export default useLandingCompany;
