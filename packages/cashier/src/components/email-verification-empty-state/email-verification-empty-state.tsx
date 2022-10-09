import React from 'react';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import { useVerifyEmail } from '../../hooks';
import { TEmailVerificationType } from '../../hooks/useVerifyEmail';
import EmailVerificationResendEmptyState from './email-verification-resend-empty-state';
import './email-verification-empty-state.scss';

type TProps = {
    type: TEmailVerificationType;
};

const EmailVerificationEmptyState = ({ type }: TProps) => {
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
                    isCounterRunning={verify.is_counter_running}
                    counter={verify.counter}
                    resend={verify.send}
                />
            )}
        </div>
    );
};

export default EmailVerificationEmptyState;
