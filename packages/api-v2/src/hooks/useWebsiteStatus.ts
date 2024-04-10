import useAuthorizedQuery from '../useAuthorizedQuery';

const useWebsiteStatus = () => {
    // pretty much static data, only refresh it when account is added (just in case, probably even then its not needed)
    return useAuthorizedQuery(
        'website_status',
        {},
        {
            staleTime: 10 * 60 * 1000,
        },
        false
    );
};

export default useWebsiteStatus;
