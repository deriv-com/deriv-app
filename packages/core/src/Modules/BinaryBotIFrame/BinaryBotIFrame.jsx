import React from 'react';
import { deriv_urls, isStaging } from '@deriv/shared';

const BinaryBotIFrame = () => {
    const base_link = isStaging() ? deriv_urls.BINARYBOT_STAGING : deriv_urls.BINARYBOT_PRODUCTION;

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
