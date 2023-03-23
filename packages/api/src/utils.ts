import { WS } from '@deriv/shared';
import { TSocketEndpointNames, TSocketRequestCleaned, TSocketResponseData } from '../types';

export const send = async <T extends TSocketEndpointNames>(
    name: T,
    payload?: TSocketRequestCleaned<T>
): Promise<TSocketResponseData<T>> => {
    const response = await WS.send({ [name]: 1, ...(payload || {}) });

    if (response.error) {
        throw response.error;
    }

    return response[name];
};

export const getQueryKeys = (name: string, props?: Record<string, unknown>) => {
    if (!props) return [name];

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
