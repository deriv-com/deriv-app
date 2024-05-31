import React from 'react';
import { getUrlP2PStandalone } from '@deriv/shared';

const BinaryBotIFrame = () => {
    const base_link = getUrlP2PStandalone();

    return (
        <iframe
            id='localstorage-sync__p2p'
            src={`${base_link}/localstorage-sync.html`}
            style={{ display: 'none', visibility: 'hidden' }}
            sandbox='allow-same-origin allow-scripts'
        />
    );
};

export default BinaryBotIFrame;
