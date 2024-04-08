import { QueryFunction, useQuery } from '@tanstack/react-query';
import initData from '../remote_config.json';

const remoteConfigQuery: QueryFunction<any, string[], any> = async function ({ signal }) {
    const isProductionOrStaging = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
    const REMOTE_CONFIG_URL = process.env.REMOTE_CONFIG_URL || '';
    if (isProductionOrStaging && REMOTE_CONFIG_URL === '') {
        throw new Error('Remote Config URL is not set!');
    }
    try {
        const response = await fetch(REMOTE_CONFIG_URL, {
            signal,
        });
        return response.json();
    } catch (error) {
        throw new Error('Remote Config Server is out of reach!');
    }
};

function useRemoteConfig(enabled = false) {
    return useQuery({
        queryKey: ['remoteConfig'],
        queryFn: remoteConfigQuery,
        initialData: initData,
        enabled,
    });
}

export default useRemoteConfig;
