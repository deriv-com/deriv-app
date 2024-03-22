import { useMemo } from 'react';
import { useActiveAccount, useLandingCompany } from '@deriv/api-v2';

export const useCurrentLandingCompany = () => {
    const { data: landingCompanies } = useLandingCompany();
    const { data: activeAccount } = useActiveAccount();

    const currentLandingCompany = useMemo(() => {
        const landingCompany =
            landingCompanies &&
            Object.keys(landingCompanies).find(company => {
                const companyVariables = landingCompanies[company as keyof typeof landingCompanies];

                if (companyVariables && typeof companyVariables === 'object' && 'shortcode' in companyVariables) {
                    return companyVariables?.shortcode === activeAccount?.landing_company_name;
                }
            });

        return landingCompany ? landingCompanies[landingCompany as keyof typeof landingCompanies] : undefined;
    }, [landingCompanies, activeAccount]);

    return {
        data: currentLandingCompany,
    };
};
