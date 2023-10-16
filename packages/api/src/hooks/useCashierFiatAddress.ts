import { useCallback } from 'react';
import useMutation from '../useMutation';

type TCashierParam = NonNullable<
    Parameters<ReturnType<typeof useMutation<'cashier'>>['mutate']>
>[0]['payload']['cashier'];

/** A custom hook to get the deposit and withdrawal fiat address. */
const useCashierFiatAddress = () => {
    const { data, mutate: _mutate, ...rest } = useMutation('cashier');
    const iframe_url = typeof data?.cashier === 'string' ? data?.cashier : undefined;

    const mutate = useCallback(
        (cashier: TCashierParam) => _mutate({ payload: { cashier, provider: 'doughflow' } }),
        [_mutate]
    );

    return {
        /** The deposit/withdrawal fiat iframe */
        data: iframe_url,
        /** Function to get deposit/withdrawal fiat address */
        mutate,
        ...rest,
    };
};

export default useCashierFiatAddress;
