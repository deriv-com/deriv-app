import React from 'react';
import { deriv_urls } from '@deriv/shared';

const P2PIFrame = () => {
    const base_link = deriv_urls.P2P_STAGING;

    return (
        <iframe
            id='localstorage-sync__p2p'
            src={`${base_link}/localstorage-sync.html`}
            style={{ display: 'none', visibility: 'hidden' }}
            sandbox='allow-same-origin allow-scripts'
        />
    );
};

export default P2PIFrame;
