import PropTypes        from 'prop-types';
import React            from 'react';
import { connect }      from 'Stores/connect';
import CashierContainer from '../Layout/cashier-container.jsx';

class Withdraw extends React.Component {
    render() {
        return (
            <CashierContainer
                container_height={this.props.container_height}
                container_url={this.props.withdraw_url}
                is_loading={this.props.is_loading}
                onMount={this.props.onMount}
                verification_code={this.props.verification_code}
            />
        );
    }
}

Withdraw.propTypes = {
    container_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    is_loading       : PropTypes.bool,
    onMount          : PropTypes.func,
    verification_code: PropTypes.string,
    withdraw_url     : PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        container_height : modules.cashier.container_height,
        is_loading       : modules.cashier.is_loading,
        onMount          : modules.cashier.onMountWithdraw,
        verification_code: client.verification_code,
        withdraw_url     : modules.cashier.container_urls.withdraw,
    })
)(Withdraw);
