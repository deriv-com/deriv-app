import useAuthorizedQuery from '../useAuthorizedQuery';

/** A custom hook to get the deposit crypto address. */
const useDepositCryptoAddress = () => {
    const { data, ...rest } = useAuthorizedQuery(
        'cashier',
        { cashier: 'deposit', provider: 'crypto', type: 'api' },
        {
            staleTime: Infinity,
        }
    );

    // typing sadly is not corret ;( so need the "as unknonw"
    const response = data?.cashier as unknown as { deposit: { address: string } };

    return {
        ...rest,
        data: response?.deposit?.address,
    };
};

export default useDepositCryptoAddress;
