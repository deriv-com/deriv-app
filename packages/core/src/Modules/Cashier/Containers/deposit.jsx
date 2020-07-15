import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';
import FundsProtection from './funds-protection.jsx';
import CashierContainer from '../Components/cashier-container.jsx';
import Error from '../Components/Error/error.jsx';
import Virtual from '../Components/Error/virtual.jsx';

class Deposit extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
        this.props.onMount();
    }

    render() {
        const {
            is_virtual,
            error,
            iframe_height,
            iframe_url,
            is_loading,
            is_ask_uk_funds_protection,
            standpoint,
        } = this.props;
        if (is_virtual) {
            return <Virtual />;
        }
        if (standpoint.iom && is_ask_uk_funds_protection) {
            return <FundsProtection />;
        }
        return (
            <React.Fragment>
                {error.message ? (
                    <Error error={error} />
                ) : (
                    <CashierContainer iframe_height={iframe_height} iframe_url={iframe_url} is_loading={is_loading} />
                )}
            </React.Fragment>
        );
    }
}

Deposit.propTypes = {
    container: PropTypes.string,
    error: PropTypes.object,
    iframe_height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    iframe_url: PropTypes.string,
    is_ask_uk_funds_protection: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_virtual: PropTypes.bool,
    onMount: PropTypes.func,
    setActiveTab: PropTypes.func,
    standpoint: PropTypes.object,
};

export default connect(({ client, modules }) => ({
    is_virtual: client.is_virtual,
    container: modules.cashier.config.deposit.container,
    error: modules.cashier.config.deposit.error,
    iframe_height: modules.cashier.config.deposit.iframe_height,
    iframe_url: modules.cashier.config.deposit.iframe_url,
    is_ask_uk_funds_protection: modules.cashier.config.deposit.error.is_ask_uk_funds_protection,
    is_loading: modules.cashier.is_loading,
    onMount: modules.cashier.onMount,
    setActiveTab: modules.cashier.setActiveTab,
    standpoint: client.standpoint,
}))(Deposit);
