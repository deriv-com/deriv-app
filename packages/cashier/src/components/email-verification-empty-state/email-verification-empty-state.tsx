import React from 'react';
import { useVerifyEmail } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import EmailVerificationResendEmptyState from './email-verification-resend-empty-state';
import './email-verification-empty-state.scss';

type TEmailVerificationEmptyStateProps = {
    verify: ReturnType<typeof useVerifyEmail>;
};

const EmailVerificationEmptyState = ({ verify }: TEmailVerificationEmptyStateProps) => {
    const action = {
        label: localize("Didn't receive the email?"),
        onClick: verify.send,
        tertiary: true,
    };

    return (
        <div className='email-verification-empty-state'>
            <EmptyState
                icon='IcEmailSent'
                title={localize("We've sent you an email.")}
                description={localize('Please check your email for the verification link to complete the process.')}
                action={verify.sent_count > 1 ? undefined : action}
            />
            {verify.sent_count > 1 && (
                <EmailVerificationResendEmptyState
                    is_counter_running={verify.is_counter_running}
                    counter={verify.counter}
                    resend={verify.send}
                />
            )}
        </div>
    );
};

export default EmailVerificationEmptyState;
