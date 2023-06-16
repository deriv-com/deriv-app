import React from 'react';
import { useVerifyEmail } from '@deriv/hooks';
import Error from '../../components/error';
import WithdrawalEmailVerificationEmptyState from './components/withdrawal-email-verification-empty-state/withdrawal-email-verification-empty-state';
import WithdrawalEmailVerificationSent from './components/withdrawal-email-verification-sent/withdrawal-email-verification-sent';
import ErrorStore from '../../stores/error-store';

type TWithdrawalEmailVerificationProps = {
    withdraw_type: Parameters<typeof useVerifyEmail>[0];
};

const WithdrawalEmailVerification = ({ withdraw_type }: TWithdrawalEmailVerificationProps) => {
    const { error, has_been_sent, send } = useVerifyEmail(withdraw_type);

    if (error) return <Error error={error as ErrorStore} />;

    if (has_been_sent) return <WithdrawalEmailVerificationSent withdraw_type={withdraw_type} />;

    return <WithdrawalEmailVerificationEmptyState send={send} />;
};

export default WithdrawalEmailVerification;
