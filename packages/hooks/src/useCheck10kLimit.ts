import { useStore } from '@deriv/stores';
import useMaxWithdrawAmount from './useMaxWithdrawAmount';

const useCheck10kLimit = (): boolean | undefined => {
    const { client } = useStore();
    const { min_withdrawal } = client;
    const max_withdraw_amount = useMaxWithdrawAmount();
    const is_10k_withdrawal_limit_reached = !!(
        typeof max_withdraw_amount !== 'undefined' && +max_withdraw_amount < min_withdrawal
    );

    return is_10k_withdrawal_limit_reached;
};

export default useCheck10kLimit;
