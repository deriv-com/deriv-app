import React from 'react';
import EmptyState from '../../../../components/empty-state';
import { localize } from '@deriv/translations';

type TWithdrawalEmailVerificationResend = {
    counter: number;
    is_counter_running: boolean;
    send: VoidFunction;
};

const WithdrawalEmailVerificationResend = ({
    counter,
    is_counter_running,
    send,
}: TWithdrawalEmailVerificationResend) => {
    return (
        <EmptyState
            title={localize("Didn't receive the email?")}
            description={localize("Check your spam or junk folder. If it's not there, try resending the email.")}
            action={{
                label: is_counter_running
                    ? localize('Resend email in {{seconds}}s', { seconds: counter })
                    : localize('Resend email'),
                onClick: send,
                disabled: is_counter_running,
            }}
        />
    );
};

export default WithdrawalEmailVerificationResend;
