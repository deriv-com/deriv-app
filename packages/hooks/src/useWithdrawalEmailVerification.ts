import { useStore } from '@deriv/stores';
import useVerifyEmail from './useVerifyEmail';

const useWithdrawalEmailVerification = () => {
    const verify = useVerifyEmail('payment_withdraw');
    const { client, modules } = useStore();

    return {
        currency: client.currency,
        transaction_history: modules.cashier.transaction_history,
        verify,
    };
};

export default useWithdrawalEmailVerification;
