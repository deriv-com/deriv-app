import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook that gets the list of created Deriv X accounts. */
const useDxtradeAccountsList = () => {
    const { data: authorize_data, isSuccess } = useAuthorize();
    const { data: dxtrade_accounts } = useQuery('trading_platform_accounts', {
        payload: { platform: 'dxtrade' },
        options: { enabled: isSuccess },
    });

    /** Adding necessary properties to Deriv X accounts */
    const modified_dxtrade_accounts = useMemo(
        () =>
            dxtrade_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                display_balance: Intl.NumberFormat(authorize_data?.preferred_language || 'en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    minimumIntegerDigits: 1,
                }).format(account?.balance || 0),
            })),
        [authorize_data?.preferred_language, dxtrade_accounts?.trading_platform_accounts]
    );

    return {
        /** List of all created Deriv X accounts */
        data: modified_dxtrade_accounts,
    };
};

export default useDxtradeAccountsList;
