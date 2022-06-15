import classNames from 'classnames';
import { toJS } from 'mobx';
import React from 'react';
import { Icon, Text , Money } from '@deriv/components';
import { localize } from '@deriv/translations';

export const Detail = ({ action, className, icon, children, title, has_red_color }) => {
    const detail = Array.isArray(children) ? children : [children];
    return (
        <div
            className={classNames('payment-agent-card__detail', {
                [className]: !!className,
            })}
        >
            {icon && (
                <div className='payment-agent-card__detail-icon-container'>
                    <Icon icon={`IcCashier${icon}`} />
                </div>
            )}
            <div>
                {detail.map((child, id) => (
                    <React.Fragment key={id}>
                        {title && (
                            <Text as='p' line_height='s' size='xs'>
                                {title}
                            </Text>
                        )}
                        {action || !title ? (
                            <Text
                                as='a'
                                color={has_red_color ? 'red' : 'prominent'}
                                href={`${action ? `${action}:` : ''}${child}`}
                                line_height='s'
                                size={!title ? 'xxs' : 'xs'}
                                weight='bold'
                                className='payment-agent-card__detail-link'
                            >
                                {child}
                                {id === detail.length - 1 ? '' : ', '}
                            </Text>
                        ) : (
                            <Text as='p' line_height='s' size='xs' weight='bold'>
                                {child}
                            </Text>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const PaymentAgentCardDetails = ({ payment_agent }) => {
    const payment_agent_phones = toJS(payment_agent.phones);
    const detail_titles = {
        email: localize('Email'),
        phone_number: localize('Phone number'),
        deposit_commission: localize('Commission on deposits'),
        withdrawal_commission: localize('Commission on withdrawal'),
        min_withdrawal: localize('Minimum withdrawal'),
        max_withdrawal: localize('Maximum withdrawal'),
    };

    return (
        <div className='payment-agent-card__details-container'>
            {payment_agent_phones && (
                <Detail action='tel' icon='Phone' title={detail_titles.phone_number}>
                    {Array.isArray(payment_agent.phones)
                        ? payment_agent.phones.map(phone => phone.phone_number)
                        : payment_agent.phones}
                </Detail>
            )}
            {payment_agent.email && (
                <Detail
                    action='mailto'
                    icon='Email'
                    rel='noopener noreferrer'
                    target='_blank'
                    title={detail_titles.email}
                    has_red_color
                >
                    {payment_agent.email}
                </Detail>
            )}
            {payment_agent.min_withdrawal && (
                <Detail icon='MinimumWithdrawal' title={detail_titles.min_withdrawal}>
                    <Money amount={payment_agent.min_withdrawal} show_currency />
                </Detail>
            )}
            {payment_agent.deposit_commission && (
                <Detail
                    icon='CommissionDeposit'
                    className='deposit-commission'
                    title={detail_titles.deposit_commission}
                >
                    {`${payment_agent.deposit_commission}%`}
                </Detail>
            )}
            {payment_agent.max_withdrawal && (
                <Detail icon='MaximumWithdrawal' title={detail_titles.max_withdrawal}>
                    <Money amount={payment_agent.max_withdrawal} show_currency />
                </Detail>
            )}
            {payment_agent.withdrawal_commission && (
                <Detail
                    icon='CommissionWithdrawal'
                    className='withdrawal_commission'
                    title={detail_titles.withdrawal_commission}
                >
                    {`${payment_agent.withdrawal_commission}%`}
                </Detail>
            )}
        </div>
    );
};

export default PaymentAgentCardDetails;
