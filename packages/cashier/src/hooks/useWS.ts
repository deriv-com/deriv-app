import { useState } from 'react';
import { useWS as useWSShared } from '@deriv/shared';
import { TSocketCallTypes } from 'Types';

type TSocketCalls = keyof TSocketCallTypes;

type TResponse<T extends TSocketCalls> = TSocketCallTypes[T]['response'][T];

type TRequestPropsExceptions = 'verify_email';

type TRequestProps<T extends TSocketCalls> = Omit<
    TSocketCallTypes[T]['request'],
    (T extends TRequestPropsExceptions ? never : T) | 'passthrough' | 'req_id'
>;

type TRequest<T extends TSocketCalls> = TRequestProps<T> extends Record<string, never>
    ? Record<string, never>
    : TRequestProps<T>;

const useWS = <T extends TSocketCalls>(name: T) => {
    const [is_loading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>();
    const [data, setData] = useState<TResponse<T>>();
    const WS = useWSShared();

    const send = async (props: TRequest<T>) => {
        if (is_loading) return;

        setIsLoading(true);

        try {
            const response = await WS.send({ [name]: 1, ...props });

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
    };

    return { send, is_loading, error, data };
};

export default useWS;
