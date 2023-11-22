import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';
import { displayMoney } from '../utils';

/** A custom hook that gets the list of created Deriv X accounts. */
const useDxtradeAccountsList = () => {
    const { data: authorize_data, isSuccess } = useAuthorize();
    const { data: dxtrade_accounts, ...rest } = useQuery('trading_platform_accounts', {
        payload: { platform: 'dxtrade' },
        options: { enabled: isSuccess },
    });

    /** Adding necessary properties to Deriv X accounts */
    const modified_dxtrade_accounts = useMemo(
        () =>
            dxtrade_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                /** The balance of the account in currency format. */
                display_balance: displayMoney(account?.balance || 0, account?.currency || 'USD', {
                    preferred_language: authorize_data?.preferred_language,
                }),
                /** indicating whether the account is a virtual-money account. */
                is_virtual: account.account_type === 'demo',
            })),
        [authorize_data?.preferred_language, dxtrade_accounts?.trading_platform_accounts]
    );

    return {
        /** List of all created Deriv X accounts */
        data: modified_dxtrade_accounts,
        ...rest,
    };
};

export default useDxtradeAccountsList;
