import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';

const Detail = ({ action, icon, is_last_child, children, ...rest }) => {
    const children_array = children.split(',');
    return (
        <div className='payment-agent__accordion-content-line'>
            <Icon icon={`Ic${icon}`} className='payment-agent__accordion-content-icon' color='secondary' />
            {children_array.map((child, id) => (
                <a
                    key={id}
                    className='payment-agent__contact cashier__paragraph'
                    href={`${action ? `${action}:` : ''}${child}`}
                    {...rest}
                >
                    {child}
                    {id === children_array.length - 1 ? '' : ', '}
                </a>
            ))}
        </div>
    );
};

Detail.propTypes = {
    action: PropTypes.string,
    icon: PropTypes.string,
    is_last_child: PropTypes.bool,
    rel: PropTypes.string,
    target: PropTypes.string,
    value: PropTypes.string,
};

const PaymentAgentDetails = ({ className, payment_agent_phone, payment_agent_url, payment_agent_email }) => {
    return (
        <div className={classNames('payment-agent__accordion-content', className)}>
            {payment_agent_phone && (
                <Detail action='tel' icon='Phone'>
                    {payment_agent_phone}
                </Detail>
            )}
            {payment_agent_url && (
                <Detail icon='Website' target='_blank' rel='noopener noreferrer'>
                    {payment_agent_url}
                </Detail>
            )}
            {payment_agent_email && (
                <Detail action='mailto' icon='EmailOutline' is_last_child target='_blank' rel='noopener noreferrer'>
                    {payment_agent_email}
                </Detail>
            )}
        </div>
    );
};

PaymentAgentDetails.propTypes = {
    className: PropTypes.string,
    payment_agent_email: PropTypes.string,
    payment_agent_phone: PropTypes.string,
    payment_agent_url: PropTypes.string,
};

export default PaymentAgentDetails;
