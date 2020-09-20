import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';
import Withdraw from '../Components/withdraw.jsx';
import SendEmail from '../Components/Email/send-email.jsx';
import Error from '../Components/Error/error.jsx';
import NoBalance from '../Components/Error/no-balance.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import WithdrawalLocked from '../Components/Error/withdrawal-locked.jsx';
import CashierLocked from '../Components/Error/cashier-locked.jsx';
import USDTSideNote from '../Components/usdt-side-note.jsx';

class Withdrawal extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
    }

    componentDidUpdate(prev_props) {
        if (
            prev_props.verification_code !== this.props.verification_code ||
            prev_props.iframe_url !== this.props.iframe_url
        ) {
            if (/^(UST|eUSDT)$/i.test(this.props.currency) && typeof this.props.setSideNotes === 'function') {
                this.props.setSideNotes([<USDTSideNote key={0} />]);
            }
        }
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
        if (this.props.is_cashier_locked) {
            return <CashierLocked />;
        }
        if (this.props.is_withdrawal_locked) {
            return <WithdrawalLocked />;
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
    is_cashier_locked: PropTypes.bool,
    is_withdrawal_locked: PropTypes.bool,
    setActiveTab: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    balance: client.balance,
    currency: client.currency,
    is_virtual: client.is_virtual,
    verification_code: client.verification_code.payment_withdraw,
    container: modules.cashier.config.withdraw.container,
    error: modules.cashier.config.withdraw.error,
    iframe_url: modules.cashier.config.withdraw.iframe_url,
    is_cashier_locked: modules.cashier.is_cashier_locked,
    is_withdrawal_locked: modules.cashier.is_withdrawal_locked,
    setActiveTab: modules.cashier.setActiveTab,
    setErrorMessage: modules.cashier.setErrorMessage,
}))(Withdrawal);
