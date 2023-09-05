import React from 'react';
import { getUrlBinaryBot } from '@deriv/shared';

const BinaryBotIFrame = () => {
    const base_link = getUrlBinaryBot(false);

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
