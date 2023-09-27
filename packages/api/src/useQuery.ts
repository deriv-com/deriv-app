import { useQuery as _useQuery } from '@tanstack/react-query';
import useAPI from './useAPI';
import type {
    TSocketAcceptableProps,
    TSocketEndpointNames,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
    TSocketResponseData,
} from '../types';

const getQueryKeys = (name: string, props?: Record<string, unknown>) => {
    if (!props) return [name];

    delete props.req_id;
    if (name && props[name] === 1) delete props[name];

    if (Object.keys(props).length === 0) return [name];

    const ordered_props = Object.keys(props)
        .sort()
        .reduce((obj, key) => {
            obj[key] = props[key];

            return obj;
        }, {} as { [k: string]: unknown });

    const query_props = JSON.stringify(ordered_props);

    return [name, query_props];
};

const useQuery = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T, true>) => {
    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestQueryOptions<T>) : undefined;
    const { send } = useAPI();

    return _useQuery<TSocketResponseData<T>, unknown>(getQueryKeys(name, payload), () => send(name, payload), options);
};

export default useQuery;
