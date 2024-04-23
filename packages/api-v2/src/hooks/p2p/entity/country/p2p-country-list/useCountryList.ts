import useQuery from '../../../../../useQuery';
import useAuthorize from '../../../../useAuthorize';

const useCountryList = (payload?: NonNullable<Parameters<typeof useQuery<'p2p_country_list'>>[1]>['payload']) => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('p2p_country_list', {
        payload,
        options: { enabled: isSuccess, refetchOnWindowFocus: false },
    });

    return {
        data: data?.p2p_country_list,
        ...rest,
    };
};

export default useCountryList;
