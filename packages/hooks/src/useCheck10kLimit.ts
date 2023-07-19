import { useFetch } from '@deriv/api';
import { getMinWithdrawal } from '../../shared/src/utils/currency';
import { useStore } from '@deriv/stores';

type TUseCheck10kLimit = {
    is_10k_withdrawal_limit_reached: boolean;
    max_withdraw_amount: number | undefined;
    isSuccess: boolean;
};

const useCheck10kLimit = (): TUseCheck10kLimit => {
    const { client } = useStore();
    const { data: account_limit, isSuccess } = useFetch('get_limits');
    const remainder = account_limit?.get_limits?.remainder;
    const min_withdrawal = getMinWithdrawal(client.currency);
    const is_10k_withdrawal_limit_reached = !!(typeof remainder !== 'undefined' && +remainder < min_withdrawal);

    return { is_10k_withdrawal_limit_reached, max_withdraw_amount: remainder, isSuccess };
};

export default useCheck10kLimit;
