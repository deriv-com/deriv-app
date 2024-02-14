import { useQuery } from '@tanstack/react-query';
import initData from '../features.json';

const remoteConfigQuery = async function () {
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
