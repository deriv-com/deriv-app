import React from 'react';
import { getPlatformFromUrl } from '@deriv/shared';

const SmartTraderIFrame = () => {
    const { is_deriv_crypto, is_staging_deriv_app, is_staging_deriv_crypto } = getPlatformFromUrl();

    let base_link = '';

    if (is_staging_deriv_app) {
        base_link = 'https://staging-smarttrader.deriv.com';
    } else if (is_staging_deriv_crypto) {
        base_link = 'https://staging-smarttrader.derivcrypto.com';
    } else if (is_deriv_crypto) {
        base_link = 'https://smarttrader.derivcrypto.com';
    } else {
        base_link = 'https://smarttrader.deriv.com';
    }

    return (
        <iframe
            id='localstorage-sync'
            src={`${base_link}/localstorage-sync.html`}
            style={{ display: 'none', visibility: 'hidden' }}
            sandbox='allow-same-origin allow-scripts'
        />
    );
};

export default SmartTraderIFrame;
