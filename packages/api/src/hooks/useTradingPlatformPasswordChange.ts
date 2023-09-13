import { useCallback } from 'react';
import useRequest from '../useRequest';

type TPayload = Parameters<ReturnType<typeof useRequest<'trading_platform_password_change'>>['mutate']>[0]['payload'];

/** A custom hook that change the Trading Platform Password. */
const useTradingPlatformPasswordChange = () => {
    const { mutate: _mutate, ...rest } = useRequest('trading_platform_password_change');

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    return {
        /** The mutation function that accepts a payload and sends it to the server */
        mutate,
        ...rest,
    };
};

export default useTradingPlatformPasswordChange;
