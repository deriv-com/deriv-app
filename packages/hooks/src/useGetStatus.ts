import { useStore } from '@deriv/stores';
import useGetMFAccountStatus from './useGetMFAccountStatus';
import useIsSelectedMT5AccountCreated from './useIsSelectedMT5AccountCreated';
import { CFD_PLATFORMS, MT5_ACCOUNT_STATUS } from '@deriv/shared';

const getStatusBadge = (status: string) => {
    if (status === 'proof_failed') {
        return MT5_ACCOUNT_STATUS.FAILED;
    } else if (status === 'verification_pending') {
        return MT5_ACCOUNT_STATUS.PENDING;
    } else if (status === 'needs_verification') {
        return MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION;
    }
};

const useGetStatus = () => {
    const { common, traders_hub } = useStore();
    const { mf_account_status, kyc_status } = useGetMFAccountStatus();
    const { selected_mt5_account } = useIsSelectedMT5AccountCreated();
    const { platform } = common;
    const { selected_jurisdiction_kyc_status } = traders_hub;
    if (platform === CFD_PLATFORMS.MT5) {
        return {
            status_badge: selected_mt5_account?.status
                ? getStatusBadge(selected_mt5_account?.status)
                : MT5_ACCOUNT_STATUS.PENDING,
            client_kyc_status: selected_jurisdiction_kyc_status,
        };
    }
    return {
        status_badge: mf_account_status,
        client_kyc_status: {
            ...kyc_status,
        },
    };
};

export default useGetStatus;
