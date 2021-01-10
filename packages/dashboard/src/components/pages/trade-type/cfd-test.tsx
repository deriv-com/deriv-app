import * as React from 'react';
import { AppToTrade, Instrument } from '../../template/trade-type-template';
import { Banner } from '../../template/shared';

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

const CFDTest: React.FC = () => {
    return (
        <React.Fragment>
            <div style={{ maxWidth: '93.6rem', margin: 'auto', backgroundColor: 'white' }}>
                <Banner type='Margin' title='Trade positions larger than your capital' />
                <AppToTrade
                    title='Apps to trade CFDs'
                    card_data={card_data}
                    benefit_description='Trade with margin, and leverage your positions. With leverage, you can trade positions larger than your capital and maximise your returns when the market moves in your favour.'
                    benefit_data={benefit_data}
                />
                <Instrument title='Markets and instruments for trading CFDs' pair_data={pair_data} />
            </div>
        </React.Fragment>
    );
};

export default CFDTest;
