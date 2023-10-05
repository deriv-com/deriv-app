import React from 'react';
import { useInvalidateQuery, useMutation } from '@deriv/api';

/**
 * A custom hook for revoking access of connected oauth apps.
 */
const useOAuthRevokeConnectedApps = () => {
    const invalidate = useInvalidateQuery();
    const WS = useMutation('revoke_oauth_app', {
        onSuccess: () => {
            invalidate('oauth_apps');
        },
    });

    const revokeOAuthApp = React.useCallback(
        (app_id: number) => {
            WS.mutate({ payload: { revoke_oauth_app: app_id } });
        },
        [WS]
    );

    return {
        revokeOAuthApp,
        ...WS,
    };
};

export default useOAuthRevokeConnectedApps;
