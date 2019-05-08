import React             from 'react';
import { SeparatorLine } from '../../../_common/components/separator_line.jsx';

const Cryptocurrencies = () => {
    const currency_one = 'BTC';
    const currency_two = 'USD';

    return (
        <div className='gr-10 gr-push-1'>
            <div className='center-text'>
                <h2>{it.L('How to trade cryptocurrencies')}</h2>
                <p>{it.L('Trade Bitcoin, Ethereum, and Litecoin pairs without owning them. Our cryptocurrency pairs quote a cryptocurrency such as Bitcoin against a fiat currency, such as the US dollar.')}</p>
                <p>{it.L('Similar to Forex trading, you must understand when to buy (or "go long") and when to sell (or "go short"). In Forex trading, you\'ll buy a certain currency pair if you think the value of the base currency will rise. The opposite is also true: you will sell a certain currency pair if you think the value of the base currency will fall.')}</p>
                <p>{it.L('The same concept applies to our cryptocurrency pairs.')}</p>
                <p>{it.L('Let\'s compare the differences between buying and selling, using the BTC/USD as an example:')}</p>
            </div>

            <SeparatorLine className='gr-padding-30' />

            <div className='gr-centered gr-6 gr-12-m'>
                <h2 className='center-text primary-color'>{it.L('Buy')}</h2>
                <ul className='bullet'>
                    <li>{it.L('You\'re buying the [_1] and selling the [_2]', currency_one, currency_two)}</li>
                    <li>{it.L('You expect the [_1] to rise in value so you can sell it back for a profit', currency_one)}</li>
                    <li>{it.L('Buy = go long')}</li>
                </ul>
            </div>

            <div className='gr-6 gr-centered'>
                <SeparatorLine className='gr-padding-30' />
            </div>

            <div className='gr-centered gr-6 gr-12-m'>
                <h2 className='center-text primary-color'>{it.L('Sell')}</h2>
                <ul className='bullet'>
                    <li>{it.L('You\'re selling the [_1] and buying the [_2]', currency_one, currency_two)}</li>
                    <li>{it.L('You expect the [_1] to fall in value so you can buy it back at a lower price (and make a profit)', currency_one)}</li>
                    <li>{it.L('Sell = go short')}</li>
                </ul>
            </div>

            <SeparatorLine className='gr-padding-30' />

            <div className='center-text'>
                <p>{it.L('In a nutshell, when you go long on the BTC/USD with [_1], you are not purchasing bitcoin directly. Instead, you\'re taking a position that the BTC/USD will rise in value whereby you will make a profit. If you go long on the BTC/USD and its value falls, then you will make a loss.', it.website_name)}</p>
            </div>
        </div>
    );
};

export default Cryptocurrencies;
