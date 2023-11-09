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

/**
 * Hook that returns the verification status for a landing company/jurisdiction
 *
 * @param jurisdiction - the jurisdiction/landing company, i.e. 'svg', 'bvi', 'labuan', 'vanuatu'
 * @param mt5_account_status - the status of the MT5 account, usually retrieved from MT5 accounts list item
 * @returns One of the following statuses: failed, pending, verified, and not_applicable. not_applicable is only applied for SVG jurisdiction.
 */
const useJurisdictionStatus = (
    jurisdiction: TAccount['landing_company_short'],
    mt5_account_status: TAccount['status']
) => {
    const { data: authenticationStatus, isSuccess: isSuccessAuthenticationStatus } = useAuthentication();
    const { data: accountStatus, isSuccess: isSuccessAccountStatus } = useAccountStatus();
    const { data: poiStatus } = usePOI();
    const { data: poaStatus, isSuccess: isSuccessPOA } = usePOA();

    const isSuccess = useMemo(() => {
        return isSuccessAuthenticationStatus && isSuccessAccountStatus && isSuccessPOA && poiStatus?.next?.service;
    }, [isSuccessAuthenticationStatus, isSuccessAccountStatus, poiStatus?.next?.service, isSuccessPOA]);

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
        switch (jurisdiction) {
            case 'bvi':
                if (
                    isServiceStatus('expired', 'none', 'rejected', 'suspected') ||
                    mt5_account_status === 'proof_failed'
                ) {
                    status = 'failed';
                } else if (isServiceStatus('pending') || mt5_account_status === 'verification_pending') {
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
                    mt5_account_status === 'proof_failed'
                ) {
                    status = 'failed';
                } else if (isServiceStatus('pending') || mt5_account_status === 'verification_pending') {
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
                if (mt5_account_status === 'proof_failed') {
                    status = 'failed';
                } else if (mt5_account_status === 'verification_pending') {
                    status = 'pending';
                } else {
                    status = 'verified';
                }
        }

        return {
            status,
        };
    }, [
        poaStatus?.is_rejected,
        poaStatus?.is_suspected,
        poaStatus?.is_expired,
        poiStatus?.services,
        poiStatus?.next?.service,
        accountStatus?.status,
        mt5_account_status,
        jurisdiction,
    ]);

    return {
        data: verification_status,
        isSuccess,
    };
};

export default useJurisdictionStatus;
