import { useMemo } from 'react';
import { useActiveAccount, useLandingCompany } from '@deriv/api-v2';

export const useCurrentLandingCompany = () => {
    const { data: landingCompanies } = useLandingCompany();
    const { data: activeAccount } = useActiveAccount();

    const currentLandingCompany = useMemo(() => {
        const landingCompany =
            landingCompanies &&
            Object.keys(landingCompanies).find(
                company => landingCompanies[company]?.shortcode === activeAccount?.landing_company_name
            );

        return landingCompany ? landingCompanies[landingCompany] : undefined;
    }, [landingCompanies, activeAccount]);

    return {
        data: currentLandingCompany,
    };
};
