import { useQuery } from 'react-query';
import { WS } from '@deriv/shared';
import { TSocketEndpointNames, TSocketAcceptableProps, TSocketResponseData } from '../types';

const send = async <T extends TSocketEndpointNames>(
    name: T,
    ...props: TSocketAcceptableProps<T, true>
): Promise<TSocketResponseData<T>> => {
    const request = props[0];
    delete request?.options;
    const response = await WS.send({ [name]: 1, ...(request || {}) });

    if (response.error) {
        throw response.error;
    }

    return response[name];
};

const getQueryKeys = (props: { [k: string]: unknown }, name?: string) => {
    delete props.req_id;
    if (name && props[name] === 1) delete props[name];

    const orderedProps = Object.keys(props)
        .sort()
        .reduce((obj, key) => {
            obj[key] = props[key];

            return obj;
        }, {} as { [k: string]: unknown });

    const queryProps = Object.keys(orderedProps).length ? JSON.stringify(orderedProps) : undefined;

    return [name, queryProps];
};

const useFetch = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T, true>) =>
    useQuery<TSocketResponseData<T>, unknown>(
        getQueryKeys(props[0] || {}, name),
        () => send(name, ...props),
        props[0]?.options
    );

export default useFetch;
