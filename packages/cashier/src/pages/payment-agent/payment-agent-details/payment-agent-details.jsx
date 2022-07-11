import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';
import './payment-agent-details.scss';

const Detail = ({ action, icon, is_last_child, children, ...rest }) => {
    const detail = Array.isArray(children) ? children : children.split(',');
    return (
        <div className='payment-agent-details__accordion-content-line'>
            <div>
                <Icon icon={`Ic${icon}`} className='payment-agent-details__accordion-content-icon' color='secondary' />
            </div>
            <div>
                {detail.map((child, id) => (
                    <a
                        key={id}
                        className='payment-agent-details__contact cashier__paragraph'
                        href={`${action ? `${action}:` : ''}${child}`}
                        {...rest}
                    >
                        {child}
                        {id === detail.length - 1 ? '' : ', '}
                    </a>
                ))}
            </div>
        </div>
    );
};

Detail.propTypes = {
    action: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    icon: PropTypes.string,
    is_last_child: PropTypes.bool,
    rel: PropTypes.string,
    target: PropTypes.string,
    value: PropTypes.string,
};

const PaymentAgentDetails = ({ className, payment_agent_phones, payment_agent_urls, payment_agent_email }) => {
    //  TODO: Once telephone, url removed from paymentagent_list.list we can remove isArray conditions and only use the array
    return (
        <div className={classNames('payment-agent-details__accordion-content', className)}>
            {payment_agent_phones && (
                <Detail action='tel' icon='Phone'>
                    {Array.isArray(payment_agent_phones)
                        ? payment_agent_phones.map(phone => phone.phone_number)
                        : payment_agent_phones}
                </Detail>
            )}
            {payment_agent_urls && (
                <Detail icon='Website' target='_blank' rel='noopener noreferrer'>
                    {Array.isArray(payment_agent_urls) ? payment_agent_urls.map(url => url.url) : payment_agent_urls}
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
    payment_agent_phones: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    payment_agent_url: PropTypes.string,
    payment_agent_urls: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

export default PaymentAgentDetails;
