import { useCallback, useState } from 'react';
import { useWS as useWSShared } from '@deriv/shared';
import { TSocketEndpointNames, TSocketAcceptableProps, TSocketResponseData } from '../types';

const useWS = <T extends TSocketEndpointNames>(name: T) => {
    const [is_loading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>();
    const [data, setData] = useState<TSocketResponseData<T>>();
    const WS = useWSShared();

    const send = useCallback(
        async (...props: TSocketAcceptableProps<T>) => {
            setIsLoading(true);

            try {
                const response = await WS.send({ [name]: 1, ...(props[0] || {}) });

                if (response.error) {
                    setError(response.error);
                } else {
                    setData(response[name]);
                }
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        },
        [WS, name]
    );

    return { send, is_loading, error, data };
};

export default useWS;
