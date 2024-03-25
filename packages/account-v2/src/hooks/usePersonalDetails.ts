import { useMemo } from 'react';
import {
    useActiveTradingAccount,
    useAuthentication,
    useGetAccountStatus,
    useIsEuRegion,
    useResidenceList,
    useSettings,
    useStatesList,
} from '@deriv/api-v2';
import { AUTH_STATUS_CODES } from '../constants';
import { getPersonalDetailsInitialValues } from '../utils';
import { useCurrentLandingCompany } from './useCurrentLandingCompany';

export const usePersonalDetails = () => {
    const { data: activeAccount } = useActiveTradingAccount();
    const { data: authenticationStatus } = useAuthentication();
    const { data: currentLandingCompany } = useCurrentLandingCompany();
    const { data: accountStatus } = useGetAccountStatus();
    const { data: accountSettings, isSuccess } = useSettings();
    const { data: residenceList } = useResidenceList();
    const { data: statesLists } = useStatesList(accountSettings?.country_code ?? '', {
        enabled: isSuccess,
    });
    const { data: isEu } = useIsEuRegion();

    const modifiedPersonalDetailsData = useMemo(() => {
        const isVirtual = activeAccount?.is_virtual;
        const isSupportProfessionalClient =
            currentLandingCompany &&
            typeof currentLandingCompany === 'object' &&
            'support_professional_client' in currentLandingCompany &&
            !!currentLandingCompany?.support_professional_client;

        return {
            isEu,
            isSupportProfessionalClient,
            isVirtual,
        };
    }, [activeAccount, currentLandingCompany, isEu]);

    const accountAuthStatus = useMemo(() => {
        const isPoaVerified = authenticationStatus?.poa_status === AUTH_STATUS_CODES.VERIFIED;
        const isPoiVerified = authenticationStatus?.poi_status === AUTH_STATUS_CODES.VERIFIED;

        const isAccountVerified = isPoaVerified && isPoiVerified;

        return {
            isAccountVerified,
            isPoaVerified,
            isPoiVerified,
        };
    }, [authenticationStatus]);

    const isSocialSignup = useMemo(
        () => accountStatus?.status?.includes('social_signup') ?? false,
        [accountStatus?.status]
    );

    const initialValues = useMemo(() => {
        return getPersonalDetailsInitialValues(accountSettings, residenceList, statesLists, isSocialSignup);
    }, [accountSettings, residenceList, statesLists, isSocialSignup]);

    return {
        accountAuthStatus,
        data: modifiedPersonalDetailsData,
        initialValues,
        isSocialSignup,
    };
};
