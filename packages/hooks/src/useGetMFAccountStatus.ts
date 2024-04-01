import { useStore } from '@deriv/stores';

const useGetMFAccountStatus = () => {
    const { client } = useStore();
    const { account_status } = client || {};
    const authentication = account_status?.authentication;

    const onfido_status = authentication?.identity?.services?.onfido?.status;
    const manual_status = authentication?.identity?.services?.manual?.status;
    const poa_status = authentication?.document?.status;

    const STATUS = {
        NONE: 'none',
        VERIFIED: 'verified',
        PENDING: 'pending',
        REJECTED: 'rejected',
        EXPIRED: 'expired',
        SUSPECTED: 'suspected',
    } as const;
    const failed_cases = [STATUS.REJECTED, STATUS.EXPIRED, STATUS.SUSPECTED];

    //@ts-expect-error we can ignore this error since we are checking the status and returning true or false
    const need_poa_resubmission = poa_status && failed_cases.includes(poa_status);
    const poa_pending = poa_status === STATUS.PENDING;
    const poa_not_submitted = poa_status === STATUS.NONE;

    const poi_verified_by_onfido_or_manual = [onfido_status, manual_status].includes(STATUS.VERIFIED);
    const poi_pending_by_onfido_or_manual =
        [onfido_status, manual_status].includes(STATUS.PENDING) && !poi_verified_by_onfido_or_manual;

    const poi_not_submitted_by_onfido_or_manual = [onfido_status, manual_status].every(
        status => status === STATUS.NONE
    );

    const need_poi_resubmission_by_onfido_or_manual =
        !poi_pending_by_onfido_or_manual && !poi_not_submitted_by_onfido_or_manual && !poi_verified_by_onfido_or_manual;

    if (poa_status && onfido_status && manual_status) {
        if (need_poi_resubmission_by_onfido_or_manual || need_poa_resubmission) {
            return 'failed';
        } else if (poi_not_submitted_by_onfido_or_manual || poa_not_submitted) {
            return 'needs_verification';
        } else if (poi_pending_by_onfido_or_manual || poa_pending) {
            return 'pending';
        }
    }
    return null;
};

export default useGetMFAccountStatus;
