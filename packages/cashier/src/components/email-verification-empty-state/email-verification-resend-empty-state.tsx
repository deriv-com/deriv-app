import React from 'react';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';

type TEmailVerificationResendEmptyStateProps = {
    isCounterRunning: boolean;
    counter: number;
    resend: () => void;
};

const EmailVerificationResendEmptyState = ({
    isCounterRunning,
    counter,
    resend,
}: TEmailVerificationResendEmptyStateProps) => {
    return (
        <EmptyState
            title={localize("Didn't receive the email?")}
            description={localize("Check your spam or junk folder. If it's not there, try resending the email.")}
            action={{
                label: isCounterRunning
                    ? localize('Resend email in {{seconds}}s', { seconds: counter })
                    : localize('Resend email'),
                onClick: resend,
                disabled: isCounterRunning,
            }}
        />
    );
};

export default EmailVerificationResendEmptyState;
