import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';
import Error       from './error.jsx';
import SendEmail   from './send-email.jsx';
import Withdraw    from './Withdrawal/withdraw.jsx';

class Withdrawal extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
    }

    componentWillUnmount() {
        this.props.setErrorMessage('');
    }

    render() {
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
    iframe_url       : PropTypes.string,
    setActiveTab     : PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        verification_code: client.verification_code,
        container        : modules.cashier.config.withdraw.container,
        error            : modules.cashier.config.withdraw.error,
        iframe_url       : modules.cashier.config.withdraw.iframe_url,
        setActiveTab     : modules.cashier.setActiveTab,
        setErrorMessage  : modules.cashier.setErrorMessage,
    })
)(Withdrawal);
