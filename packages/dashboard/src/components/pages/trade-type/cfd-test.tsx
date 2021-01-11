import * as React from 'react';
import AppToTrade from '../../template/app-to-trade';
import Instruments from '../../template/instruments';
import Indices from '../../template/indices';
import YouMightLike from '../../template/you-might-like';
import Banner from '../../template/banner';

const card_data = [
    {
        title: 'DMT5 Synthetic',
        sub_title: 'Trade CFDs on synthetic indices that simulate real-world market movements.',
        icon: 'IcMt5Synthetic',
    },
    {
        title: 'DMT5 Financial',
        sub_title: 'Trade CFDs on commodities, cryptocurrencies, and currency pairs with leverage.',
        icon: 'IcMt5FinancialStp',
    },
    {
        title: 'DMT5 Financial',
        sub_title: 'Trade CFDs on commodities, cryptocurrencies, and currency pairs with leverage.',
        icon: 'IcMt5FinancialStp',
    },
];

const benefit_data = [
    { icon: 'IcMt5FinancialStp', description: 'High leverage, low spreads' },
    { icon: 'IcMt5FinancialStp', description: 'Access all markets' },
    { icon: 'IcMt5FinancialStp', description: 'Go long or short' },
    { icon: 'IcMt5FinancialStp', description: 'Open an account and start trading in minutes' },
    { icon: 'IcMt5FinancialStp', description: 'Go long or short' },
    { icon: 'IcMt5FinancialStp', description: 'Open an account and start trading in minutes' },
];

const pair_data = [
    {
        title: 'Major pairs',
        data: [
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'AUD/JPY' },
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'AUD/USD' },
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'EUR/AUD' },
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'EUR/CAD' },
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'EUR/CAD' },
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'EUR/CAD' },
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'EUR/CAD' },
        ],
    },

    {
        title: 'Minor pairs',
        data: [
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'AUD/JPY' },
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'AUD/USD' },
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'EUR/AUD' },
            { icon: 'IcUnderlyingFRXAUDJPY', description: 'EUR/CAD' },
        ],
    },
];

const indice_data = [
    {
        title: 'Volatility indices',
        sub_title:
            'These indices correspond to simulated markets with constant volatilities of 10%, 25%, 50%, 75%, and 100%. One tick is generated every two seconds for volatility indices 10, 25, 50, 75, and 100. One tick is generated every second for volatility indices 10 (1s), 25 (1s), 50 (1s), 75 (1s), and 100 (1s).',
        line: true,
        data: [
            { icon: 'IcUnderlyingCRASH500', description: 'Volatility 10 Index' },
            { icon: 'IcUnderlyingCRASH1000', description: 'Volatility 10 Index' },
            { icon: 'IcUnderlyingBOOM1000', description: 'Volatility 50 Index' },
            { icon: 'IcUnderlyingCRASH500', description: 'Volatility 75 Index' },
            { icon: 'IcUnderlyingBOOM1000', description: 'Volatility 100 Index' },
            { icon: 'IcUnderlyingCRASH500', description: 'Volatility 10 (1s) Index' },
            { icon: 'IcUnderlyingCRASH500', description: 'Volatility 25 (1s) Index' },
        ],
    },

    {
        title: 'Crash/Boom',
        sub_title:
            'With these indices, there is an average of one drop (crash) or one spike (boom) in prices that occurs in a series of 1,000 or 500 ticks.',
        data: [
            { icon: 'IcUnderlyingCRASH500', description: 'Boom 1000 Index' },
            { icon: 'IcUnderlyingCRASH500', description: 'Boom 500 Index' },
            { icon: 'IcUnderlyingBOOM1000', description: 'Boom 1000 Index' },
            { icon: 'IcUnderlyingCRASH500', description: 'Boom 5000 Index' },
        ],
    },
];

const CFDTest: React.FC = () => {
    return (
        <React.Fragment>
            <div style={{ maxWidth: '93.6rem', margin: 'auto', backgroundColor: 'white' }}>
                <Banner bg_image_url='trade-type/banner-background.png' type='Margin' title='Trade positions larger than your capital' />
                <AppToTrade
                    title='Apps to trade CFDs'
                    cards={card_data}
                    benefit_description='Trade with margin, and leverage your positions. With leverage, you can trade positions larger than your capital and maximise your returns when the market moves in your favour.'
                    benefit_data={benefit_data}
                />
                <Instruments title='Markets and instruments for trading CFDs' pair_data={pair_data} />
                <Indices indice_data={indice_data} />
                <YouMightLike trade_type='3' />
            </div>
        </React.Fragment>
    );
};

export default CFDTest;
