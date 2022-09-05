import React from 'react';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import { TEmailVerificationType } from 'Types';
import { useVerifyEmail } from '../../hooks';
import './email-verification-empty-state.scss';

type TProps = {
    type: TEmailVerificationType;
};

const EmailVerificationEmptyState = ({ type }: TProps) => {
    const verify = useVerifyEmail(type);

    const ResendState = () => (
        <EmptyState
            title={localize("Didn't receive the email?")}
            description={localize("Check your spam or junk folder. If it's not there, try resending the email.")}
            action={{
                label: verify.isCounterRunning
                    ? localize('Resend email in {{seconds}}s', { seconds: verify.counter })
                    : localize('Resend email'),
                onClick: verify.send,
                disabled: verify.isCounterRunning,
            }}
        />
    );

    return (
        <div className='email-verification-empty-state'>
            <EmptyState
                icon='IcEmailSent'
                title={localize("We've sent you an email.")}
                description={localize('Please check your email for the verification link to complete the process.')}
                action={
                    verify.hasBeenSent
                        ? undefined
                        : {
                              label: localize("Didn't receive the email?"),
                              onClick: verify.send,
                              tertiary: true,
                          }
                }
            />
            {verify.hasBeenSent && <ResendState />}
        </div>
    );
};

export default EmailVerificationEmptyState;
