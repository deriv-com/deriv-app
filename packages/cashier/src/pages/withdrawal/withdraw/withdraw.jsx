import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';
import { Real } from 'Components/cashier-container';

const Withdraw = ({
    container,
    iframe_height,
    iframe_url,
    clearIframe,
    is_loading,
    onMount,
    setActiveTab,
    verification_code,
}) => {
    React.useEffect(() => {
        setActiveTab(container);
        onMount(verification_code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Real iframe_height={iframe_height} iframe_url={iframe_url} clearIframe={clearIframe} is_loading={is_loading} />
    );
};

Withdraw.propTypes = {
    clearIframe: PropTypes.func,
    container: PropTypes.string,
    iframe_height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    iframe_url: PropTypes.string,
    is_loading: PropTypes.bool,
    onMount: PropTypes.func,
    setActiveTab: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    container: modules.cashier.withdraw.container,
    iframe_height: modules.cashier.iframe.iframe_height,
    iframe_url: modules.cashier.iframe.iframe_url,
    clearIframe: modules.cashier.iframe.clearIframe,
    is_loading: modules.cashier.general_store.is_loading,
    onMount: modules.cashier.withdraw.onMountWithdraw,
    setActiveTab: modules.cashier.general_store.setActiveTab,
    verification_code: client.verification_code.payment_withdraw,
}))(Withdraw);
