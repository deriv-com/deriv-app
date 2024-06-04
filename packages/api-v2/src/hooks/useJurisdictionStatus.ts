import { useCallback, useMemo } from 'react';
import useAuthentication from './useAuthentication';
import usePOI from './usePOI';
import useMT5AccountsList from './useMT5AccountsList';

type TAccount = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
type TServices = NonNullable<NonNullable<ReturnType<typeof usePOI>['data']>['services']>;
type TServiceStatus = NonNullable<NonNullable<ReturnType<typeof usePOI>['data']>['status']>;

/**
 * Hook that calculates/checks the verification status for a landing company/jurisdiction.
 *
 * Some jurisdictions such as Labuan requires checks for other statuses such as `is_authenticated_with_idv_photoid` status from `get_account_status` endpoint.
 * This hook verifies these checks internally and returns the appropriate verification status for a landing company/jurisdiction.
 *
 * Use cases:
 * - To show the verification badge for a MT5 account with a certain landing company/jurisdiction
 *
 */
const useJurisdictionStatus = () => {
    const { data: authenticationStatus, isSuccess: isSuccessAuthenticationStatus } = useAuthentication();
    const { data: poiStatus } = usePOI();

    const isSuccess = useMemo(() => {
        return isSuccessAuthenticationStatus && poiStatus?.current?.service;
    }, [isSuccessAuthenticationStatus, poiStatus]);

    const getVerificationStatus = useCallback(
        (jurisdiction: TAccount['landing_company_short'], mt5_account_status: TAccount['status']) => {
            const isPOIServiceStatus = (...statuses: TServiceStatus[]) => {
                const current_service = poiStatus?.current?.service as keyof TServices;
                const service = poiStatus?.services?.[current_service];
                if (service?.status) {
                    return statuses.includes(service.status);
                }
            };

            const pendingStatus = ['verification_pending'];
            const isStatusPending = pendingStatus.includes(mt5_account_status ?? '');

            const status = {
                is_failed: false,
                is_not_applicable: false,
                is_pending: false,
                is_verified: false,
            };
            switch (jurisdiction) {
                case 'bvi':
                    if (
                        isPOIServiceStatus('expired', 'rejected', 'suspected') ||
                        authenticationStatus?.is_idv_revoked ||
                        mt5_account_status === 'proof_failed'
                    ) {
                        status.is_failed = true;
                    } else if (isPOIServiceStatus('pending') || isStatusPending) {
                        status.is_pending = true;
                    } else if (isPOIServiceStatus('verified')) {
                        status.is_verified = true;
                    }
                    break;
                case 'labuan':
                    if (
                        isPOIServiceStatus('expired', 'rejected', 'suspected') ||
                        authenticationStatus?.is_idv_revoked ||
                        // NOTE: BE plans to rename this to `authenticated_with_idv`
                        authenticationStatus?.is_authenticated_with_idv_photoid ||
                        mt5_account_status === 'proof_failed'
                    ) {
                        status.is_failed = true;
                    } else if (isPOIServiceStatus('pending') || isStatusPending) {
                        status.is_pending = true;
                    } else if (isPOIServiceStatus('verified')) {
                        status.is_verified = true;
                    }
                    break;
                case 'svg':
                    status.is_not_applicable = true;
                    break;
                default:
                    // for other jurisdictions, MT5 account status already checks for POA status in BE
                    if (mt5_account_status === 'proof_failed') {
                        status.is_failed = true;
                    } else if (isStatusPending) {
                        status.is_pending = true;
                    } else if (isPOIServiceStatus('verified')) {
                        status.is_verified = true;
                    }
            }

            return status;
        },
        [poiStatus, authenticationStatus?.is_idv_revoked, authenticationStatus?.is_authenticated_with_idv_photoid]
    );

    return {
        /**
         * Function to get verification status
         * @param jurisdiction - the jurisdiction/landing company, i.e. 'svg', 'bvi', 'labuan', 'vanuatu'
         * @param mt5_account_status - the status of the MT5 account, usually retrieved from MT5 accounts list item
         * @returns The following statuses:
         * - `is_failed`: The verification status for the landing company/jurisdiction has currently failed either due to expiration, rejection, suspicion status or other factors
         * - `is_pending`: The verification status for the landing company/jurisdiction is currently pending verification
         * - `is_not_applicable`: The landing company/jurisdiction is not applicable for verification. This status is only applied for `SVG` landing company/jurisdiction
         * - `is_verified`: The verification status for the landing company/jurisdiction is currently verified
         *  */
        getVerificationStatus,
        /** checks if the hook has completed verification checks for the landing company/jurisdiction */
        isSuccess,
    };
};

export default useJurisdictionStatus;
