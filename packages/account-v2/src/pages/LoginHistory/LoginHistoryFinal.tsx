import React from 'react';
import { useLoginHistoryData } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { LoginHistoryTable } from './LoginHistoryTable';

// type TLoginData = { id: number; date: string; action: string; browser: string; ip: string; status: string }[];

export const LoginHistoryFinal = () => {
    const { isLoading, loginHistory } = useLoginHistoryData(50);

    return isLoading ? (
        <Loader />
    ) : (
        <div>
            <LoginHistoryTable loginHistory={loginHistory} />
        </div>
    );
};
