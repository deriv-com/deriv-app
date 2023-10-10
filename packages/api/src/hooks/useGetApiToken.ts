import useMutation from '../useMutation';

const useGetApiToken = () => {
    const { data, ...rest } = useMutation('api_token');

    return {
        api_token_data: data,
        ...rest,
    };
};

export default useGetApiToken;
