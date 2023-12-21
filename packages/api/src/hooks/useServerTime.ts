import useQuery from '../useQuery';

const useServerTime = () => {
    const { data, ...rest } = useQuery('time');

    return {
        data,
        ...rest,
    };
};

export default useServerTime;
