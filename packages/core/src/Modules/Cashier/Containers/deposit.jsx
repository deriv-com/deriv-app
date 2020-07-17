import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';
import CashierContainer from '../Components/cashier-container.jsx';
import Error from '../Components/Error/error.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import FundsProtection from '../Components/funds-protection.jsx';
import MaxTurnover from '../Components/max-turnover-form.jsx';

class Deposit extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
        this.props.onMount();
    }

    render() {
        const { is_virtual, error, iframe_height, iframe_url, is_loading, standpoint } = this.props;
        if (is_virtual) {
            return <Virtual />;
        }
        if (error.is_ask_uk_funds_protection) {
            return <FundsProtection />;
        }
        if (error.is_self_exclusion_max_turnover_set) {
            return <MaxTurnover />;
        }
        return (
            <React.Fragment>
                {error.message ? (
                    <Error error={error} />
                ) : (
                    <>
                        <CashierContainer
                            iframe_height={iframe_height}
                            iframe_url={iframe_url}
                            is_loading={is_loading}
                        />
                    </>
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
    is_loading: modules.cashier.is_loading,
    onMount: modules.cashier.onMount,
    setActiveTab: modules.cashier.setActiveTab,
    standpoint: client.standpoint,
}))(Deposit);
