import useMutation from '../useMutation';

/** Hook to get the service token for using 3rd party SDK */
const useServiceToken = () => {
    const { data, ...rest } = useMutation('service_token');

    /** Service token response */
    return {
        data,
        ...rest,
    };
};

export default useServiceToken;
