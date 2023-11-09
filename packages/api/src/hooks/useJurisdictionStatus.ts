import { useMemo } from 'react';
import useAuthentication from './useAuthentication';
import usePOA from './usePOA';
import usePOI from './usePOI';
import useAccountStatus from './useAccountStatus';
import useGetAccountStatus from './useGetAccountStatus';
import useMT5AccountsList from './useMT5AccountsList';

type TAccount = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
type TServices = NonNullable<NonNullable<ReturnType<typeof usePOI>['data']>['services']>;
type TServiceStatus = NonNullable<NonNullable<ReturnType<typeof usePOI>['data']>['status']>;
type TJurisdictionStatuses = 'failed' | 'pending' | 'verified' | 'not_applicable';

// @param account - this is coming from useMT5AccountsList, one of the items
const useJurisdictionStatus = (account: TAccount) => {
    const { data: authentication_data, isSuccess: isSuccessAuthentication } = useAuthentication();
    const { data: accountStatus, isSuccess: isSuccessAccountStatus } = useAccountStatus();
    const { data: poiStatus } = usePOI();
    const { data: poaStatus, isSuccess: isSuccessPOA } = usePOA();

    const isSuccess = useMemo(() => {
        return isSuccessAccountStatus && isSuccessAuthentication && isSuccessPOA && poiStatus?.next?.service;
    }, [isSuccessAccountStatus, isSuccessAuthentication, poiStatus?.next?.service, isSuccessPOA]);

    const verification_status = useMemo(() => {
        const isServiceStatus = (...statuses: TServiceStatus[]) => {
            const next_service = poiStatus?.next?.service as keyof TServices;
            const service = poiStatus?.services?.[next_service];
            if (service?.status) {
                console.log(
                    `checked service for ${account?.landing_company_short} ${account?.loginid}`,
                    service.status
                );
                return statuses.includes(service.status);
            }
        };

        let poi_status: TJurisdictionStatuses;
        if (account?.landing_company_short) {
            switch (account.landing_company_short) {
                case 'bvi':
                    const is_poi_failed_for_bvi =
                        isServiceStatus('expired', 'none', 'rejected', 'suspected') ||
                        account.status === 'proof_failed';
                    if (is_poi_failed_for_bvi) {
                        poi_status = 'failed';
                    } else if (isServiceStatus('pending') || account.status === 'verification_pending') {
                        poi_status = 'pending';
                    } else {
                        poi_status = 'verified';
                    }
                    break;
                case 'labuan':
                    // for labuan we just need to check for is_authenticated_with_idv_photoid status for failed case
                    const is_poi_failed_for_labuan =
                        isServiceStatus('expired', 'none', 'rejected', 'suspected') ||
                        ['proof_failed', 'is_authenticated_with_idv_photoid'].includes(account.status || '');
                    if (is_poi_failed_for_labuan) {
                        poi_status = 'failed';
                    } else if (isServiceStatus('pending') || account.status === 'verification_pending') {
                        poi_status = 'pending';
                    } else {
                        poi_status = 'verified';
                    }
                    break;
                case 'svg':
                    poi_status = 'not_applicable';
                    break;
                default:
                    if (account.status === 'proof_failed') {
                        poi_status = 'failed';
                    } else if (account.status === 'verification_pending') {
                        poi_status = 'pending';
                    } else {
                        poi_status = 'verified';
                    }
            }

            let poa_status: TJurisdictionStatuses;
            // should we check poaStatus?.has_attempted_poa to see if user has already attempted POA
            const is_poa_failed = poaStatus?.is_rejected || poaStatus?.is_suspected || poaStatus?.is_expired;
            if (account.landing_company_short === 'svg') {
                poa_status = 'not_applicable';
            } else {
                if (is_poa_failed) {
                    poa_status = 'failed';
                } else if (poaStatus?.is_pending) {
                    poa_status = 'pending';
                } else {
                    poa_status = 'verified';
                }
            }

            return {
                poa_status,
                poi_status,
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
