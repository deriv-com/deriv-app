import React from 'react';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';

type TProps = {
    error: TSocketError<'cashier'>['error'];
    resetError: VoidFunction;
    setResendEmail: React.Dispatch<React.SetStateAction<boolean>>;
};

const WithdrawalErrorScreen: React.FC<TProps> = ({ error, resetError, setResendEmail }) => {
    if (error.code === 'InvalidToken') {
        return (
            <WalletsErrorScreen
                buttonText='Resend email'
                buttonVariant='contained'
                message='The verification link you used is invalid or expired. Please request for a new one.'
                onClick={() => {
                    resetError();
                    setResendEmail(true);
                }}
                title='Email verification failed'
            />
        );
    }

    return (
        <WalletsErrorScreen
            buttonText='OK'
            buttonVariant='contained'
            message={error.message}
            onClick={resetError}
            title='Error'
        />
    );
};

export default WithdrawalErrorScreen;
