import useAuthorize from './useAuthorize';
import useMutation from '../useMutation';
import useInvalidateQuery from '../useInvalidateQuery';

/** A custom hook for revoking access of particular app. */
const useRevokeConnectedApps = () => {
    const invalidate = useInvalidateQuery();
    const { isSuccess } = useAuthorize();
    const { mutate, ...rest } = useMutation('revoke_oauth_app', {
        onSuccess: () => {
            invalidate('oauth_apps');
        },
    });
    const revokeMutate = (appId: number) => {
        if (isSuccess) {
            mutate({
                payload: { revoke_oauth_app: appId },
            });
        }
    };
    return {
        /** Function to revoke access of app */
        mutate: revokeMutate,
        ...rest,
    };
};

export default useRevokeConnectedApps;
