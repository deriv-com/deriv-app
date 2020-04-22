import React from 'react';
import { getAllowedLocalStorageOrigin } from 'Utils/Events/storage';

const SmartTraderIFrame = () => {
    const url = getAllowedLocalStorageOrigin();
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
