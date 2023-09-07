import { useMemo } from 'react';
import useRequest from '../useRequest';

/** A custom hook that change the Trading Platform Investor Password. */
const useTradingPlatformInvestorPasswordChange = () => {
    const { data, ...rest } = useRequest('trading_platform_investor_password_change');

    // Add additional information to the the Trading Platform Investor Password Change response.
    const modified_data = useMemo(() => {
        if (!data) return undefined;

        return { ...data };
    }, [data]);

    return {
        /** The response and the mutation of the Trading Platform Investor Password Change API request */
        data: modified_data,
        ...rest,
    };
};

export default useTradingPlatformInvestorPasswordChange;
