import React from 'react';

const TradingViewComponent = () => {
    return (
        <iframe
            id='trading-view-iframe'
            style={{ width: '100%', height: '100%', backgroundColor: 'white' }}
            src='https://charts.deriv.com/deriv?hide-signup=true'
        />
    );
};

export default TradingViewComponent;
