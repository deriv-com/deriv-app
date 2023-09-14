import { useCallback } from 'react';
import { useMutation as _useMutation } from '@tanstack/react-query';
import useAPI from './useAPI';
import type {
    TSocketAcceptableProps,
    TSocketEndpointNames,
    TSocketRequestMutationOptions,
    TSocketRequestPayload,
    TSocketResponseData,
} from '../types';

const useMutation = <T extends TSocketEndpointNames>(name: T, options?: TSocketRequestMutationOptions<T>) => {
    const { send } = useAPI();
    const { mutate: _mutate, ...rest } = _useMutation<TSocketResponseData<T>, unknown, TSocketAcceptableProps<T>>(
        props => {
            const prop = props?.[0];
            const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;

            return send(name, payload);
        },
        options
    );

    const mutate = useCallback((...payload: TSocketAcceptableProps<T>) => _mutate(payload), [_mutate]);

    return {
        mutate,
        ...rest,
    };
};

export default useMutation;
