import PropTypes from 'prop-types';
import React from 'react';
import { Loading, Tabs, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, isMobile, website_name } from '@deriv/shared';
import { connect } from 'Stores/connect';
import Error from './Error/error.jsx';
import EmailSent from './Email/email-sent.jsx';
import PaymentAgentDeposit from './Form/payment-agent-deposit.jsx';
import PaymentAgentWithdrawForm from './Form/payment-agent-withdraw-form.jsx';
import 'Sass/payment-agent-list.scss';

const PaymentAgentList = ({
    error,
    is_email_sent,
    is_loading,
    is_resend_clicked,
    is_payment_agent_withdraw,
    onMount,
    payment_agent_active_tab_index,
    resend_timeout,
    resendVerificationEmail,
    sendVerificationEmail,
    setActiveTabIndex,
    setIsResendClicked,
    verification_code,
}) => {
    React.useEffect(() => {
        onMount();
    }, [onMount]);

    return (
        <div className='cashier__wrapper--align-left cashier__wrapper-padding'>
            <React.Fragment>
                <Text as='p' line_height='s' size={isMobile() ? 'xxs' : 'xs'} className='cashier__paragraph'>
                    <Localize
                        i18n_default_text='A payment agent is authorised to process deposits and withdrawals for you if your local payment methods or currencies are not supported on {{website_name}}.'
                        values={{ website_name }}
                    />
                </Text>
                <div className='payment-agent-list__instructions'>
                    <Tabs
                        active_index={payment_agent_active_tab_index}
                        className='tabs--desktop'
                        onTabItemClick={setActiveTabIndex}
                        top
                        header_fit_content={isDesktop()}
                    >
                        <div label={localize('Deposit')}>
                            {is_loading ? <Loading is_fullscreen={false} /> : <PaymentAgentDeposit />}
                            <div className='payment-agent-list__disclaimer'>
                                <Text size='xs' lh='s' weight='bold' className='cashier__text'>
                                    <Localize i18n_default_text='DISCLAIMER' />
                                </Text>
                                :&nbsp;
                                <Text size='xxs'>
                                    <Localize
                                        i18n_default_text='{{website_name}} is not affiliated with any Payment Agent. Customers deal with Payment Agents at their sole risk. Customers are advised to check the credentials of Payment Agents, and check the accuracy of any information about Payments Agents (on Deriv or elsewhere) before transferring funds.'
                                        values={{ website_name }}
                                    />
                                </Text>
                            </div>
                        </div>
                        <div label={localize('Withdrawal')}>
                            {error?.code && !!error?.onClickButton ? (
                                <Error error={error} />
                            ) : (
                                <div>
                                    {is_email_sent ? (
                                        <div className='cashier__wrapper'>
                                            <EmailSent
                                                is_email_sent={is_email_sent}
                                                is_resend_clicked={is_resend_clicked}
                                                resend_timeout={resend_timeout}
                                                resendVerificationEmail={resendVerificationEmail}
                                                sendVerificationEmail={sendVerificationEmail}
                                                setIsResendClicked={setIsResendClicked}
                                            />
                                        </div>
                                    ) : (
                                        (verification_code || is_payment_agent_withdraw) && (
                                            <PaymentAgentWithdrawForm verification_code={verification_code} />
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </Tabs>
                </div>
            </React.Fragment>
        </div>
    );
};

PaymentAgentList.propTypes = {
    error: PropTypes.object,
    is_email_sent: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_resend_clicked: PropTypes.bool,
    is_payment_agent_withdraw: PropTypes.bool,
    onMount: PropTypes.func,
    payment_agent_active_tab_index: PropTypes.number,
    resend_timeout: PropTypes.number,
    resendVerificationEmail: PropTypes.func,
    sendVerificationEmail: PropTypes.func,
    setActiveTabIndex: PropTypes.func,
    setIsResendClicked: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ modules }) => ({
    error: modules.cashier.payment_agent.verification.error,
    is_email_sent: modules.cashier.payment_agent.verification.is_email_sent,
    is_loading: modules.cashier.general_store.is_loading,
    is_resend_clicked: modules.cashier.payment_agent.verification.is_resend_clicked,
    onMount: modules.cashier.payment_agent.onMountPaymentAgentList,
    payment_agent_active_tab_index: modules.cashier.payment_agent.active_tab_index,
    resend_timeout: modules.cashier.payment_agent.verification.resend_timeout,
    resendVerificationEmail: modules.cashier.payment_agent.verification.resendVerificationEmail,
    sendVerificationEmail: modules.cashier.payment_agent.verification.sendVerificationEmail,
    setActiveTabIndex: modules.cashier.payment_agent.setActiveTab,
    setIsResendClicked: modules.cashier.payment_agent.verification.setIsResendClicked,
}))(PaymentAgentList);
