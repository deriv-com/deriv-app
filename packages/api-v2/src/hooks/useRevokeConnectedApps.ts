import useAuthorize from './useAuthorize';
import useMutation from '../useMutation';

/** A custom hook for revoking access of particular app. */
const useRevokeConnectedApps = () => {
    const { isSuccess } = useAuthorize();
    const { mutate, ...rest } = useMutation('revoke_oauth_app');
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
