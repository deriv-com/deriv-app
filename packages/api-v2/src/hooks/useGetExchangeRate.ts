import useQuery from '../useQuery';

type TProps = Required<Parameters<typeof useQuery<'exchange_rates'>>[1]>['payload'];

const useGetExchangeRate = ({ base_currency, loginid, target_currency }: TProps) => {
    const { data, ...rest } = useQuery('exchange_rates', { payload: { base_currency, loginid, target_currency } });

    return {
        /** The exchange rates response */
        data: data?.exchange_rates,
        ...rest,
    };
};

export default useGetExchangeRate;
