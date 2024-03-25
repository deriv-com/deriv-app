import React from 'react';
import { useLoginHistoryData } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { LoginHistoryTable } from '../../containers/LoginHistoryTable/LoginHistoryTable';

export const LoginHistory = () => {
    const { isLoading, loginHistory } = useLoginHistoryData(50);

    return isLoading ? <Loader /> : <LoginHistoryTable loginHistory={loginHistory} />;
};
