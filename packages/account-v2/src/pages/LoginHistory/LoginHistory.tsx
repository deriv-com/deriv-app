import React from 'react';
import { useLoginHistory } from '@deriv/api-v2';
import { Loader, useDevice } from '@deriv-com/ui';
import { LoginHistoryTable, LoginHistoryTableCard } from '../../containers';

export const LoginHistory = () => {
    const { isLoading, loginHistory } = useLoginHistory(50);
    const { isMobile } = useDevice();
    if (isLoading) return <Loader />;

    if (loginHistory?.length) {
        if (!isMobile) return <LoginHistoryTable loginHistory={loginHistory} />;
        return <LoginHistoryTableCard loginHistory={loginHistory} />;
    }
};
