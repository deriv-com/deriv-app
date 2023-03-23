import { useQuery } from 'react-query';
import { getQueryKeys, send } from './utils';
import type { TSocketEndpointNames, TSocketAcceptableProps, TSocketResponseData } from '../types';

const useFetch = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T, true>) =>
    useQuery<TSocketResponseData<T>, unknown>(
        getQueryKeys(props[0] || {}, name),
        () => send(name, ...props),
        props[0]?.options
    );

export default useFetch;
