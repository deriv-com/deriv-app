import { useCallback } from 'react';
import useRequest from '../useRequest';

type TPayload = Parameters<
    ReturnType<typeof useRequest<'trading_platform_investor_password_change'>>['mutate']
>[0]['payload'];

/** A custom hook that change the Trading Platform Investor Password. */
const useTradingPlatformInvestorPasswordChange = () => {
    const { mutate: _mutate, ...rest } = useRequest('trading_platform_investor_password_change');

    /**  @param payload - The payload to be sent to the server */
    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    return {
        /** The mutation function that accepts a payload and sends it to the server */
        mutate,
        ...rest,
    };
};

export default useTradingPlatformInvestorPasswordChange;
