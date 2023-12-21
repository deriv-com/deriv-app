import useQuery from '../useQuery';
import useSettings from './useSettings';

/** A custom hook that get Service Token for Sendbird. */
const useSendbirdServiceToken = () => {
    const { isSuccess } = useSettings();
    const { data: sendbird_token_data, ...rest } = useQuery('service_token', {
        payload: {
            service: 'sendbird',
        },
        options: {
            enabled: isSuccess,
            staleTime: 604800000, // Sendbird tokens expire 7 days by default
        },
    });

    return {
        /** return the sendbird service token */
        data: {
            ...sendbird_token_data?.service_token?.sendbird,
        },
        ...rest,
    };
};

export default useSendbirdServiceToken;
