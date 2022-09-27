import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { TRootStore } from 'Types';

type TResetEmailButtonWrapperProps = {
    is_withdrawal: boolean;
    resend_timeout: number;
    resendVerificationEmail: () => void;
};

const ResendEmailButtonWrapper = ({ resend_timeout, resendVerificationEmail }: TResetEmailButtonWrapperProps) => (
    <Button
        className='verification-email__resend-button'
        classNameSpan='verification-email__resend-button-text'
        is_disabled={resend_timeout < 60}
        has_effect
        text={
            resend_timeout < 60
                ? localize('Resend email in {{seconds}}s', {
                      seconds: resend_timeout,
                  })
                : localize('Resend email')
        }
        onClick={resendVerificationEmail}
        primary
        large
    />
);

export default connect(({ modules }: TRootStore, props: TResetEmailButtonWrapperProps) => ({
    resend_timeout: props.is_withdrawal
        ? modules.cashier.withdraw.verification.resend_timeout
        : modules.cashier.payment_agent.verification.resend_timeout,
}))(ResendEmailButtonWrapper);
