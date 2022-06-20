import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, Dropdown, MobileWrapper, SelectNative, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import PaymentAgentCard from '../payment-agent-card';
import PaymentAgentWithdrawConfirm from '../payment-agent-withdraw-confirm';
import PaymentAgentReceipt from '../payment-agent-receipt';

const PaymentAgentDepositWithdrawContainer = ({
    is_deposit,
    is_try_withdraw_successful,
    is_withdraw_successful,
    onChangePaymentMethod,
    payment_agent_list,
    resetPaymentAgent,
    selected_bank,
    supported_banks,
    verification_code,
}) => {
    React.useEffect(() => {
        return () => {
            if (!is_deposit) {
                resetPaymentAgent();
            }
        };
    }, [resetPaymentAgent]);

    const list_with_default = [
        { text: <Localize i18n_default_text='All payment methods' />, value: 0 },
        ...supported_banks,
    ];

    if (is_try_withdraw_successful) {
        return <PaymentAgentWithdrawConfirm verification_code={verification_code} />;
    }

    if (is_withdraw_successful) {
        return <PaymentAgentReceipt />;
    }

    return (
        <React.Fragment>
            <div className='payment-agent-list__list-header'>
                {is_deposit ? (
                    <Text as='p' line_height='s' size='xs'>
                        <Localize i18n_default_text='Contact your preferred payment agent for payment instructions and make your deposit.' />
                    </Text>
                ) : (
                    <Text as='p' line_height='s' size='xs'>
                        <Localize i18n_default_text='Choose your preferred payment agent and enter your withdrawal amount. If your payment agent is not listed, search for them using their account number.' />
                    </Text>
                )}
            </div>
            <div className='payment-agent-list__list-selector'>
                <Text as='p' size={isMobile() ? 'xxs' : 'xs'} line_height='s' className='cashier__paragraph'>
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
                                value={selected_bank === 0 ? '' : selected_bank.toString()}
                                label={selected_bank === 0 ? localize('All payment methods') : localize('Type')}
                                onChange={e =>
                                    onChangePaymentMethod({
                                        target: {
                                            name: 'payment_methods',
                                            value: e.target.value ? e.target.value.toLowerCase() : 0,
                                        },
                                    })
                                }
                                use_text={false}
                            />
                        </MobileWrapper>
                    </div>
                )}
            </div>
            {payment_agent_list.map((payment_agent, idx) => {
                return <PaymentAgentCard key={idx} is_deposit={is_deposit} payment_agent={payment_agent} />;
            })}
        </React.Fragment>
    );
};

PaymentAgentDepositWithdrawContainer.propTypes = {
    is_deposit: PropTypes.bool,
    is_try_withdraw_successful: PropTypes.bool,
    is_withdraw_successful: PropTypes.bool,
    onChangePaymentMethod: PropTypes.func,
    payment_agent_list: PropTypes.array,
    resetPaymentAgent: PropTypes.func,
    selected_bank: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    supported_banks: MobxPropTypes.arrayOrObservableArray,
    verification_code: PropTypes.string,
};

export default connect(({ modules }) => ({
    is_try_withdraw_successful: modules.cashier.payment_agent.is_try_withdraw_successful,
    is_withdraw_successful: modules.cashier.payment_agent.is_withdraw_successful,
    onChangePaymentMethod: modules.cashier.payment_agent.onChangePaymentMethod,
    payment_agent_list: modules.cashier.payment_agent.filtered_list,
    resetPaymentAgent: modules.cashier.payment_agent.resetPaymentAgent,
    selected_bank: modules.cashier.payment_agent.selected_bank,
    supported_banks: modules.cashier.payment_agent.supported_banks,
}))(PaymentAgentDepositWithdrawContainer);
