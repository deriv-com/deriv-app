import { useFetch } from '@deriv/api';

const useDepositCryptoAddress = () => {
    const { data, ...rest } = useFetch('cashier', {
        payload: { cashier: 'deposit', provider: 'crypto', type: 'api' },
    });

    const deposit_address = typeof data !== 'string' ? data?.deposit?.address : undefined;

    return {
        ...rest,
        data: deposit_address,
    };
};

export default useDepositCryptoAddress;
