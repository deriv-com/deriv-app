import { useFetch } from '@deriv/api';
import { getMinWithdrawal } from '../../shared/src/utils/currency';
import { useStore } from '@deriv/stores';

const useIsWithdrawalLimitReached = () => {
    const { client } = useStore();
    const { data: account_limit } = useFetch('get_limits');
    const remainder = account_limit?.get_limits?.remainder;
    const min_withdrawal = getMinWithdrawal(client.currency);
    const is_10k_withdrawal_limit_reached = !!(typeof remainder !== 'undefined' && +remainder < min_withdrawal);

    return is_10k_withdrawal_limit_reached;
};

export default useIsWithdrawalLimitReached;
