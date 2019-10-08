import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';
import Error       from './error.jsx';
import NoBalance   from './no-balance.jsx';
import SendEmail   from './send-email.jsx';
import Virtual     from './virtual.jsx';
import Withdraw    from './Withdrawal/withdraw.jsx';

class Withdrawal extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
    }

    componentWillUnmount() {
        this.props.setErrorMessage('');
    }

    render() {
        if (this.props.is_virtual) {
            return <Virtual />;
        }
        if (this.props.has_no_balance) {
            return <NoBalance />;
        }
        if (!this.props.error.message) {
            return ((this.props.verification_code || this.props.iframe_url) ?
                <Withdraw /> : <SendEmail />
            );
        }
        return (
            <Error
                error={this.props.error}
                container='withdraw'
            />
        );
    }
}

Withdrawal.propTypes = {
    container        : PropTypes.string,
    error            : PropTypes.object,
    has_no_balance   : PropTypes.bool,
    iframe_url       : PropTypes.string,
    is_virtual       : PropTypes.bool,
    setActiveTab     : PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        is_virtual       : client.is_virtual,
        verification_code: client.verification_code.payment_withdraw,
        container        : modules.cashier.config.withdraw.container,
        error            : modules.cashier.config.withdraw.error,
        has_no_balance   : modules.cashier.has_no_balance,
        iframe_url       : modules.cashier.config.withdraw.iframe_url,
        setActiveTab     : modules.cashier.setActiveTab,
        setErrorMessage  : modules.cashier.setErrorMessage,
    })
)(Withdrawal);
