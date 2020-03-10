import React from 'react';

const SmartTraderIFrame = () => {
    let url;

    if (/^staging\.deriv\.app$/i.test(window.location.hostname)) {
        url = 'https://smarttrader-staging.deriv.app/localstorage-sync.html';
    } else if (/^deriv\.app$/i.test(window.location.hostname)) {
        url = 'https://smarttrader.deriv.app/localstorage-sync.html';
    } else {
        return null;
    }

    return (
        <iframe
            id='localstorage-sync'
            src={url}
            style={{ display: 'none', visibility: 'hidden' }}
            sandbox='allow-same-origin allow-scripts'
        />
    );
};

export default SmartTraderIFrame;
