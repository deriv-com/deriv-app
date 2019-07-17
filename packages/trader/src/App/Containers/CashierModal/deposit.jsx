import PropTypes        from 'prop-types';
import React            from 'react';
import { connect }      from 'Stores/connect';
import CashierContainer from './cashier-container.jsx';

const Deposit = ({
    container_height,
    deposit_url,
    error_message,
    is_loading,
    onMount,
}) => (
    <CashierContainer
        className='deposit'
        container_height={container_height}
        container_url={deposit_url}
        error_message={error_message}
        is_loading={is_loading}
        onMount={onMount}
    />
);

Deposit.propTypes = {
    container_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    deposit_url  : PropTypes.string,
    error_message: PropTypes.string,
    is_loading   : PropTypes.bool,
    onMount      : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        container_height: modules.cashier.container_height,
        deposit_url     : modules.cashier.container_urls.deposit,
        error_message   : modules.cashier.error_message,
        is_loading      : modules.cashier.is_loading,
        onMount         : modules.cashier.onMountDeposit,
    })
)(Deposit);
