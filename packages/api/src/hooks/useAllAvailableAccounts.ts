import { useMemo } from 'react';
import useAccountTypes from './useAccountTypes';
import useLandingCompany from './useLandingCompany';

/** A custom hook to get all available accounts that user can have. */
const useAllAvailableAccounts = () => {
    const { data: landing_company_data } = useLandingCompany();
    const { data: account_types_data, ...rest } = useAccountTypes(landing_company_data?.financial_company?.shortcode);

    // Add additional information to the account types response.
    const modified_account_types_data = useMemo(() => {
        if (!account_types_data) return;

        return { ...account_types_data };
    }, [account_types_data]);

    return {
        /** The account types response. */
        data: modified_account_types_data,
        ...rest,
    };
};

export default useAllAvailableAccounts;
