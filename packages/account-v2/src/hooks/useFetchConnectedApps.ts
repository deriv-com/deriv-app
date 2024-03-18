import { useAuthorize, useQuery } from '@deriv/api-v2';

/** A custom hook to get list of all used OAuth applications */
export const useFetchConnectedApps = () => {
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
