import { useQuery } from '@tanstack/react-query';
import initData from '../remote_config.json';

const remoteConfigQuery = async function () {
    const isProductionOrStaging = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
    const REMOTE_CONFIG_URL = process.env.REMOTE_CONFIG_URL || '';
    if (isProductionOrStaging && REMOTE_CONFIG_URL === '') {
        throw new Error('Remote Config URL is not set!');
    }
    const response = await fetch(REMOTE_CONFIG_URL);
    if (!response.ok) {
        throw new Error('Remote Config Server is out of reach!');
    }
    return response.json();
};

function useRemoteConfig() {
    return useQuery({
        queryKey: ['remoteConfig'],
        queryFn: remoteConfigQuery,
        initialData: initData,
    });
}

export default useRemoteConfig;
