import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook to get list of all used OAuth applications */
const useFetchConnectedApps = () => {
    const { isSuccess } = useAuthorize();
    const { data: connectedApps, ...restConnectedApps } = useQuery('oauth_apps', {
        options: { enabled: isSuccess },
    });

    return {
        /** returns the list of oauth apps */
        data: connectedApps?.oauth_apps,
        ...restConnectedApps,
    };
};

export default useFetchConnectedApps;
