import { useQuery } from '@tanstack/react-query';
import initData from '../remote_config.json';

const remoteConfigQuery = async function () {
    if (!process.env.REMOTE_CONFIG_URL) {
        throw new Error('Remote Config URL is not set!');
    }
    const response = await fetch(process.env.REMOTE_CONFIG_URL);
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
