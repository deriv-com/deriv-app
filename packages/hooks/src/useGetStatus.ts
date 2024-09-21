import { useStore } from '@deriv/stores';
import useGetMFAccountStatus from './useGetMFAccountStatus';
import useIsSelectedMT5AccountCreated from './useIsSelectedMT5AccountCreated';
import { CFD_PLATFORMS } from '@deriv/shared';

const useGetStatus = () => {
    const { common } = useStore();
    const { mf_account_status, kyc_status } = useGetMFAccountStatus();
    const { existing_account_status, existing_account } = useIsSelectedMT5AccountCreated();
    const { platform } = common;

    if (platform === CFD_PLATFORMS.MT5) {
        return {
            status_badge: existing_account_status,
            client_kyc_status: existing_account?.client_kyc_status,
        };
    }
    return {
        status_badge: mf_account_status,
        client_kyc_status: kyc_status,
    };
};

export default useGetStatus;
