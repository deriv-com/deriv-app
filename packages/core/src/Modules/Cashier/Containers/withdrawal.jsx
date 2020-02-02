import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';
import Withdraw from '../Components/withdraw.jsx';
import SendEmail from '../Components/Email/send-email.jsx';
import Error from '../Components/Error/error.jsx';
import NoBalance from '../Components/Error/no-balance.jsx';
import Virtual from '../Components/Error/virtual.jsx';

class Withdrawal extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
    }

    componentWillUnmount() {
        this.props.setErrorMessage('');
    }

    render() {
        if (this.props.verification_code || this.props.iframe_url) {
            return <Withdraw />;
        }
        if (this.props.is_virtual) {
            return <Virtual />;
        }
        if (!+this.props.balance) {
            return <NoBalance />;
        }
        if (this.props.error.message) {
            return <Error error={this.props.error} container='withdraw' />;
        }
        return <SendEmail />;
    }
}

Withdrawal.propTypes = {
    balance: PropTypes.string,
    container: PropTypes.string,
    error: PropTypes.object,
    iframe_url: PropTypes.string,
    is_virtual: PropTypes.bool,
    setActiveTab: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    balance: client.balance,
    is_virtual: client.is_virtual,
    verification_code: client.verification_code.payment_withdraw,
    container: modules.cashier.config.withdraw.container,
    error: modules.cashier.config.withdraw.error,
    iframe_url: modules.cashier.config.withdraw.iframe_url,
    setActiveTab: modules.cashier.setActiveTab,
    setErrorMessage: modules.cashier.setErrorMessage,
}))(Withdrawal);
