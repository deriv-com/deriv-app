import { useKycAuthStatus } from '@deriv/api-v2';
import { POI_SERVICE } from '../constants/constants';

type TPOIInfoPayload = Parameters<typeof useKycAuthStatus>[0];

export const usePOIInfo = (payload: TPOIInfoPayload) => {
    const { isLoading, kyc_auth_status: kycAuthStatus, ...rest } = useKycAuthStatus(payload);

    if (isLoading || !kycAuthStatus) {
        return {
            isLoading,
            kycAuthStatus: undefined,
            ...rest,
        };
    }

    const { identity } = kycAuthStatus;

    if (
        payload?.country === 'ng' &&
        !identity.available_services?.includes(POI_SERVICE.idv) &&
        identity.available_services?.includes(POI_SERVICE.onfido)
    ) {
        return {
            isLoading,
            kycAuthStatus: {
                ...kycAuthStatus,
                identity: { ...identity, available_services: [POI_SERVICE.manual, POI_SERVICE.onfido] },
            },
            ...rest,
        };
    }
    return {
        isLoading,
        kycAuthStatus,
        ...rest,
    };
};
