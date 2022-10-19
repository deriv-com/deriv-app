import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Loading, Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import { connect } from 'Stores/connect';
import VerificationEmail from 'Components/verification-email';
import PaymentAgentContainer from '../payment-agent-container';
import PaymentAgentWithdrawalLocked from '../payment-agent-withdrawal-locked';
import PaymentAgentDisclaimer from '../payment-agent-disclaimer';
import SideNote from 'Components/side-note';
import './payment-agent-list.scss';

const PaymentAgentList = ({
    error,
    is_email_sent,
    is_loading,
    is_resend_clicked,
    is_payment_agent_withdraw,
    is_try_withdraw_successful,
    onMount,
    payment_agent_active_tab_index,
    resendVerificationEmail,
    sendVerificationEmail,
    setActiveTabIndex,
    setIsResendClicked,
    setSideNotes,
    verification_code,
}) => {
    React.useEffect(() => {
        onMount();
    }, [onMount]);

    React.useEffect(() => {
        if (payment_agent_active_tab_index && !verification_code) {
            sendVerificationEmail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (typeof setSideNotes === 'function' && !is_loading) {
            const side_notes = [];

            if (!is_try_withdraw_successful) {
                side_notes.push(
                    <SideNote has_title={false} key={0}>
                        <PaymentAgentDisclaimer />
                    </SideNote>
                );
            }

            setSideNotes(side_notes);
        }
    }, [is_loading, is_try_withdraw_successful]);

    return (
        <div className='payment-agent-list cashier__wrapper--align-left'>
            <div
                className={classNames('payment-agent-list__instructions', {
                    'payment-agent-list__instructions-hide-tabs': is_try_withdraw_successful,
                })}
            >
                <Tabs
                    active_index={payment_agent_active_tab_index}
                    className='tabs--desktop'
                    onTabItemClick={setActiveTabIndex}
                    top
                    header_fit_content={isDesktop()}
                >
                    <div label={localize('Deposit')}>
                        {is_loading ? <Loading is_fullscreen={false} /> : <PaymentAgentContainer is_deposit />}
                    </div>
                    <div label={localize('Withdrawal')}>
                        {error?.code ? (
                            <PaymentAgentWithdrawalLocked error={error} />
                        ) : (
                            <div>
                                {is_email_sent ? (
                                    <div className='cashier__wrapper'>
                                        <VerificationEmail
                                            is_email_sent={is_email_sent}
                                            is_resend_clicked={is_resend_clicked}
                                            resendVerificationEmail={resendVerificationEmail}
                                            sendVerificationEmail={sendVerificationEmail}
                                            setIsResendClicked={setIsResendClicked}
                                        />
                                    </div>
                                ) : (
                                    (verification_code || is_payment_agent_withdraw) && (
                                        <PaymentAgentContainer verification_code={verification_code} />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

PaymentAgentList.propTypes = {
    error: PropTypes.object,
    is_email_sent: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_resend_clicked: PropTypes.bool,
    is_payment_agent_withdraw: PropTypes.bool,
    is_try_withdraw_successful: PropTypes.bool,
    onMount: PropTypes.func,
    payment_agent_active_tab_index: PropTypes.number,
    resendVerificationEmail: PropTypes.func,
    sendVerificationEmail: PropTypes.func,
    setActiveTabIndex: PropTypes.func,
    setIsResendClicked: PropTypes.func,
    setSideNotes: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ modules }) => ({
    error: modules.cashier.payment_agent.verification.error,
    is_email_sent: modules.cashier.payment_agent.verification.is_email_sent,
    is_loading: modules.cashier.general_store.is_loading,
    is_resend_clicked: modules.cashier.payment_agent.verification.is_resend_clicked,
    is_try_withdraw_successful: modules.cashier.payment_agent.is_try_withdraw_successful,
    onMount: modules.cashier.payment_agent.onMountPaymentAgentList,
    payment_agent_active_tab_index: modules.cashier.payment_agent.active_tab_index,
    resendVerificationEmail: modules.cashier.payment_agent.verification.resendVerificationEmail,
    sendVerificationEmail: modules.cashier.payment_agent.verification.sendVerificationEmail,
    setActiveTabIndex: modules.cashier.payment_agent.setActiveTab,
    setIsResendClicked: modules.cashier.payment_agent.verification.setIsResendClicked,
}))(PaymentAgentList);
