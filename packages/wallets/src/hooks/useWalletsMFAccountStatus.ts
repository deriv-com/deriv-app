import { useMemo } from 'react';
import { useAccountStatus, useActiveLinkedToTradingAccount } from '@deriv/api-v2';
import { ACCOUNT_VERIFICATION_BADGE_STATUS, ACCOUNT_VERIFICATION_STATUSES } from '../constants/constants';
import { TAccountStatuses } from '../types';

const useWalletsMFAccountStatus = () => {
    const { data: accountStatus, ...rest } = useAccountStatus();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    const authentication = accountStatus?.authentication;
    const poiStatus = authentication?.identity?.status;
    const onfidoStatus = authentication?.identity?.services?.onfido?.status;
    const manualStatus = authentication?.identity?.services?.manual?.status;
    const poaStatus = authentication?.document?.status;
    const poaPending = poaStatus === ACCOUNT_VERIFICATION_STATUSES.PENDING;
    const poaNotSubmitted = poaStatus === ACCOUNT_VERIFICATION_STATUSES.NONE;
    const poiByOnfidoOrManualNotSubmitted = [onfidoStatus, manualStatus].every(
        status => status === ACCOUNT_VERIFICATION_STATUSES.NONE
    );
    const poiByOnfidoOrManualVerified = [onfidoStatus, manualStatus].includes(ACCOUNT_VERIFICATION_STATUSES.VERIFIED);
    const poiByOnfidoOrManualPending =
        [onfidoStatus, manualStatus].includes(ACCOUNT_VERIFICATION_STATUSES.PENDING) && !poiByOnfidoOrManualVerified;

    const failedCases = [
        ACCOUNT_VERIFICATION_STATUSES.REJECTED,
        ACCOUNT_VERIFICATION_STATUSES.EXPIRED,
        ACCOUNT_VERIFICATION_STATUSES.SUSPECTED,
    ];
    // @ts-expect-error faildCases is a subset of poaStatus, it won't have all the statuses. It just contains the fail cases
    const needPoaResubmission = failedCases.includes(poaStatus);
    const needPoiSubmission = !poiByOnfidoOrManualPending && !poiByOnfidoOrManualVerified;

    const needPoiResubmission = !poiByOnfidoOrManualNotSubmitted && needPoiSubmission;

    const mfAccountStatus = useMemo(() => {
        if (needPoiResubmission || needPoaResubmission) {
            return ACCOUNT_VERIFICATION_BADGE_STATUS.FAILED;
        }
        if (poaNotSubmitted || poiByOnfidoOrManualNotSubmitted) {
            return ACCOUNT_VERIFICATION_BADGE_STATUS.NEEDS_VERIFICATION;
        }
        if (poiByOnfidoOrManualPending || poaPending) {
            return ACCOUNT_VERIFICATION_BADGE_STATUS.IN_REVIEW;
        }
    }, [
        needPoaResubmission,
        needPoiResubmission,
        poaNotSubmitted,
        poaPending,
        poiByOnfidoOrManualNotSubmitted,
        poiByOnfidoOrManualPending,
    ]);

    // eslint-disable-next-line camelcase
    const client_kyc_status = useMemo(() => {
        return {
            poa_status: poaStatus as TAccountStatuses,
            poi_status: poiStatus as TAccountStatuses,
            required_tin: 1,
            valid_tin: 1,
        } as const;
    }, [poaStatus, poiStatus]);

    return {
        data: {
            // eslint-disable-next-line camelcase
            client_kyc_status,
            is_added: Boolean(activeLinkedToTradingAccount?.loginid),
            mfAccountStatus,
        },
        ...rest,
    };
};

export default useWalletsMFAccountStatus;
