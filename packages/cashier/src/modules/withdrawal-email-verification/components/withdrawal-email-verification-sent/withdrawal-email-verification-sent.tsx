import React from 'react';
import { useVerifyEmail } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import EmptyState from '../../../../components/empty-state';
import { WithdrawalEmailVerificationResend } from '../withdrawal-email-verification-resend';
import './withdrawal-email-verification-sent.scss';

type TWithdrawalEmailVerificationSentProps = {
    withdraw_type: Parameters<typeof useVerifyEmail>[0];
};

const WithdrawalEmailVerificationSent = ({ withdraw_type }: TWithdrawalEmailVerificationSentProps) => {
    const { counter, is_counter_running, has_been_sent, send } = useVerifyEmail(withdraw_type);
    const show_resend_email = {
        label: localize("Didn't receive the email?"),
        onClick: send,
        tertiary: true,
    };

    return (
        <div className='withdrawal-email-verification-sent'>
            <EmptyState
                icon='IcEmailSent'
                title={localize("We've sent you an email.")}
                description={localize('Please check your email for the verification link to complete the process.')}
                action={has_been_sent ? undefined : show_resend_email}
            />
            {has_been_sent && (
                <WithdrawalEmailVerificationResend
                    counter={counter}
                    is_counter_running={is_counter_running}
                    send={send}
                />
            )}
        </div>
    );
};

export default WithdrawalEmailVerificationSent;
