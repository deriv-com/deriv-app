import { useCallback } from 'react';
import useMutation from '../useMutation';

type TPayload = Parameters<
    ReturnType<typeof useMutation<'trading_platform_investor_password_change'>>['mutate']
>[0]['payload'];

/** A custom hook that change the Trading Platform Investor Password. */
const useTradingPlatformInvestorPasswordChange = () => {
    const { mutate: _mutate, ...rest } = useMutation('trading_platform_investor_password_change');

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    return {
        /** The mutation function that accepts a payload and sends it to the server */
        mutate,
        ...rest,
    };
};

export default useTradingPlatformInvestorPasswordChange;
