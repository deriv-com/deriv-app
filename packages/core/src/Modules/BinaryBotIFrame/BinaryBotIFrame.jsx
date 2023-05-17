import React from 'react';
import { deriv_urls, getPlatformFromUrl } from '@deriv/shared';

const BinaryBotIFrame = () => {
    const { is_deriv_app } = getPlatformFromUrl();
    const base_link = is_deriv_app ? deriv_urls.BINARYBOT_PRODUCTION : deriv_urls.BINARYBOT_STAGING;

    return (
        <iframe
            id='localstorage-sync__bot'
            src={`${base_link}/localstorage-sync.html`}
            style={{ display: 'none', visibility: 'hidden' }}
            sandbox='allow-same-origin allow-scripts'
        />
    );
};

export default BinaryBotIFrame;
