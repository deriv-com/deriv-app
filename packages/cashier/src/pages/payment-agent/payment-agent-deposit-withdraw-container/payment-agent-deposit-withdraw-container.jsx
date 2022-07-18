import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, Dropdown, Icon, Loading, MobileWrapper, SelectNative, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import PaymentAgentCard from '../payment-agent-card';
import PaymentAgentDisclaimer from '../payment-agent-disclaimer';
import PaymentAgentSearchBox from '../payment-agent-search-box';

const PaymentAgentSearchWarning = () => {
    return (
        <div className='payment-agent-list__search-warning cashier__wrapper--align-center'>
            <Icon icon='IcCashierSearch' size={64} />
            <Text as='p' line_height='m' size='xs' weight='bold'>
                <Localize i18n_default_text='No payment agents found for your search' />
            </Text>
            <Text as='p' line_height='m' size='xs'>
                <Localize i18n_default_text='Try changing your search criteria.' />
            </Text>
        </div>
    );
};

const PaymentAgentDepositWithdrawContainer = ({
    has_payment_agent_search_warning,
    is_dark_mode_on,
    is_deposit,
    is_search_loading,
    onChangePaymentMethod,
    payment_agent_list,
    selected_bank,
    supported_banks,
}) => {
    const list_with_default = [
        { text: <Localize i18n_default_text='All payment methods' />, value: 0 },
        ...supported_banks,
    ];

    React.useEffect(() => {
        return () => {
            onChangePaymentMethod({ target: { value: '0' } });
        };
    }, [onChangePaymentMethod]);

    return (
        <React.Fragment>
            {!has_payment_agent_search_warning && (
                <MobileWrapper>
                    <PaymentAgentDisclaimer />
                </MobileWrapper>
            )}
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
                <PaymentAgentSearchBox />
                {supported_banks.length > 1 && (
                    <React.Fragment>
                        <DesktopWrapper>
                            <Dropdown
                                id='payment_methods'
                                classNameItems='cashier__drop-down-items'
                                list={list_with_default}
                                name='payment_methods'
                                value={selected_bank}
                                onChange={onChangePaymentMethod}
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <SelectNative
                                placeholder={localize('All payment methods')}
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
                    </React.Fragment>
                )}
            </div>
            {is_search_loading ? (
                <Loading is_fullscreen={false} className='payment-agent-list__search-loader' />
            ) : (
                <React.Fragment>
                    {has_payment_agent_search_warning ? (
                        <PaymentAgentSearchWarning />
                    ) : (
                        payment_agent_list.map((payment_agent, idx) => {
                            return (
                                <PaymentAgentCard
                                    key={idx}
                                    is_dark_mode_on={is_dark_mode_on}
                                    is_deposit={is_deposit}
                                    payment_agent={payment_agent}
                                />
                            );
                        })
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

PaymentAgentDepositWithdrawContainer.propTypes = {
    has_payment_agent_search_warning: PropTypes.bool,
    is_dark_mode_on: PropTypes.bool,
    is_deposit: PropTypes.bool,
    is_search_loading: PropTypes.bool,
    onChangePaymentMethod: PropTypes.func,
    payment_agent_list: PropTypes.array,
    selected_bank: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    supported_banks: MobxPropTypes.arrayOrObservableArray,
};

export default connect(({ modules, ui }) => ({
    has_payment_agent_search_warning: modules.cashier.payment_agent.has_payment_agent_search_warning,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_search_loading: modules.cashier.payment_agent.is_search_loading,
    onChangePaymentMethod: modules.cashier.payment_agent.onChangePaymentMethod,
    payment_agent_list: modules.cashier.payment_agent.filtered_list,
    selected_bank: modules.cashier.payment_agent.selected_bank,
    supported_banks: modules.cashier.payment_agent.supported_banks,
}))(PaymentAgentDepositWithdrawContainer);
