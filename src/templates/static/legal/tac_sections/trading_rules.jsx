import React from 'react';

const TradingRules = () => (
    <div>
        <h2 data-anchor='trading-rules'>{it.L('Trading Rules')}</h2>
        <p>{it.L('The Company may impose certain rules and restrictions in relation to the placing of market orders on this website. Such rules may change from time to time, according to market conditions and other factors. The following indicative rules are currently in place:')}
            <ul className='bullet'>
                <li>{it.L('Contracts will not usually be offered at odds under 0.05 to 1 (i.e. payouts of under USD/GBP/EUR/AUD 1.05 for each USD/GBP/EUR/AUD 1 staked).')}</li>
                <li>{it.L('Contracts offered by Binary Investments (Europe) Ltd. have a minimum purchase price of USD/GBP/EUR 5.')}</li>
                <li>{it.L('Contracts are not usually offered in the last hour of trade of any given market (for foreign exchange markets, the restriction may be extended up to 3 hours).')}</li>
                <li>{it.L('Contracts will not usually be offered when the underlying market is at its intraday high or intraday low.')}</li>
                <li>{it.L('Contracts will not usually be offered during the first 10 minutes of market trade.')}</li>
                <li>{it.L('During fast markets (i.e. periods of very fast market movements), contracts may be offered at prices more unfavourable than those offered in usual market conditions.')}</li>
                <li>{it.L('Certain limits are imposed as to the acceptable levels for barrier/strike prices of contracts. Typically, the barrier/strike may not be too close nor too far from the current underlying market level.')}</li>
                <li>{it.L('Contracts may not expire on a weekend; therefore, the expiry date of a contract may be pushed back to the following Monday in the event of a contract expiry date falling on a Saturday or a Sunday.')}</li>
                <li>{it.L('Market prices are updated at most once per second.  For any given second, the market price will be updated to the first tick, if any, received in that particular second on the company data feed.')}</li>
                <li>{it.L('The company does not guarantee the ability to sell a contract prior to its expiration time.')}</li>
            </ul>

            <h2 data-anchor='contract-payouts'>{it.L('Contract Payouts')}</h2>
            <p>{it.L('Contract payouts shall be determined by the Company by reference to the daily high/low/close values reported on this website relevant to the underlying index(ices) of the contract(s) or from the interbank trading data received by the Company for forex quotes or commodities prices as displayed on the website, subject that the Company shall have the right to make corrections to such data in the event of mispriced or typographically incorrect data. Clients should note that the different markets may close at different times during the day due to local trading hours and time zones.')}</p>
            <p>{it.L('For forex quotes the closing times are defined by the Company as shown in the Market Opening Times section of the website. In the event of any dispute regarding market or settlement values, the decision of the Company shall be final and binding. Clients should note that certain markets (such as indices) are not open throughout the day and that trading may not be available when the markets are closed.')}</p>
            <p>{it.L('The calculation of the price to be paid (or the payout to be received) for financial contracts on this site at the time the financial contract is purchased or sold will be based on the Company\'s best estimate of market price movements and the expected level of interest rates, implied volatilities and other market conditions during the life of the financial contract, and is based on complex mathematics. The calculation will include a bias in favour of the Company. The financial contract prices (or the payout amounts) offered to Clients speculating on market or index prices may differ substantially from prices available in the primary markets where commodities or contracts thereupon are traded, due to the bias favouring the Company in the price calculation system referred to above.')}</p>
            <p>{it.L('The charting data made available to Clients by the Company is indicative only and may at times differ from the real market values. The Company\'s decision as to the calculation of a financial contract price will be final and binding. The Company allows the option to sell contracts before expiry time of some contracts but will not be obliged to do so and can suspend this option depending on the current market conditions. Contracts may be amended when the underlying asset value is adjusted by corporate actions during the contract period.')}</p>
            <p>{it.L('Should a disruption occur in the data feeds which cannot be readily rectified by the Company, the Company reserves the right to refund the contract purchase.')}</p>
            <h2 data-anchor='trading-limits'>{it.L('Trading Limits')}</h2>
            <p>{it.L('The Company reserves the right to have in place risk limits, which affects the trading limits of all clients trading, and may not be limited solely to instruments and contract types.')}</p>
            <p>{it.L('The Company may also impose volume trading limits on Client accounts at its sole discretion. Trading volume limits can be viewed in the Security & Limits section of your account. If the account balance exceeds the maximum account size, then withdrawals must be made to bring the balance down to under this limit.')}</p>
        </p>
    </div>
);

export default TradingRules;
