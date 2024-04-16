import useQuery from '../useQuery';
import useActiveAccount from './useActiveAccount';
import useSettings from './useSettings';

/** A custom hook to get paymentagent list */
const usePaymentAgentList = () => {
    const { data: settings } = useSettings();
    const { data: activeAccount } = useActiveAccount();

    const { data, ...rest } = useQuery('paymentagent_list', {
        options: { enabled: Boolean(settings.country_code) },
        payload: { currency: activeAccount?.currency, paymentagent_list: settings.country_code ?? '' },
    });

    return {
        /** Paymentagent list response */
        data: data?.paymentagent_list?.list,
        ...rest,
    };
};

export default usePaymentAgentList;
