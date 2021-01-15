import React from 'react';
import { PlatformContext } from '@deriv/shared';

const DERIV_CRYPTO_KEY = 'is_deriv_crypto_app';
const DERIV_DASHBOARD_KEY = 'is_dashboard';

const PlatformContainer = ({ ...props }) => {
    const is_crypto_app = window.localStorage.getItem('is_deriv_crypto_app')
        ? window.localStorage.getItem('is_deriv_crypto_app') === 'true'
        : process.env.IS_CRYPTO_APP;
    const is_dashboard = window.localStorage.getItem('is_dashboard') === 'true';
    const [deriv_crypto, setDerivCrypto] = React.useState(is_crypto_app);
    const [deriv_dashboard, setDerivDashboard] = React.useState(is_dashboard);

    const platform_store = {
        is_deriv_crypto: deriv_crypto,
        setDerivCrypto,
        DERIV_CRYPTO_KEY,
        is_dashboard: deriv_dashboard,
        setDerivDashboard,
        DERIV_DASHBOARD_KEY,
    };

    return <PlatformContext.Provider value={platform_store} {...props} />;
};

export default PlatformContainer;
