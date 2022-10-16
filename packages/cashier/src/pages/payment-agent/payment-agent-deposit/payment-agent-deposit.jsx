import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';
import { Accordion, DesktopWrapper, Dropdown, MobileWrapper, SelectNative, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import PaymentAgentDetails from '../payment-agent-details';

const PaymentAgentDeposit = ({ onChangePaymentMethod, payment_agent_list, selected_bank, supported_banks }) => {
    const list_with_default = [
        { text: <Localize i18n_default_text='All payment agents' />, value: 0 },
        ...supported_banks,
    ];

    React.useEffect(() => {
        return () => {
            onChangePaymentMethod({ target: { value: '0' } });
        };
    }, [onChangePaymentMethod]);

    return (
        <React.Fragment>
            <div className='payment-agent-list__list-header'>
                <Text as='p' size='xs' weight='bold' color='prominent' className='payment-agent-list__list-header-text'>
                    <Localize i18n_default_text='Payment agents' />
                </Text>
                <div className='payment-agent-list__list-header-line' />
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
                                placeholder={localize('All payment agents')}
                                name='payment_methods'
                                list_items={supported_banks}
                                value={selected_bank === 0 ? '' : selected_bank.toString()}
                                label={selected_bank === 0 ? localize('All payment agents') : localize('Type')}
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
    );
};

PaymentAgentDeposit.propTypes = {
    onChangePaymentMethod: PropTypes.func,
    payment_agent_list: PropTypes.array,
    selected_bank: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    supported_banks: PropTypes.any,
};

export default connect(({ modules }) => ({
    onChangePaymentMethod: modules.cashier.payment_agent.onChangePaymentMethod,
    payment_agent_list: modules.cashier.payment_agent.filtered_list,
    selected_bank: modules.cashier.payment_agent.selected_bank,
    supported_banks: modules.cashier.payment_agent.supported_banks,
}))(PaymentAgentDeposit);
