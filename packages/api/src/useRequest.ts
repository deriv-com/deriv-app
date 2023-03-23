import { useMutation } from 'react-query';
import { send } from './utils';
import type { TSocketEndpointNames, TSocketAcceptableProps, TSocketResponseData } from '../types';

// Todo: Get rid of redundant array wrapper for the props argument.
const useRequest = <T extends TSocketEndpointNames>(
    name: T,
    options?: Parameters<typeof useMutation<TSocketResponseData<T>, unknown, TSocketAcceptableProps<T>>>[2]
) => useMutation<TSocketResponseData<T>, unknown, TSocketAcceptableProps<T>>(props => send(name, ...props), options);

export default useRequest;
