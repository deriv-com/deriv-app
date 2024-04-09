import useQuery from '../useQuery';

const useWebsiteStatus = () => {
    const { data, ...rest } = useQuery('website_status');

    return {
        data, 
        ...rest
    };
};

export default useWebsiteStatus;
