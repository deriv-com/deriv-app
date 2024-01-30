import React from 'react';

const TradingViewComponent = () => {
    return (
        <iframe
            id='trading-view-iframe'
            style={{ width: '100%', height: '100%' }}
            src={'https://tradingview.deriv.com/deriv?hide_banner=1&hide-signup=true'}
        />
    );
};

export default TradingViewComponent;
