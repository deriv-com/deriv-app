import { useQuery as _useQuery } from '@tanstack/react-query';
import type {
    TSocketAcceptableProps,
    TSocketEndpointNames,
    TSocketError,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
    TSocketResponseData,
} from '../types';
import useAPI from './useAPI';
import { getQueryKeys } from './utils';

const useQuery = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T, true>) => {
    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestQueryOptions<T>) : undefined;
    const { send } = useAPI();

    return _useQuery<TSocketResponseData<T>, TSocketError<T>>(
        getQueryKeys(name, payload),
        () => send(name, payload),
        options
    );
};

export default useQuery;
