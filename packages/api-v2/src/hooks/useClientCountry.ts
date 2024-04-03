import { useMemo } from 'react';
import useAuthorizedWebsiteStatus from './useAuthorizedWebsiteStatus';

/** A custom hook that gets the client country. */
const useClientCountry = () => {
    const { data, ...rest } = useAuthorizedWebsiteStatus();

    /** Modify the client country. */
    const modified_client_country = useMemo(() => {
        return data?.website_status?.clients_country;
    }, [data]);

    return {
        /** The client's country */
        data: modified_client_country,
        ...rest,
    };
};

export default useClientCountry;
