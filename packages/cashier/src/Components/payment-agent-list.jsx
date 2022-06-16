import { PropTypes as MobxPropTypes } from 'mobx-react';
import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Accordion,
    DesktopWrapper,
    Dropdown,
    Loading,
    MobileWrapper,
    SelectNative,
    Tabs,
    Text,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, isMobile, website_name } from '@deriv/shared';
import { connect } from 'Stores/connect';
import PaymentAgentDetails from './payment-agent-details.jsx';
import Error from './Error/error.jsx';
import EmailSent from './Email/email-sent.jsx';
import PaymentAgentWithdrawForm from './Form/payment-agent-withdraw-form.jsx';
import 'Sass/payment-agent-list.scss';

const PaymentAgentList = ({
    error,
    is_email_sent,
    is_loading,
    is_resend_clicked,
    is_payment_agent_withdraw,
    onChangePaymentMethod,
    onMount,
    payment_agent_active_tab_index,
    payment_agent_list,
    resend_timeout,
    resendVerificationEmail,
    selected_bank,
    sendVerificationEmail,
    setActiveTabIndex,
    setIsResendClicked,
    supported_banks,
    verification_code,
}) => {
    React.useEffect(() => {
        onMount();
    }, [onMount]);

    const list_with_default = [
        { text: <Localize i18n_default_text='All payment agents' />, value: 0 },
        ...supported_banks,
    ];

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
                            {is_loading ? (
                                <Loading is_fullscreen={false} />
                            ) : (
                                <React.Fragment>
                                    <Text
                                        as='p'
                                        size='xs'
                                        weight='bold'
                                        color='prominent'
                                        className='payment-agent-list__list-header'
                                    >
                                        <Localize i18n_default_text='Payment agents' />
                                    </Text>
                                    <div className='payment-agent-list__list-line' />
                                    <div className='payment-agent-list__list-selector'>
                                        <Text
                                            as='p'
                                            size={isMobile() ? 'xxs' : 'xs'}
                                            line_height='s'
                                            className='cashier__paragraph'
                                        >
                                            <Localize i18n_default_text='Choose a payment agent and contact them for instructions.' />
                                        </Text>
                                        {supported_banks.length > 1 && (
                                            <div>
                                                <DesktopWrapper>
                                                    <Dropdown
                                                        id='payment_methods'
                                                        className='payment-agent-list__drop-down payment-agent-list__filter'
                                                        classNameDisplay='cashier__drop-down-display payment-agent-list__filter-display'
                                                        classNameDisplaySpan='cashier__drop-down-display-span'
                                                        classNameItems='cashier__drop-down-items'
                                                        list={list_with_default}
                                                        name='payment_methods'
                                                        value={selected_bank}
                                                        onChange={onChangePaymentMethod}
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        name='payment_methods'
                                                        list_items={supported_banks}
                                                        value={selected_bank}
                                                        label={
                                                            selected_bank === 0
                                                                ? localize('All payment agents')
                                                                : localize('Type')
                                                        }
                                                        onChange={e =>
                                                            onChangePaymentMethod({
                                                                target: {
                                                                    name: 'payment_methods',
                                                                    value: e.target.value.toLowerCase(),
                                                                },
                                                            })
                                                        }
                                                        use_text={false}
                                                    />
                                                </MobileWrapper>
                                            </div>
                                        )}
                                    </div>
                                    <Accordion
                                        className='payment-agent-list__accordion'
                                        list={payment_agent_list.map(payment_agent => ({
                                            header: payment_agent.name,
                                            content: (
                                                <PaymentAgentDetails
                                                    payment_agent_email={payment_agent.email}
                                                    payment_agent_phones={toJS(payment_agent.phones)}
                                                    payment_agent_urls={toJS(payment_agent.urls)}
                                                />
                                            ),
                                        }))}
                                    />
                                </React.Fragment>
                            )}
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
    onChangePaymentMethod: PropTypes.func,
    onMount: PropTypes.func,
    payment_agent_active_tab_index: PropTypes.number,
    payment_agent_list: PropTypes.array,
    resend_timeout: PropTypes.number,
    resendVerificationEmail: PropTypes.func,
    selected_bank: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    sendVerificationEmail: PropTypes.func,
    setActiveTabIndex: PropTypes.func,
    setIsResendClicked: PropTypes.func,
    supported_banks: MobxPropTypes.arrayOrObservableArray,
    verification_code: PropTypes.string,
};

export default connect(({ modules }) => ({
    error: modules.cashier.payment_agent.verification.error,
    is_email_sent: modules.cashier.payment_agent.verification.is_email_sent,
    is_loading: modules.cashier.general_store.is_loading,
    is_resend_clicked: modules.cashier.payment_agent.verification.is_resend_clicked,
    onChangePaymentMethod: modules.cashier.payment_agent.onChangePaymentMethod,
    onMount: modules.cashier.payment_agent.onMountPaymentAgentList,
    payment_agent_active_tab_index: modules.cashier.payment_agent.active_tab_index,
    payment_agent_list: modules.cashier.payment_agent.filtered_list,
    resend_timeout: modules.cashier.payment_agent.verification.resend_timeout,
    resendVerificationEmail: modules.cashier.payment_agent.verification.resendVerificationEmail,
    selected_bank: modules.cashier.payment_agent.selected_bank,
    sendVerificationEmail: modules.cashier.payment_agent.verification.sendVerificationEmail,
    setActiveTabIndex: modules.cashier.payment_agent.setActiveTab,
    setIsResendClicked: modules.cashier.payment_agent.verification.setIsResendClicked,
    supported_banks: modules.cashier.payment_agent.supported_banks,
}))(PaymentAgentList);
