import { WS } from '@deriv/shared';
import { TSocketEndpointNames, TSocketRequestPayload, TSocketResponseData } from '../types';

export const send = async <T extends TSocketEndpointNames>(
    name: T,
    payload?: TSocketRequestPayload<T>
): Promise<TSocketResponseData<T>> => {
    const response = await WS.send({ [name]: 1, ...(payload || {}) });

    if (response.error) {
        throw response.error;
    }

    return response;
};

export const getQueryKeys = (name: string, props?: Record<string, unknown>) => {
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
