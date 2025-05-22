import { getWithdrawalInfoMessage, getWithdrawalTitle } from '@deriv/shared';
import { useStore } from '@deriv/stores';

const useGetWithdrawalLimitsDetails = () => {
    const { client } = useStore();
    const { account_limits } = client;

    const withdrawalTypes = [
        'lifetime_limit',
        'num_of_days_limit',
        'withdrawal_since_inception_monetary',
        'withdrawal_for_x_days_monetary',
        'remainder',
    ] as const;

    const withdrawal_limit_details = withdrawalTypes
        .map(type => ({
            withdrawal_title: getWithdrawalTitle(type, account_limits.num_of_days),
            withdrawal_info_message: getWithdrawalInfoMessage(type),
            withdrawal_amount: account_limits[type],
        }))
        .filter(detail => detail.withdrawal_amount !== 99999999);

    return { withdrawal_limit_details };
};

export default useGetWithdrawalLimitsDetails;
