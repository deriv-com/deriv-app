import React from 'react';
import { EmptyState } from '@deriv/components';
import { useVerifyEmail } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import EmailVerificationEmptyState from '../../../components/email-verification-empty-state';
import Error from '../../../components/error';
import ErrorStore from '../../../stores/error-store';

const WithdrawalVerificationEmail = observer(() => {
    const verify = useVerifyEmail('payment_withdraw');

    if (verify.error) return <Error error={verify.error as ErrorStore} />;

    if (verify.has_been_sent) return <EmailVerificationEmptyState type={'payment_withdraw'} />;

    return (
        <EmptyState
            icon='IcWithdrawRequestVerification'
            title={localize('Confirm your identity to make a withdrawal.')}
            description={
                <>
                    <Localize i18n_default_text="Hit the button below, and we'll email you a verification link." />
                    <br />
                    <br />
                    <Localize i18n_default_text="This is to confirm that it's you making the withdrawal request." />
                </>
            }
            action={{
                label: localize('Send email'),
                onClick: () => verify.send(),
            }}
        />
    );
});

export default WithdrawalVerificationEmail;
