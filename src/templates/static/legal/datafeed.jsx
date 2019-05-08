import React from 'react';

const DataFeed = () => (
    <div>
        <h2 data-anchor='data-feed'>{it.L('Data Feed')}</h2>
        <p>{it.L('Information about the data feeds used by our company, and how the data is processed before being fed into the system.')}</p>

        <h2 data-anchor='filtering-stary-ticks'>{it.L('Filtering Stray Ticks')}</h2>
        <p>{it.L('Depending on the quality of the data feeds received from our feed providers, our servers might apply a tick filtering algorithm. The purpose of this filtering algorithm is to strip the feed of stray ticks. Stray ticks are ticks that manifestly fall outside of the current trading range of the market; such ticks are often due to communication delays with the exchanges or banks that provide quotes, human error, or database problems at any point between the originator of the quote and our servers.')}</p>
        <p>{it.L('The filtering algorithm may for example be similar to the "Bollinger Bands" volatility system - i.e., short-term volatility bands are determined around the present market value, and ticks that are manifestly outside of such bands are removed.')}</p>

        <h2 data-anchor='smoothing-out-random-noise'>{it.L('Smoothing out random noise')}</h2>
        <p>{it.L('Depending on the quality of the feeds received from our feed providers, our servers might also apply a very short-term smoothing algorithm to the data feed. This smoothing algorithm removes a little of the "random noise" surrounding the data feed, and ensures that clients who buy path-dependent contracts (such as the one-touch or barrier-range contracts) will not have their contracts knocked-in or knocked-out by random short-term market noise that does not reflect the true market price.')}</p>

        <h2 data-anchor='differences-with-other-data-feeds'>{it.L('Differences with other data feeds')}</h2>
        <p>{it.L('Our data feed may at times differ slightly from other data feeds found on the internet (who may themselves differ between each other). Reasons for differences in feed providers include:')}</p>

        <ul>
            <li>{it.L('For forex: The forex market is an OTC (over the counter) market, where banks and other major financial institutions trade currencies amongst themselves without there being any central clearing house. Accordingly, there is no \'official\' price source for forex quotes. Different data feeds will contain quotes from a different sub-set of international banks. Accordingly prices may differ between providers, depending on which bank(s) they obtain prices from.')}</li>
            <li>{it.L('The smoothing and filtering algorithms described above.')}</li>
            <li>{it.L('Market-closing times: Please refer to')} <a href={it.url_for('resources/market_timesws')}>{it.L('Trading Times')}</a> {it.L('page for the exact time of settlement for all contracts. Other websites may adopt a different convention (for example some websites choose 4 o\'clock NY time, or 5 o\'clock London time). As a result, the open, high, low and closing prices displayed on our website may differ to those on other websites, due to the market-closing time convention.')}</li>
            <li>{it.L('Use of bid/ask prices: when the market is illiquid, the data feed may contain many bid and ask prices, without there actually being any traded price for quite a while. By taking an average of the bid/ask price (i.e. bid + ask, divided by 2), a market quote is generated that reflects the current market, without it actually being a traded price. Our system will generate prices from these bid and ask prices, whereas other websites might not. As a result, our website might display ticks that do not appear in the data feeds of other websites.')}</li>
        </ul>
        <p>{it.L('Our data feed is designed to be one of the best and most robust available for a trading environment.')}</p>

        <h2 data-anchor='weekend-quotes'>{it.L('Weekend quotes')}</h2>
        <p>{it.L('Please note that weekend quotes are ignored for the purpose of contract settlement. During weekends, the forex markets may occasionally generate prices, however these prices are often artificial (traders sometimes take advantage of the illiquidity of the markets during weekends to push up or down prices). To avoid settling prices based on such artificial prices, it is [_1]\'s policy not to count weekend prices towards contract settlement values (except for the volatility indices, which are open during weekends).', it.broker_name)}</p>
    </div>
);

export default DataFeed;
