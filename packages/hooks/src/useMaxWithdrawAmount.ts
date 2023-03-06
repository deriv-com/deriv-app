import { useStore } from '@deriv/stores';

const useMaxWithdrawAmount = () => {
    const { client } = useStore();

    return client.getLimits()?.get_limits?.remainder || 0;
};

export default useMaxWithdrawAmount;
