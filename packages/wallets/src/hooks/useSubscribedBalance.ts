import { useBalanceSubscription } from '@deriv/api-v2';

type TBalanceData = Omit<
    ReturnType<typeof useBalanceSubscription>,
    'isIdle' | 'isSubscribed' | 'subscribe' | 'unsubscribe' | 'unsubscribe'
>;

let balanceData: TBalanceData;

const useSubscribedBalance = () => {
    return {
        ...balanceData,
        setBalanceData: (data: TBalanceData) => (balanceData = data),
    };
};

export default useSubscribedBalance;
