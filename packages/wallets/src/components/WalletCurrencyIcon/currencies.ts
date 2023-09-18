import React from 'react';

const currencies = {
    aud: React.lazy(() => import('../../public/images/currencies/aud.svg')),
    btc: React.lazy(() => import('../../public/images/currencies/btc.svg')),
    eth: React.lazy(() => import('../../public/images/currencies/eth.svg')),
    eur: React.lazy(() => import('../../public/images/currencies/eur.svg')),
    eusdt: React.lazy(() => import('../../public/images/currencies/eusdt.svg')),
    ltc: React.lazy(() => import('../../public/images/currencies/ltc.svg')),
    usd: React.lazy(() => import('../../public/images/currencies/usd.svg')),
    gbp: React.lazy(() => import('../../public/images/currencies/gbp.svg')),
    usdc: React.lazy(() => import('../../public/images/currencies/usdc.svg')),
    tusdt: React.lazy(() => import('../../public/images/currencies/eusdt.svg')),
    ust: React.lazy(() => import('../../public/images/currencies/eusdt.svg')),
};

export default currencies;
