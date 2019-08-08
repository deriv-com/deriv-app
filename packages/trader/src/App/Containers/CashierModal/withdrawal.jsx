import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';
import SendEmail   from './Withdrawal/send-email.jsx';
import Withdraw    from './Withdrawal/withdraw.jsx';

class Withdrawal extends React.Component {
    componentDidMount() {
        this.props.setActiveTab('withdraw');
    }

    render() {
        return (
            <React.Fragment>
                {this.props.error_message && <p className='cashier__error'>{this.props.error_message}</p>}
                {(this.props.verification_code || this.props.iframe_url) ?
                    <Withdraw />
                    :
                    <SendEmail />
                }
            </React.Fragment>
        );
    }
}

Withdrawal.propTypes = {
    error_message    : PropTypes.string,
    iframe_url       : PropTypes.string,
    setActiveTab     : PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        verification_code: client.verification_code,
        error_message    : modules.cashier.config.withdraw.error_message,
        iframe_url       : modules.cashier.config.withdraw.iframe_url,
        setActiveTab     : modules.cashier.setActiveTab,
    })
)(Withdrawal);
