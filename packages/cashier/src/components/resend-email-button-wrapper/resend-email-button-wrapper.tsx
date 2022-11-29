import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';

type TResetEmailButtonWrapperProps = {
    is_withdrawal: boolean;
    resendVerificationEmail: () => void;
};

const ResendEmailButtonWrapper = ({ is_withdrawal, resendVerificationEmail }: TResetEmailButtonWrapperProps) => {
    const {
        modules: {
            cashier: { withdraw, payment_agent },
        },
    } = useStore();
    const {
        verification: { resend_timeout },
    } = is_withdrawal ? withdraw : payment_agent;

    return (
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
};

export default observer(ResendEmailButtonWrapper);
