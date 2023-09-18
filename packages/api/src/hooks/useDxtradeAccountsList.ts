import { useMemo } from 'react';
import useQuery from '../useQuery';

/** A custom hook that gets the list of created Deriv X accounts. */
const useDxtradeAccountsList = () => {
    const { data: dxtrade_accounts } = useQuery('trading_platform_accounts', {
        payload: { platform: 'dxtrade' },
    });

    /** Adding neccesary properties to Deriv X accounts */
    const modified_dxtrade_accounts = useMemo(
        () =>
            dxtrade_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                loginid: account.account_id,
            })),
        [dxtrade_accounts?.trading_platform_accounts]
    );

    return {
        /** List of all created Deriv X accounts */
        data: modified_dxtrade_accounts,
    };
};

export default useDxtradeAccountsList;
