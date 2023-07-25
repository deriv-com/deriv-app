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

    return {
        data: data?.landing_company || {},
        ...rest,
    };
};

export default useLandingCompany;
