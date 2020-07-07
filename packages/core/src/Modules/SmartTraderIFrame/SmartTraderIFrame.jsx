import React from 'react';
import { getUrlSmartTrader } from '@deriv/shared';

const SmartTraderIFrame = () => {
    const url = getUrlSmartTrader();
    if (!url) {
        return null;
    }

    return (
        <iframe
            id='localstorage-sync'
            src={`${url}/localstorage-sync.html`}
            style={{ display: 'none', visibility: 'hidden' }}
            sandbox='allow-same-origin allow-scripts'
        />
    );
};

export default SmartTraderIFrame;
