import { WS } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { useCallback, useMemo } from 'react';

const useStatement = () => {
    const {
        client: { responseStatement, statement },
    } = useStore();

    // Add additional information to each transaction.
    const has_deposit = useMemo(
        () => statement?.transactions?.some((transaction: any) => transaction.action_type === 'deposit'),
        [statement]
    );

    const updateStatement = useCallback(async () => {
        const res = await WS.statement();
        responseStatement(res);

        return res;
    }, [WS, responseStatement]);

    return { statement, has_deposit, updateStatement };
};

export default useStatement;
