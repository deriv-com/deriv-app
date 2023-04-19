import React from 'react';
import { useVerifyEmail } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import EmailVerificationResendEmptyState from './email-verification-resend-empty-state';
import './email-verification-empty-state.scss';

type TEmailVerificationEmptyStateProps = {
    type: Parameters<typeof useVerifyEmail>[0];
};

const EmailVerificationEmptyState = ({ type }: TEmailVerificationEmptyStateProps) => {
    const verify = useVerifyEmail(type);

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
                action={verify.has_been_sent ? undefined : action}
            />
            {verify.has_been_sent && (
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
