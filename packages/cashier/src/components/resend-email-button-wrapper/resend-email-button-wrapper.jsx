import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const ResendEmailButtonWrapper = ({ resend_timeout, resendVerificationEmail }) => (
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

ResendEmailButtonWrapper.propTypes = {
    is_withdrawal: PropTypes.bool,
    resend_timeout: PropTypes.number,
    resendVerificationEmail: PropTypes.func,
};

export default connect(({ modules }, props) => ({
    resend_timeout: props.is_withdrawal
        ? modules.cashier.withdraw.verification.resend_timeout
        : modules.cashier.payment_agent.verification.resend_timeout,
}))(ResendEmailButtonWrapper);
