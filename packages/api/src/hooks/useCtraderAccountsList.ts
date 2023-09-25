import { useMemo } from 'react';
import useCtraderServiceToken from './useCtraderServiceToken';
import useFetch from '../useFetch';

/** A custom hook that gets the list of created cTrader accounts. */
const useCtraderAccountsList = () => {
    const { data: ctrader_accounts } = useFetch('trading_platform_accounts', {
        payload: { platform: 'ctrader' },
    });
    const { data: token } = useCtraderServiceToken();

    /** Adding neccesary properties to cTrader accounts */
    const modified_ctrader_accounts = useMemo(
        () =>
            ctrader_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                /** The id of the cTrader account */
                id: account.account_id,
                /** The token of the cTrader account */
                token,
            })),
        [ctrader_accounts?.trading_platform_accounts, token]
    );

    return {
        /** List of all created cTrader accounts */
        data: modified_ctrader_accounts,
    };
};

export default useCtraderAccountsList;
