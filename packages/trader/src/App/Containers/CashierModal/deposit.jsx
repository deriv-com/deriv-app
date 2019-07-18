import PropTypes        from 'prop-types';
import React            from 'react';
import { connect }      from 'Stores/connect';
import CashierContainer from './Layout/cashier-container.jsx';

class Deposit extends React.Component {
    componentDidMount() {
        this.props.setActiveTab('deposit');
    }

    render() {
        return (
            <CashierContainer
                container_height={this.props.container_height}
                container_url={this.props.deposit_url}
                error_message={this.props.error_message}
                is_loading={this.props.is_loading}
                onMount={this.props.onMount}
            />
        );
    }
}

Deposit.propTypes = {
    container_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    deposit_url  : PropTypes.string,
    error_message: PropTypes.string,
    is_loading   : PropTypes.bool,
    onMount      : PropTypes.func,
    setActiveTab : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        container_height: modules.cashier.container_height,
        deposit_url     : modules.cashier.container_urls.deposit,
        error_message   : modules.cashier.error_message,
        is_loading      : modules.cashier.is_loading,
        setActiveTab    : modules.cashier.setActiveTab,
        onMount         : modules.cashier.onMountDeposit,
    })
)(Deposit);
