import { useMemo } from 'react';
import useCTraderServiceToken from './useCTraderServiceToken';
import useFetch from '../useFetch';

/** A custom hook that gets the list of created cTrader accounts. */
const useCTraderAccountsList = () => {
    const { data: ctrader_accounts } = useFetch('trading_platform_accounts', {
        payload: { platform: 'ctrader' },
    });
    const { data: token } = useCTraderServiceToken();

    /** Adding neccesary properties to cTrader accounts */
    const modified_ctrader_accounts = useMemo(
        () =>
            ctrader_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                loginid: account.account_id,
                token,
            })),
        [ctrader_accounts?.trading_platform_accounts, token]
    );

    return {
        /** List of all created cTrader accounts */
        data: modified_ctrader_accounts,
    };
};

export default useCTraderAccountsList;
