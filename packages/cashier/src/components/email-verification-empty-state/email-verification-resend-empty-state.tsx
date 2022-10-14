import React from 'react';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';

type TEmailVerificationResendEmptyStateProps = {
    is_counter_running: boolean;
    counter: number;
    resend: () => void;
};

const EmailVerificationResendEmptyState = ({
    is_counter_running,
    counter,
    resend,
}: TEmailVerificationResendEmptyStateProps) => {
    return (
        <EmptyState
            title={localize("Didn't receive the email?")}
            description={localize("Check your spam or junk folder. If it's not there, try resending the email.")}
            action={{
                label: is_counter_running
                    ? localize('Resend email in {{seconds}}s', { seconds: counter })
                    : localize('Resend email'),
                onClick: resend,
                disabled: is_counter_running,
            }}
        />
    );
};

export default EmailVerificationResendEmptyState;
