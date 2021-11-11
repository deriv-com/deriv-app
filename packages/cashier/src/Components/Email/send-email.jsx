import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, MobileWrapper, Text } from '@deriv/components';
import { isCryptocurrency, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RecentTransaction from 'Components/recent-transaction.jsx';
import EmailSent from './email-sent.jsx';

const SendEmail = ({
    crypto_transactions,
    currency,
    is_email_sent,
    is_resend_clicked,
    resend_timeout,
    recentTransactionOnMount,
    sendVerificationEmail,
}) => {
    React.useEffect(() => {
        recentTransactionOnMount();
    }, [recentTransactionOnMount]);

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
                    <Text
                        line_height='xxl'
                        size={isMobile() ? 'xs' : 's'}
                        weight='bold'
                        as='p'
                        align='center'
                        className='withdraw__header'
                    >
                        <Localize i18n_default_text='Please help us verify your withdrawal request.' />
                    </Text>
                    <Text as='p' align='center' size={isMobile() ? 'xxs' : 's'} className='withdraw__send-email--space'>
                        <Localize i18n_default_text="Hit the button below and we'll send you an email with a link. Click that link to verify your withdrawal request." />
                    </Text>
                    <Text as='p' align='center' size={isMobile() ? 'xxs' : 's'}>
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
                    <MobileWrapper>
                        {isCryptocurrency(currency) && crypto_transactions?.length ? <RecentTransaction /> : null}
                    </MobileWrapper>
                </React.Fragment>
            )}
        </div>
    );
};

SendEmail.propTypes = {
    crypto_transactions: PropTypes.array,
    is_email_sent: PropTypes.bool,
    is_resend_clicked: PropTypes.bool,
    resend_timeout: PropTypes.number,
    recentTransactionOnMount: PropTypes.func,
    sendVerificationEmail: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    is_email_sent: modules.cashier.config.withdraw.verification.is_email_sent,
    is_resend_clicked: modules.cashier.config.withdraw.verification.is_resend_clicked,
    resend_timeout: modules.cashier.config.withdraw.verification.resend_timeout,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    sendVerificationEmail: modules.cashier.sendVerificationEmail,
}))(SendEmail);
