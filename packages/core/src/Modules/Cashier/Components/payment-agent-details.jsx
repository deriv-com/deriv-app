import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';

class Detail extends React.Component {
    render() {
        const { action, icon, is_last_child, value, is_bold, ...rest } = this.props;

        return (
            <div className='payment-agent__accordion-content-line'>
                <Icon icon={`Ic${icon}`} className='payment-agent__accordion-content-icon' color='secondary' />
                <a
                    className={classNames('payment-agent__contact cashier__paragraph', {
                        'payment-agent__contact--bold': is_bold,
                    })}
                    href={`${action ? `${action}:` : ''}${value}`}
                    {...rest}
                >
                    {value}
                </a>
            </div>
        );
    }
}

Detail.propTypes = {
    action: PropTypes.string,
    icon: PropTypes.string,
    is_last_child: PropTypes.bool,
    rel: PropTypes.string,
    target: PropTypes.string,
    value: PropTypes.string,
};

class PaymentAgentDetails extends React.Component {
    render() {
        return (
            <div className={classNames('payment-agent__accordion-content', this.props.className)}>
                {this.props.payment_agent_phone && (
                    <Detail action='tel' value={this.props.payment_agent_phone} icon='Phone' />
                )}
                {this.props.payment_agent_url && (
                    <Detail
                        value={this.props.payment_agent_url}
                        icon='Website'
                        target='_blank'
                        rel='noopener noreferrer'
                        is_bold
                    />
                )}
                {this.props.payment_agent_email && (
                    <Detail
                        action='mailto'
                        value={this.props.payment_agent_email}
                        icon='EmailOutline'
                        is_last_child
                        target='_blank'
                        rel='noopener noreferrer'
                        is_bold
                    />
                )}
            </div>
        );
    }
}

PaymentAgentDetails.propTypes = {
    className: PropTypes.string,
    payment_agent_email: PropTypes.string,
    payment_agent_phone: PropTypes.string,
    payment_agent_url: PropTypes.string,
};

export default PaymentAgentDetails;
