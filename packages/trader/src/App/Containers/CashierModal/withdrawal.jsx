import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';
import Error       from './error.jsx';
import SendEmail   from './Withdrawal/send-email.jsx';
import Withdraw    from './Withdrawal/withdraw.jsx';

class Withdrawal extends React.Component {
    componentDidMount() {
        this.props.setActiveTab('withdraw');
    }

    render() {
        return (
            <React.Fragment>
                {this.props.error.message ?
                    <Error
                        error={this.props.error}
                        container='withdraw'
                    />
                    :
                    ((this.props.verification_code || this.props.iframe_url) ?
                        <Withdraw />
                        :
                        <SendEmail />
                    )
                }
            </React.Fragment>
        );
    }
}

Withdrawal.propTypes = {
    error            : PropTypes.object,
    iframe_url       : PropTypes.string,
    setActiveTab     : PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        verification_code: client.verification_code,
        error            : modules.cashier.config.withdraw.error,
        iframe_url       : modules.cashier.config.withdraw.iframe_url,
        setActiveTab     : modules.cashier.setActiveTab,
    })
)(Withdrawal);
