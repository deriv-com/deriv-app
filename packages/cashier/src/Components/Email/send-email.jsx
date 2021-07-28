import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import EmailSent from './email-sent.jsx';

const SendEmail = ({ is_email_sent, is_resend_clicked, resend_timeout, sendVerificationEmail }) => {
    return (
        <div className='cashier__wrapper'>
            {is_email_sent ? (
                <EmailSent
                    is_email_sent={is_email_sent}
                    is_resend_clicked={is_resend_clicked}
                    resend_timeout={resend_timeout}
                />
            ) : (
                <React.Fragment>
                    <Icon icon='IcCashierAuthenticate' className='withdraw__icon' size={128} />
                    <Text line_height='xxl' weight='bold' as='p' align='center' className='withdraw__header'>
                        <Localize i18n_default_text='Please help us verify your withdrawal request.' />
                    </Text>
                    <Text as='p' align='center'>
                        <Localize i18n_default_text="Hit the button bellow and we'll send you an email with a link. Click that" />
                    </Text>
                    <Text line_height='xxl' as='p' align='center'>
                        <Localize i18n_default_text='link to verify your withdrawal request.' />
                    </Text>
                    <Text as='p' align='center'>
                        <Localize i18n_default_text='This is to protect your account from unauthorised withdrawals.' />
                    </Text>
                    <Button
                        className='withdraw__verify-button'
                        has_effect
                        text={localize('Send email')}
                        onClick={sendVerificationEmail}
                        primary
                        large
                    />
                </React.Fragment>
            )}
        </div>
    );
};

SendEmail.propTypes = {
    is_email_sent: PropTypes.bool,
    is_resend_clicked: PropTypes.bool,
    resend_timeout: PropTypes.number,
    sendVerificationEmail: PropTypes.func,
};

export default connect(({ modules }) => ({
    is_email_sent: modules.cashier.config.withdraw.verification.is_email_sent,
    is_resend_clicked: modules.cashier.config.withdraw.verification.is_resend_clicked,
    resend_timeout: modules.cashier.config.withdraw.verification.resend_timeout,
    sendVerificationEmail: modules.cashier.sendVerificationEmail,
}))(SendEmail);
