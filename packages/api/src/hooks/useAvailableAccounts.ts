import { useMemo } from 'react';
import useAccountTypes from './useAccountTypes';
import useLandingCompany from './useLandingCompany';

/** A custom hook to get available accounts for every landing companies */
const useAvailableAccounts = () => {
    const { data: landing_company_data } = useLandingCompany();
    const { data: financial_accounts } = useAccountTypes(landing_company_data?.financial_company_shortcode);
    const { data: gaming_accounts } = useAccountTypes(landing_company_data?.gaming_company_shortcode);
    const { data: virtual_accounts } = useAccountTypes(landing_company_data?.virtual_company_shortcode);

    const available_accounts = useMemo(() => {
        if (!financial_accounts && !gaming_accounts && !virtual_accounts) return;

        return {
            /** List of available financial accounts */
            financial_accounts,
            /** List of available gaming accounts */
            gaming_accounts,
            /** List of available virtual accounts */
            virtual_accounts,
        };
    }, [financial_accounts, gaming_accounts, virtual_accounts]);

    return {
        /** List of available accounts */
        data: available_accounts,
    };
};

export default useAvailableAccounts;
