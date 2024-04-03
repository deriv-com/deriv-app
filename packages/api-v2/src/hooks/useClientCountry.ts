import { useMemo } from 'react';
import useWebsiteStatus from './useWebsiteStatus';

/** A custom hook that gets the client country. */
const useClientCountry = () => {
    const { data, ...rest } = useWebsiteStatus();

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
