import { useMutation } from 'react-query';
import { send } from './utils';
import type {
    TSocketEndpointNames,
    TSocketAcceptableProps,
    TSocketResponseData,
    TSocketRequestCleaned,
} from '../types';

// Todo: Get rid of redundant array wrapper for the props argument.
const useRequest = <T extends TSocketEndpointNames>(
    name: T,
    options?: Parameters<typeof useMutation<TSocketResponseData<T>, unknown, TSocketAcceptableProps<T>>>[2]
) =>
    useMutation<TSocketResponseData<T>, unknown, TSocketAcceptableProps<T>>(props => {
        const prop = props?.[0];
        const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestCleaned<T>) : undefined;

        return send(name, payload);
    }, options);

export default useRequest;
