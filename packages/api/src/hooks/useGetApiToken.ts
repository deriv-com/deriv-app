import useFetch from '../useFetch';

const useGetApiToken = () => {
    const { data, ...rest } = useFetch('api_token');

    return {
        api_token_data: data,
        ...rest,
    };
};

export default useGetApiToken;
