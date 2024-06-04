import { useCallback } from 'react';
import { useMutation as _useMutation } from '@tanstack/react-query';
import useAPI from './useAPI';
import type {
    TSocketAcceptableProps,
    TSocketEndpointNames,
    TSocketError,
    TSocketRequestMutationOptions,
    TSocketRequestPayload,
    TSocketResponseData,
} from '../types';

const useMutation = <T extends TSocketEndpointNames>(name: T, options?: TSocketRequestMutationOptions<T>) => {
    const { send } = useAPI();
    const {
        mutate: _mutate,
        mutateAsync: _mutateAsync,
        ...rest
    } = _useMutation<TSocketResponseData<T>, TSocketError<T>, TSocketAcceptableProps<T>>(props => {
        const prop = props?.[0];
        const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>['payload']) : undefined;

        return send(name, payload);
    }, options);

    const mutate = useCallback((...payload: TSocketAcceptableProps<T>) => _mutate(payload), [_mutate]);
    const mutateAsync = useCallback((...payload: TSocketAcceptableProps<T>) => _mutateAsync(payload), [_mutateAsync]);

    return {
        mutate,
        mutateAsync,
        ...rest,
    };
};

export default useMutation;
