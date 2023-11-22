import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook that gets the list of created cTrader accounts. */
const useCtraderAccountsList = () => {
    const { isSuccess } = useAuthorize();
    const { data: ctrader_accounts, ...rest } = useQuery('trading_platform_accounts', {
        payload: { platform: 'ctrader' },
        options: { enabled: isSuccess },
    });

    /** Adding neccesary properties to cTrader accounts */
    const modified_ctrader_accounts = useMemo(
        () =>
            ctrader_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                /** The id of the cTrader account */
                id: account.account_id,
                /** indicating whether the account is a virtual-money account. */
                is_virtual: account.account_type === 'demo',
            })),
        [ctrader_accounts?.trading_platform_accounts]
    );

    return {
        /** List of all created cTrader accounts */
        data: modified_ctrader_accounts,
        ...rest,
    };
};

export default useCtraderAccountsList;
