import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import Icon       from 'Assets/icon.jsx';

class PaymentAgentDetails extends React.Component {
    render() {
        return (
            <div className={classNames('payment-agent__accordion-content', this.props.className)}>
                {this.props.payment_agent_phone &&
                <div className='payment-agent__accordion-content-line'>
                    <Icon icon='IconPhone' className='payment-agent__accordion-content-icon' />
                    <a className='payment-agent__contact' href={`tel:${this.props.payment_agent_phone}`}>{this.props.payment_agent_phone}</a>
                </div>
                }
                {this.props.payment_agent_url &&
                <div className='payment-agent__accordion-content-line'>
                    <Icon icon='IconWebsite' className='payment-agent__accordion-content-icon' />
                    <a className='payment-agent__contact' href={this.props.payment_agent_url} target='_blank' rel='noopener noreferrer'>{this.props.payment_agent_url}</a>
                </div>
                }
                {this.props.payment_agent_email &&
                <div>
                    <Icon icon='IconEmail' className='payment-agent__accordion-content-icon' />
                    <a className='payment-agent__contact' href={`mailto:${this.props.payment_agent_email}`}>{this.props.payment_agent_email}</a>
                </div>
                }
            </div>
        );
    }
}

PaymentAgentDetails.propTypes = {
    className          : PropTypes.string,
    payment_agent_email: PropTypes.string,
    payment_agent_phone: PropTypes.string,
    payment_agent_url  : PropTypes.string,
};

export default PaymentAgentDetails;
