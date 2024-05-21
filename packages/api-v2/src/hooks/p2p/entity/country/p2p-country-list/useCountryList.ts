import useQuery from '../../../../../useQuery';
import useAuthorize from '../../../../useAuthorize';

/**
 * A custom hook that returns an object containing the list of countries available for P2P trading.
 *
 * For returning details of a specific country, the country code can be passed in the payload.
 * @example: useCountryList({ country: 'id' })
 *
 */

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
