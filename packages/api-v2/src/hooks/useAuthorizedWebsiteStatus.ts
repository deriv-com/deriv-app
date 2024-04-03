import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook that gets the website_status. */
const useAuthorizedWebsiteStatus = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('website_status', {
        options: {
            enabled: isSuccess,
        },
    });

    return {
        data,
        ...rest,
    };
};

export default useAuthorizedWebsiteStatus;
