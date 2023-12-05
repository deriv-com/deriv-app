import { useQuery } from '@deriv/api';
import { useMemo } from 'react';

type TUseLandingCompanyDetailsPayload = Parameters<typeof useQuery<'landing_company_details'>>['1']['payload'];

/** A custom hook that returns the available landing companies of the user's country. */
const useLandingCompanyDetails = (payload: TUseLandingCompanyDetailsPayload) => {
    const { data, ...rest } = useQuery('landing_company_details', {
        payload,
        options: { enabled: Boolean(payload.landing_company_details) },
    });

    // Add additional information to the landing company response.
    const modified_landing_company_details = useMemo(() => {
        if (!data?.landing_company_details) return undefined;

        return { ...data.landing_company_details };
    }, [data?.landing_company_details]);

    return {
        /** The landing company response. */
        data: modified_landing_company_details,
        ...rest,
    };
};

export default useLandingCompanyDetails;
