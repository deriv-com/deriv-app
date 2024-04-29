import { useQuery } from '@tanstack/react-query';
import initData from '../remote_config.json';

/**
 * This hook, unlike all other hooks, does not require APIProvider and AuthProvider to work,
 * As this is just a simple fetch request to get the remote config (no connection to websocket, no state, just fetch)
 * Imagine all requests and data handling to be as simple as this hook :):):)
 * @returns
 */
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

function useRemoteConfig(enabled = false) {
    return useQuery({
        queryKey: ['remoteConfig'],
        queryFn: remoteConfigQuery,
        initialData: initData,
        enabled,
    });
}

export default useRemoteConfig;
