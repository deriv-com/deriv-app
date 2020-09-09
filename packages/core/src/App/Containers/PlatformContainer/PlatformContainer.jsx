import React from 'react';
import { PlatformContext } from './platform-context';

const DERIV_CRYPTO_KEY = 'is_deriv_crypto_app';

const PlatformContainer = ({ ...props }) => {
    const is_crypto_app = window.localStorage.getItem(DERIV_CRYPTO_KEY);
    const fallback_process_env = process.env.is_crypto_app ? 'true' : 'false';
    const [deriv_crypto, setDerivCrypto] = React.useState(is_crypto_app || fallback_process_env);

    const platform_store = {
        is_deriv_crypto: deriv_crypto === 'true',
        setDerivCrypto,
        DERIV_CRYPTO_KEY,
    };

    return <PlatformContext.Provider value={platform_store} {...props} />;
};

export default PlatformContainer;
