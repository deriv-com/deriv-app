import { useMemo } from 'react';
import useAccountTypes from './useAccountTypes';
import useLandingCompany from './useLandingCompany';

/** A custom hook to get available accounts for every landing companies */
const useAvailableAccounts = () => {
    const { data: landing_company_data } = useLandingCompany();
    const { data: available_financial_accounts } = useAccountTypes(landing_company_data?.financial_company_shortcode);
    const { data: available_virtual_accounts } = useAccountTypes(landing_company_data?.virtual_company_shortcode);

    // memoize the available financial accounts
    const financial_accounts = useMemo(() => {
        if (!available_financial_accounts) return;

        return {
            ...available_financial_accounts,
        };
    }, [available_financial_accounts]);

    // memoize the available virtual accounts
    const virtual_accounts = useMemo(() => {
        if (!available_virtual_accounts) return;

        return {
            ...available_virtual_accounts,
        };
    }, [available_virtual_accounts]);

    // memoize the combined available accounts
    const available_accounts = useMemo(() => {
        if (!available_financial_accounts && !available_virtual_accounts) return;

        return {
            /** List of available financial accounts */
            financial_accounts,
            /** List of available virtual accounts */
            virtual_accounts,
        };
    }, [available_financial_accounts, available_virtual_accounts]);

    return {
        /** List of available accounts */
        data: available_accounts,
    };
};

export default useAvailableAccounts;
