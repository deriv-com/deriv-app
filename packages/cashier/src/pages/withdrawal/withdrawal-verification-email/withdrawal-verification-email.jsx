import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, MobileWrapper, Text } from '@deriv/components';
import { isCryptocurrency, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RecentTransaction from 'Components/recent-transaction';
import VerificationEmail from 'Components/verification-email';
import './withdrawal-verification-email.scss';

const WithdrawalVerificationEmail = ({
    crypto_transactions,
    currency,
    is_email_sent,
    is_resend_clicked,
    resendVerificationEmail,
    recentTransactionOnMount,
    sendVerificationEmail,
    setIsResendClicked,
}) => {
    React.useEffect(() => {
        recentTransactionOnMount();
    }, [recentTransactionOnMount]);

    return (
        <div className='cashier__wrapper'>
            {is_email_sent ? (
                <VerificationEmail
                    is_email_sent={is_email_sent}
                    is_resend_clicked={is_resend_clicked}
                    is_withdrawal
                    resendVerificationEmail={resendVerificationEmail}
                    sendVerificationEmail={sendVerificationEmail}
                    setIsResendClicked={setIsResendClicked}
                />
            ) : (
                <React.Fragment>
                    <Icon icon='IcCashierAuthenticate' className='send-email__icon' size={128} />
                    <Text line_height='xxl' size={isMobile() ? 'xs' : 's'} weight='bold' as='p' align='center'>
                        <Localize i18n_default_text='Please help us verify your withdrawal request.' />
                    </Text>
                    <Text as='p' align='center' size={isMobile() ? 'xxs' : 's'} className='send-email__space'>
                        <Localize i18n_default_text="Hit the button below and we'll send you an email with a link. Click that link to verify your withdrawal request." />
                    </Text>
                    <Text as='p' align='center' size={isMobile() ? 'xxs' : 's'}>
                        <Localize i18n_default_text='This is to protect your account from unauthorised withdrawals.' />
                    </Text>
                    <Button
                        className='send-email__verify-button'
                        has_effect
                        text={localize('Send email')}
                        onClick={sendVerificationEmail}
                        primary
                        large
                    />
                    <MobileWrapper>
                        {isCryptocurrency(currency) && crypto_transactions?.length ? <RecentTransaction /> : null}
                    </MobileWrapper>
                </React.Fragment>
            )}
        </div>
    );
};

WithdrawalVerificationEmail.propTypes = {
    crypto_transactions: PropTypes.array,
    currency: PropTypes.string,
    is_email_sent: PropTypes.bool,
    is_resend_clicked: PropTypes.bool,
    recentTransactionOnMount: PropTypes.func,
    resendVerificationEmail: PropTypes.func,
    sendVerificationEmail: PropTypes.func,
    setIsResendClicked: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    is_email_sent: modules.cashier.withdraw.verification.is_email_sent,
    is_resend_clicked: modules.cashier.withdraw.verification.is_resend_clicked,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    resendVerificationEmail: modules.cashier.withdraw.verification.resendVerificationEmail,
    sendVerificationEmail: modules.cashier.withdraw.verification.sendVerificationEmail,
    setIsResendClicked: modules.cashier.withdraw.verification.setIsResendClicked,
}))(WithdrawalVerificationEmail);
