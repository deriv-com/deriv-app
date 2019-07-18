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
                {(this.props.verification_code || this.props.withdraw_url || this.props.error_message) ?
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
    setActiveTab     : PropTypes.func,
    verification_code: PropTypes.string,
    withdraw_url     : PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        error_message    : modules.cashier.error_message,
        setActiveTab     : modules.cashier.setActiveTab,
        verification_code: client.verification_code,
        withdraw_url     : modules.cashier.container_urls.withdraw,
    })
)(Withdrawal);
