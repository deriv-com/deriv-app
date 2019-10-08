import PropTypes        from 'prop-types';
import React            from 'react';
import { connect }      from 'Stores/connect';
import CashierContainer from '../Layout/cashier-container.jsx';

class Withdraw extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
        this.props.onMount(this.props.verification_code);
    }

    render() {
        return (
            <CashierContainer
                iframe_height={this.props.iframe_height}
                iframe_url={this.props.iframe_url}
                is_loading={this.props.is_loading}
            />
        );
    }
}

Withdraw.propTypes = {
    container    : PropTypes.string,
    iframe_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    iframe_url       : PropTypes.string,
    is_loading       : PropTypes.bool,
    onMount          : PropTypes.func,
    setActiveTab     : PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        verification_code: client.verification_code.payment_withdraw,
        container        : modules.cashier.config.withdraw.container,
        iframe_height    : modules.cashier.config.withdraw.iframe_height,
        iframe_url       : modules.cashier.config.withdraw.iframe_url,
        is_loading       : modules.cashier.is_loading,
        setActiveTab     : modules.cashier.setActiveTab,
        onMount          : modules.cashier.onMount,
    })
)(Withdraw);
