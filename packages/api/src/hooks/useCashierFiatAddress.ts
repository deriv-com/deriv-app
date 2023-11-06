import { useCallback } from 'react';
import useMutation from '../useMutation';

type TCashierParam = NonNullable<
    Parameters<ReturnType<typeof useMutation<'cashier'>>['mutate']>
>[0]['payload']['cashier'];

type TParams = Omit<
    NonNullable<Parameters<ReturnType<typeof useMutation<'cashier'>>['mutate']>>[0]['payload'],
    'cashier' | 'provider'
>;

/** A custom hook to get the deposit and withdrawal fiat address. */
const useCashierFiatAddress = () => {
    const { data, mutate: _mutate, ...rest } = useMutation('cashier');
    const iframe_url =
        'https://doughflow-test.4x.my/cashier/login.asp?Sportsbook=Test (SVG) LLC USD&PIN=CR90000008&Lang=en&Password=8d03355e934323f231abc478d20d66e282fa7cca&Secret=9ce4b0224c4c202f6c3961ff0ab7fdf1&Action=DEPOSIT&udef1=EN&udef2=deriv&DarkMode=off';
    typeof data?.cashier === 'string' ? data?.cashier : undefined;

    const mutate = useCallback(
        (cashier: TCashierParam, payload?: TParams) =>
            _mutate({ payload: { cashier, provider: 'doughflow', ...payload } }),
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
