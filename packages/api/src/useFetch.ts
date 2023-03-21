import { useQuery } from 'react-query';
import { getQueryKeys, typeSafeSend } from './utils';
import { TSocketEndpointNames, TSocketAcceptableProps, TSocketResponseData } from '../types';

const useFetch = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T, true>) =>
    useQuery<TSocketResponseData<T>, unknown>(
        getQueryKeys(props[0] || {}, name),
        () => typeSafeSend(name, ...props),
        props[0]?.options
    );

export default useFetch;
