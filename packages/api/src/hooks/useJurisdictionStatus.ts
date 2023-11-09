import { useMemo } from 'react';
import useAuthentication from './useAuthentication';
import usePOA from './usePOA';
import usePOI from './usePOI';
import useAccountStatus from './useAccountStatus';
import useMT5AccountsList from './useMT5AccountsList';

type TAccount = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
type TServices = NonNullable<NonNullable<ReturnType<typeof usePOI>['data']>['services']>;
type TServiceStatus = NonNullable<NonNullable<ReturnType<typeof usePOI>['data']>['status']>;
type TJurisdictionStatuses = 'failed' | 'pending' | 'verified' | 'not_applicable';

// @param account - this is coming from useMT5AccountsList, one of the items
const useJurisdictionStatus = (account: TAccount) => {
    const { data: authenticationStatus, isSuccess: isSuccessAuthenticationStatus } = useAuthentication();
    const { data: accountStatus, isSuccess: isSuccessAccountStatus } = useAccountStatus();
    const { data: poiStatus } = usePOI();
    const { data: poaStatus, isSuccess: isSuccessPOA } = usePOA();

    const isSuccess = useMemo(() => {
        return isSuccessAccountStatus && isSuccessPOA && poiStatus?.next?.service;
    }, [isSuccessAccountStatus, poiStatus?.next?.service, isSuccessPOA]);

    const verification_status = useMemo(() => {
        const isServiceStatus = (...statuses: TServiceStatus[]) => {
            const next_service = poiStatus?.next?.service as keyof TServices;
            const service = poiStatus?.services?.[next_service];
            if (service?.status) {
                return statuses.includes(service.status);
            }
        };

        const is_poa_failed = poaStatus?.is_rejected || poaStatus?.is_suspected || poaStatus?.is_expired;

        let status: TJurisdictionStatuses;
        if (account?.landing_company_short) {
            switch (account.landing_company_short) {
                case 'bvi':
                    if (
                        isServiceStatus('expired', 'none', 'rejected', 'suspected') ||
                        account.status === 'proof_failed'
                    ) {
                        status = 'failed';
                    } else if (isServiceStatus('pending') || account.status === 'verification_pending') {
                        status = 'pending';
                    } else {
                        status = 'verified';
                    }
                    break;
                case 'labuan':
                    // for labuan we check POA
                    // for labuan we just need to check for is_authenticated_with_idv_photoid status for failed case
                    if (
                        is_poa_failed ||
                        isServiceStatus('expired', 'none', 'rejected', 'suspected') ||
                        authenticationStatus?.is_authenticated_with_idv_photoid ||
                        account.status === 'proof_failed'
                    ) {
                        status = 'failed';
                    } else if (isServiceStatus('pending') || account.status === 'verification_pending') {
                        status = 'pending';
                    } else {
                        status = 'verified';
                    }
                    break;
                case 'svg':
                    status = 'not_applicable';
                    break;
                default:
                    // MT5 account status already checks for POA status in BE
                    if (account.status === 'proof_failed') {
                        status = 'failed';
                    } else if (account.status === 'verification_pending') {
                        status = 'pending';
                    } else {
                        status = 'verified';
                    }
            }

            return {
                status,
            };
        }
    }, [
        poaStatus?.is_rejected,
        poaStatus?.is_suspected,
        poaStatus?.is_expired,
        poiStatus?.services,
        poiStatus?.next?.service,
        accountStatus?.status,
        account?.status,
        account?.landing_company_short,
    ]);

    return {
        data: verification_status,
        isSuccess,
    };
};

export default useJurisdictionStatus;
