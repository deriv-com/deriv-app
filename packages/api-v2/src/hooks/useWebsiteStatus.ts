import useAuthorizedQuery from '../useAuthorizedQuery';

const useWebsiteStatus = () => {
    // pretty much static data, only refresh it when account is added (just in case, probably even then its not needed)
    return useAuthorizedQuery(
        'website_status',
        {},
        {
            staleTime: Infinity,
        },
        false
    );
};

export default useWebsiteStatus;
