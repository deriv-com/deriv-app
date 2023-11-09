import { useMemo } from 'react';
import useAuthentication from './useAuthentication';
import usePOA from './usePOA';
import usePOI from './usePOI';
import useAccountStatus from './useAccountStatus';
import useGetAccountStatus from './useGetAccountStatus';
import useMT5AccountsList from './useMT5AccountsList';

type TAccount = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];

// @param account - this is coming from useMT5AccountsList, one of the items
const useJurisdictionStatus = (account: TAccount) => {
    const { data: authentication_data, ...rest } = useAuthentication();
    const { data: accountStatus } = useAccountStatus();
    const { data: poiStatus } = usePOI();
    const { data: poaStatus } = usePOA();

    const verification_status = useMemo(() => {
        // const { idv, onfido, manual } = getAccountStatus?.authentication?.identity?.services || {};
        // const services_status = new Set([idv?.status, onfido?.status, manual?.status])
        // const next_service = poiStatus?.next?.service || 'manual'
        // const service_status = poiStatus?.services?.[next_service]?.status || 'failed'
        // // const should_poi_resubmit = !poaStatus?.is_pending && !services_status.some(status =>
        // //             ['verified', 'pending', 'none'].includes(status || '')
        // //         );

        const checkServiceStatus = (...statuses: string[]) => {
            // check through all possible service statuses until we reach manual service if does not match status
            if (poiStatus?.next?.service === 'manual') return statuses.includes(poiStatus?.services['manual']?.status);
            if (statuses.includes(poiStatus?.services[poiStatus?.next?.service]?.status)) {
                checkServiceStatus(status);
            } else {
                return true;
            }
        };

        let poi_status: 'failed' | 'pending' | 'verified';
        if (account?.landing_company_short) {
            switch (account.landing_company_short) {
                case 'bvi':
                    const is_poi_failed_for_bvi =
                        !checkServiceStatus('pending', 'verified') ||
                        accountStatus?.is_idv_revoked ||
                        account.status === 'proof_failed';
                    if (is_poi_failed_for_bvi) {
                        poi_status = 'failed';
                    } else if (checkServiceStatus('pending') || account.status === 'verification_pending') {
                        poi_status = 'pending';
                    } else {
                        poi_status = 'verified';
                    }
                    break;
                case 'labuan':
                    // for labuan we just need to check for is_authenticated_with_idv_photoid status for failed case
                    const is_poi_failed_for_labuan =
                        !checkServiceStatus('pending', 'verified') ||
                        accountStatus?.is_idv_revoked ||
                        ['proof_failed', 'is_authenticated_with_idv_photoid'].includes(account.status || '');
                    if (is_poi_failed_for_labuan) {
                        poi_status = 'failed';
                    } else if (checkServiceStatus('pending') || account.status === 'verification_pending') {
                        poi_status = 'pending';
                    } else {
                        poi_status = 'verified';
                    }
                    break;
                case 'svg':
                    poi_status = 'verified';
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

            let poa_status: 'failed' | 'pending' | 'verified';
            const is_poa_failed = poaStatus?.is_rejected || poaStatus?.is_suspected || poaStatus?.is_expired;
            if (account.landing_company_short === 'svg') {
                poa_status = 'verified';
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

            // NOTE: handle this logic in the badge component
            // if (poa_status === 'failed' && poi_status === 'failed') {
            //     // show 'Verification Failed. Why?' badge
            //     return 'failed'
            // } else if (poa_status === 'pending' || poi_status === 'pending') {
            //     // show 'Verification pending' badge
            //     return 'pending'
            // } else {
            //     // don't show any badge
            //     return 'none'
            // }
        }
    }, [poaStatus, poiStatus, accountStatus]);

    // Original:
    // const is_none_idv_onfido_manual = [idv?.status, onfido?.status, manual?.status].every(status => status === 'none');
    // const is_verified_idv_onfido_manual = [idv?.status, onfido?.status, manual?.status].includes('verified');
    // const is_poi_resubmit_bvi_labuan_vanuatu = !poaStatus?.is_pending && !is_none_idv_onfido_manual && !is_verified_idv_onfido_manual;
    // Refactored version:

    // const should_poi_resubmit =
    //     !poaStatus?.is_pending &&
    //     ![idv?.status, onfido?.status, manual?.status].some(status =>
    //         ['verified', 'pending', 'none'].includes(status || '')
    //     );

    // const is_failed_poi =
    //     !should_poi_resubmit || accountStatus?.is_idv_revoked || account.status === 'proof_failed';

    // const is_pending_bvi_labuan_vanuatu = poaStatus?.is_pending || account.status === 'verification_pending';

    return {
        data: {
            verification_status,
        },
        ...rest,
    };
};

export default useJurisdictionStatus;

// {
//     is_poi_resubmit: true,
//     is_poa_submit: true,
//     is_submit_onfido: true,
//     is_poi_poa_verified,

//     // use usePOI next
//     should_submit_poi_using: ('idv' | 'onfido' | 'manual')[] = ['idv', 'manual']
//     should_skip_poi: boolean
//     should_submit_poa_using: ('upload' | 'resubmission')[]
// .
// }
