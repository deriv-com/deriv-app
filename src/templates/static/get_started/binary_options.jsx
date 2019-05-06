import React            from 'react';
import {
    Section,
    HeaderSecondary,
    NavButtons,
    ListStrong }         from './common.jsx';
import { List }          from '../../_common/components/elements.jsx';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

let circle,
    circle_no;

const SectionTicked = ({ header, text }) => (
    <div className='gr-6'>
        <ul className='checked'>
            <li>
                <strong>{header}</strong>
                <p className='no-margin'>{text}</p>
            </li>
        </ul>
    </div>
);

const SectionSmall = ({ header, text, image }) => (
    <div className='gr-4 gr-padding-30 gr-parent'>
        <div className='gr-padding-20 gr-parent'>
            <img src={image ? it.url_for(`images/pages/get-started/binary-options/${image}.svg`) : 'https://placehold.it/70x70'} />
        </div>
        <strong>{header}</strong>
        <p className='no-margin gr-padding-10'>{text}</p>
    </div>
);

const SectionLarge = ({ dataAnchor, header, text, image, children }) => (
    <React.Fragment>
        <div className='gr-row'>
            <div className='gr-gutter gr-centered-m gr-centered-p gr-parent gr-padding-30'>
                <img src={it.url_for(`images/pages/get-started/binary-options/${image}.svg`)} />
            </div>
            <div className='gr-9 gr-12-m gr-12-p'>
                <h3 data-anchor={dataAnchor} className='secondary-color'>{header}</h3>
                <p>{text}</p>
                <ul className='bullet'>
                    {children}
                </ul>
            </div>
        </div>

        <SeparatorLine invisible show_mobile className='gr-padding-10' />
    </React.Fragment>
);

const Step = ({ header, text }) => {
    circle_no += 1;

    return (
        <div className='step'>
            <div className='border-bottom' />
            <div className='circle'>{ circle_no }</div>
            <div className='gr-padding-20 gr-gutter center-text'>
                <div className='gr-8 gr-centered'>
                    <img className='responsive' src={it.url_for(`images/pages/get-started/binary-options/how-to-trade-binary/easy-step-${circle_no}.svg`)} />
                </div>
                <div className='gr-padding-20 gr-child'><strong>{header}</strong></div>
                <p className='no-margin gr-padding-10'>{text}</p>
            </div>
        </div>
    );
};

const CircleHeader = ({ className, header, text, children }) => {
    circle += 1;

    return (
        <React.Fragment>
            <SeparatorLine invisible show_mobile className={className || 'gr-padding-20'} />

            <div className='circle-wrapper'>
                <span className='orange-circle'>{circle}</span>
                <h3>{header}</h3>
            </div>
            <p className='no-margin'>{text}</p>
            {children}
        </React.Fragment>
    );
};

const Glossary = ({ glossary }) => (
    glossary.map((item, idx) => (
        <React.Fragment key={idx}>
            <HeaderSecondary header={item.word} data-anchor={item.dataAnchor} />
            <p>{item.definition}</p>
        </React.Fragment>
    ))
);

const BinaryOptions = () => {
    circle    = 0;
    circle_no = 0;

    return (
        <div className='static_full get-started'>
            <h1>{it.L('Binary Options')}</h1>
            <div className='gr-row'>
                <div className='gr-3 gr-hide-m sidebar-container'>
                    <div className='sidebar'>
                        <List
                            id='sidebar-nav'
                            items={[
                                { id: 'what-are-binary-options', href: '#what-are-binary-options', text: it.L('What are binary options') },
                                { id: 'how-to-trade-binary',     href: '#how-to-trade-binary',     text: it.L('How to trade binary options') },
                                { id: 'types-of-trades',         href: '#types-of-trades',         text: it.L('Types of trades') },
                                { id: 'range-of-markets',        href: '#range-of-markets',        text: it.L('Range of markets') },
                                { id: 'glossary',                href: '#glossary',                text: it.L('Glossary') },
                            ]}
                        />
                    </div>
                </div>
                <div className='gr-9 gr-12-m'>
                    <Section id='what-are-binary-options' header={it.L('What are binary options')}>
                        <p>{it.L('A binary option is a type of option with a fixed payout in which you predict the outcome from two possible results. If your prediction is correct, you receive the agreed payout. If not, you lose your initial stake, and nothing more. It\'s called \'binary\' because there can be only two outcomes – win or lose.')}</p>

                        <HeaderSecondary header={it.L('Advantages of binary options trading')} />
                        <p>{it.L('Aside from the simplicity of its \'yes or no\' proposition, binary options trading is also very flexible. It gives you the ability to trade:')}</p>
                        <div className='gr-row gr-parent gr-padding-10'>
                            <SectionTicked header={it.L('All markets')}           text={it.L('Trade on underlying markets that include Forex, indices, commodities, and more.')} />
                            <SectionTicked header={it.L('All market conditions')} text={it.L('Predict market movement using up/down, touch/no touch, and in/out trade types.')} />
                            <SectionTicked header={it.L('All durations')}         text={it.L('Take a short-term or long-term view with trade durations from 10 seconds to 365 days.')} />
                            <SectionTicked header={it.L('All payouts')}           text={it.L('Earn payouts up to USD 50,000. Losses are limited to your initial stake and nothing more.')} />
                        </div>

                        <HeaderSecondary header={it.L('Why you should trade binary options with [_1]', it.website_name)} />
                        <p>{it.L('Enjoy an award-winning online trading platform with trading conditions that are ideal for new and experienced traders.')}</p>
                        <strong>{it.L('Award-winning online trading platform')}</strong>
                        <ul className='bullet'>
                            <ListStrong header={it.L('Simple and intuitive')} text={it.L('Enjoy a trading platform that\'s easy to navigate and use')} />
                            <ListStrong header={it.L('Instant access')}       text={it.L('Open an account and start trading in minutes')} />
                            <ListStrong header={it.L('Available 24/7')}       text={it.L('Trade when you want. Our Volatility Indices are available even on weekends')} />
                            <ListStrong header={it.L('Patented technology')}  text={it.L('Trade with the industry pioneer and holder of a patented pricing technology')} />
                            <ListStrong header={it.L('Security and privacy')} text={it.L('Trade confidently, knowing that your personal data, transactions, and funds are always secure')} />
                        </ul>
                        <strong>{it.L('All conditions and durations')}</strong>
                        <ul className='bullet'>
                            <ListStrong header={it.L('All markets and conditions')}   text={it.L('Trade currencies, indices, commodities and more in rising, falling, sideways, quiet, and volatile markets')} />
                            <ListStrong header={it.L('Short to long-term durations')} text={it.L('Choose timeframes from 10 seconds to 365 days')} />
                        </ul>
                        <strong>{it.L('Competitive and transparent pricing')}</strong>
                        <ul className='bullet'>
                            <ListStrong header={it.L('Sharp, benchmarked prices')}             text={it.L('Receive prices that are benchmarked against interbank rates')} />
                            <ListStrong header={it.L('Transparent risk and potential reward')} text={it.L('Know how much you will win or lose before you purchase the contract')} />
                            <ListStrong header={it.L('Protect your profits')}                  text={it.L('Sell your long-term contracts before expiry to protect any profits you may have made or to minimise your losses')} />
                            <ListStrong header={it.L('Two-way pricing')}                       text={it.L('Receive quotes for a trade and countertrade, so you always get unbiased, transparent rates')} />
                        </ul>
                        <strong>{it.L('Ideal for new and experienced traders')}</strong>
                        <ul className='bullet'>
                            <ListStrong header={it.L('Low minimum stakes')}                         text={it.L('Deposit as little as USD 5 to start trading')} />
                            <ListStrong header={it.L('Trade according to your preferred strategy')} text={it.L('Trade based on "gut feel" or rely on technical and fundamental analysis')} />
                            <ListStrong header={it.L('Flexible')}                                   text={it.L('Choose from over one million possible trade variations at any time, and customise your trades according to your preferred strategy')} />
                            <ListStrong header={it.L('Scalable')}                                   text={it.L('Earn the same proportional return on stakes of all values')} />
                        </ul>
                    </Section>
                    <Section id='how-to-trade-binary' header={it.L('How to trade binary options')}>
                        <p>{it.L('Binary options trading is relatively easy. You can purchase a contract in just three steps:')}</p>

                        <SeparatorLine invisible show_mobile className='gr-padding-10' />

                        <div className='steps'>
                            <Step header={it.L('Define your position')} text={it.L('Choose the market, trade type, duration, barrier, and payout.')} />
                            <Step header={it.L('Get your price')}       text={it.L('Receive instant prices based on your position.')} />
                            <Step header={it.L('Make your trade')}      text={it.L('Buy the contract or re-define your position.')} />
                        </div>

                        <h3 className='secondary-color'>{it.L('Step 1: Define your position')}</h3>
                        <p>{it.L('The first step is to set the parameters of your trade. There are five trade parameters you need to adjust in order to receive a price for the contract:')}</p>
                        <div className='gr-padding-30'>
                            <img className='responsive' src={it.url_for('images/pages/get-started/binary-options/how-to-trade-binary/define-position.svg')} />
                        </div>

                        <CircleHeader className='gr-padding-10' header={it.L('Underlying market')} text={it.L('Choose from four available markets:')}>
                            <ul className='checked'>
                                <ListStrong header={it.L('Forex')}              text={it.L('Major and minor pairs, plus Smart FX indices')} />
                                <ListStrong header={it.L('Indices')}            text={it.L('All major worldwide stock indices sourced from the over-the-counter market')} />
                                <ListStrong header={it.L('Commodities')}        text={it.L('Major commodities such as gold, silver, and oil')} />
                                <ListStrong header={it.L('Volatility Indices')} text={it.L('Our proprietary synthetic indices that simulate market forces')} />
                            </ul>
                        </CircleHeader>

                        <CircleHeader header={it.L('Trade type')} text={it.L('Choose from three main trade types:')}>
                            <ul className='bullet'>
                                <ListStrong header={it.L('Up/Down')}        text={it.L('Predict if the market will rise or fall from its current level, or if it will end higher or lower than a price target')} />
                                <ListStrong header={it.L('Touch/No touch')} text={it.L('Predict if the market will touch or not touch a price target')} />
                                <ListStrong header={it.L('In/Out')}         text={it.L('Predict if the market will stay between or go outside two price targets')} />
                            </ul>
                            <p>{it.L('Aside from the three main trade types above, you also get Asians and Digits trade types exclusively with our Volatility Indices.')}</p>
                        </CircleHeader>

                        <CircleHeader
                            header={it.L('Duration')}
                            text={it.L('Set the length of your trade from 10 seconds to 365 days, whether you have a short-term or long-term view of the markets.')}
                        />

                        <CircleHeader
                            header={it.L('Barrier')}
                            text={it.L('Set barrier(s) to define your position and trigger the payout you\'ll receive.')}
                        />

                        <CircleHeader
                            header={it.L('Payout')}
                            text={it.L('Choose the payout you wish to receive from correctly predicting this contract.')}
                        />

                        <HeaderSecondary header={it.L('Step 2: Get your price')} />
                        <div className='gr-padding-20 gr-10'>
                            <img className='gr-padding-20 responsive' src={it.url_for('images/pages/get-started/binary-options/how-to-trade-binary/step-2.svg')} />
                        </div>
                        <p>{it.L('The price of the contract is automatically calculated by our patented pricing technology based on the parameters you\'ve defined in Step 1. Our prices are benchmarked against the interbank options market, so you always get the most competitive prices. This means that you\'ll always receive fair and transparent pricing, whatever your position.')}</p>

                        <HeaderSecondary header={it.L('Step 3: Make your trade')} />
                        <div className='gr-padding-20 gr-10'>
                            <img className='responsive' src={it.url_for('images/pages/get-started/binary-options/how-to-trade-binary/step-3.svg')} />
                        </div>
                        <p>{it.L('When you are satisfied with the price that you receive, execute your trade immediately. With our unique platform, there\'s no risk of \'slippage\' or gaping markets. And most importantly, there are no hidden fees. You can also sell back any long-term trades at any time to profit from favourable market conditions.')}</p>
                    </Section>
                    <Section id='types-of-trades' header={it.L('Types of trades')}>
                        <p>{it.L('[_1] offers the following trade types that will help you execute your market view or strategy:', it.website_name)}</p>
                        <SectionLarge dataAnchor='up-down' header={it.L('Up/Down')} image='types-of-trades/up_down' text={it.L('There are two types of Up/Down trades:')}>
                            <ListStrong header={it.L('Rise/Fall')}    text={it.L('Predict that the market will rise or fall from its current level')} />
                            <ListStrong header={it.L('Higher/Lower')} text={it.L('Predict that the market will end higher or lower than a price target')} />
                        </SectionLarge>

                        <SectionLarge dataAnchor='touch-no-touch' header={it.L('Touch/No touch')} image='types-of-trades/touch_notouch' text={it.L('Predict that the market will touch or not touch a target any time during the contract period.')} />

                        <SectionLarge dataAnchor='in-out' header={it.L('In/Out')} image='types-of-trades/in_out' text={it.L('There are two types of In/Out trades:')}>
                            <ListStrong header={it.L('Ends Between/Ends Outside')}  text={it.L('Predict that the market stops inside or outside two price targets at the end of the time period')} />
                            <ListStrong header={it.L('Stays Between/Goes Outside')} text={it.L('Predict that the market stays inside or goes outside two price targets any time during the contract period')} />
                        </SectionLarge>
                        <SectionLarge dataAnchor='asians' header={it.L('Asians')} image='types-of-trades/asians' text={it.L('Predict that the market will end higher or lower than the average price.')} />
                        <SectionLarge dataAnchor='digits' header={it.L('Digits')} image='types-of-trades/digits' text={it.L('Predict the last decimal digit of the spot price with Digits. There are three types of Digits trades:')}>
                            <ListStrong header={it.L('Matches/Differs')} text={it.L('Predict that the last digit will match or not match')} />
                            <ListStrong header={it.L('Even/Odd')}        text={it.L('Predict that the last digit is an even number or odd number after the last tick')} />
                            <ListStrong header={it.L('Over/Under')}      text={it.L('Predict that the last digit is higher or lower')} />
                        </SectionLarge>
                        <SectionLarge dataAnchor='reset-callput' header={it.L('Reset Call/Reset Put')} image='types-of-trades/reset' text={it.L('There are two types of reset trades:')}>
                            <ListStrong header={it.L('Reset Call')} text={it.L('Predict that the market will end up higher than either the current level or the level at a predetermined time (reset time)')} />
                            <ListStrong header={it.L('Reset Put')}  text={it.L('Predict that the market will end up lower than either the current level or the level at a predetermined time (reset time)')} />
                            <p>{it.L('At reset time, if the spot is in the opposite direction of your prediction, the barrier is reset to that spot.')}</p>
                        </SectionLarge>
                        <SectionLarge dataAnchor='high-low-ticks' header={it.L('High Ticks/Low Ticks')} image='types-of-trades/high_low_ticks' text={it.L('Purchase High Tick/Low Tick contracts to predict the highest or lowest tick among the next five ticks.')} />
                        <SectionLarge dataAnchor='only-ups-only-downs' header={it.L('Only Ups/Only Downs')} image='types-of-trades/runup_rundown' text={it.L('Available trade types:')}>
                            <ListStrong header={it.L('Only Ups')} text={it.L('Win payout if consecutive ticks rise successively. Contract is lost when at least one tick falls or is equal to any of the previous ticks.')} />
                            <ListStrong header={it.L('Only Downs')} text={it.L('Win payout if consecutive ticks fall successively. Contract is lost when at least one tick rises or is equal to any of the previous ticks.')} />
                        </SectionLarge>
                        <p>{it.L('Please note that Asians, Digits, Reset Call/Reset Put, High Ticks/Low Ticks, and Only Ups/Only Downs are available exclusively with our Volatility Indices.')}</p>
                    </Section>
                    <Section id='range-of-markets' header={it.L('Range of markets')}>
                        <p>{it.L('Binary options allow you to trade on a wide range of underlying markets. One of the advantages of trading binary options is that you are not buying or selling an actual asset, only a contract that determines how that asset performs over a period of time. This limits your risk and makes it easy for anyone to start trading.')}</p>

                        <HeaderSecondary header={it.L('Available markets')} data-anchor='available-markets' />
                        <div className='gr-row'>
                            <SectionSmall image='range-of-markets/forex'   header={it.L('Forex')}   text={it.L('Major pairs, minor pairs, and Smart FX indices.')} />
                            <SectionSmall image='range-of-markets/indices' header={it.L('Indices')} text={it.L('Major worldwide stock indices sourced from the OTC market.')} />

                            <SectionSmall image='range-of-markets/commodities' header={it.L('Commodities')}        text={it.L('All four precious metals, plus energy.')} />
                            <SectionSmall image='range-of-markets/volatility'  header={it.L('Volatility Indices')} text={it.L('Synthetic indices that mimic market volatility.')} />
                        </div>

                        <HeaderSecondary header={it.L('Forex')} data-anchor='forex' />
                        <p>{it.L('Trade popular major and minor currency pairs, plus Smart FX indices – weighted indices that measure the value of a currency against a basket of major currencies.')}</p>
                        <p>{it.L('There are four types of Smart FX indices that you can trade:')}</p>
                        <ul className='bullet'>
                            <li>{it.L('AUD Index – Measures the value of the Australian Dollar against a basket of five global currencies (USD, EUR, GBP, JPY, CAD), each weighted by 20%')}</li>
                            <li>{it.L('EUR Index – Measures the value of the Euro against a basket of five global currencies (USD, AUD, GBP, JPY, CAD), each weighted by 20%')}</li>
                            <li>{it.L('GBP Index – Measures the value of the British Pound against a basket of five global currencies (USD, EUR, AUD, JPY, CAD), each weighted by 20%')}</li>
                            <li>{it.L('USD Index – Measures the value of the US Dollar against a basket of five global currencies (EUR, GBP, JPY, CAD, AUD), each weighted by 20%')}</li>
                        </ul>

                        <HeaderSecondary header={it.L('Indices')} data-anchor='indices' />
                        <p>{it.L('Enjoy exciting opportunities to trade indices with the benefit of real-time charts and pricing.')}</p>
                        <p>{it.L('Our indices are sourced from the over-the-counter (OTC) market – sources outside of the centralised exchanges. Please note that due to their OTC nature, the prices of our indices may differ from their counterparts on centralised exchanges.')}</p>

                        <HeaderSecondary header={it.L('Commodities')} data-anchor='commodities' />
                        <p>{it.L('We offer all four precious metals – gold, silver, palladium, and platinum – as well as energy in our list of commodities.')}</p>

                        <HeaderSecondary header={it.L('Volatility Indices')} data-anchor='volatility-indices' />
                        <p>{it.L('[_1]\'s Volatility Indices are synthetic indices that mimic real-world market volatility and are available for trading 24/7. They are based on a cryptographically secure random number generator audited for fairness by an independent third party.', it.website_name)}</p>
                        <p>{it.L('You can trade Volatility Indices on all three main trade types: Up/Down, Touch/No Touch, and In/Out. That\'s not all – Volatility Indices also give you exclusive access to two additional trade types: Asians and Digits.')}</p>
                        <p>{it.L('Volatility Indices are further categorised into two classes:')}</p>
                        <ul className='bullet'>
                            <li>{it.L('Continuous Indices – Choose from the Volatility 10 Index, Volatility 25 Index, Volatility 50 Index, Volatility 75 Index, and Volatility 100 Index. These indices correspond to simulated markets with constant volatilities of 10%, 25%, 50%, 75%, and 100% respectively')}</li>
                            <li>{it.L('Daily Reset Indices – Daily Reset Indices replicate markets with a bullish and bearish trend with a constant volatility. The Bull Market and Bear Market indices start at 00:00 GMT each day, replicating bullish and bearish markets respectively')}</li>
                        </ul>
                    </Section>
                    <Section id='glossary' header={it.L('Glossary')}>
                        <Glossary
                            glossary={[
                                { word: it.L('Barrier(s)'),      dataAnchor: 'barriers',        definition: it.L('The barrier of a binary option trade is the price target you set for the underlying. You can choose trades that stay below or go above a price target, or stay between two targets.') },
                                { word: it.L('Binary option'),   dataAnchor: 'binary-option',   definition: it.L('A binary option is a contract purchased by a trader, which pays a pre-determined amount if their prediction is correct.') },
                                { word: it.L('Commodities'),     dataAnchor: 'commodities',     definition: it.L('Commodities are resources that are grown or extracted from the ground, such as silver, gold and oil. On [_1], they are priced in US dollars.', it.website_name) },
                                { word: it.L('Contract period'), dataAnchor: 'contract-period', definition: it.L('The contract period is the timeframe of a trade. It is also called the duration.') },
                                { word: it.L('Derivative'),      dataAnchor: 'derivative',      definition: it.L('A derivative is a financial instrument whose value is determined by reference to an underlying market. Derivatives are commonly traded in the inter-bank market, and binaries are one of the simplest forms of derivatives.') },
                                { word: it.L('Duration'),        dataAnchor: 'duration',        definition: it.L('The duration is the length of a purchased trade (see \'contract period\').') },

                                { word: it.L('Ends Between/Ends Outside trades'), dataAnchor: 'barriers', definition: it.L('An Ends Between trade pays out if the market exit price is strictly higher than the low price target AND strictly lower than the high price target. An Ends Outside binary pays out if the market exit price is EITHER strictly higher than the high price target OR strictly lower than the low price target.') },

                                { word: it.L('Entry spot price'),    dataAnchor: 'entry-spot-price',    definition: it.L('The entry spot price is the starting price of the trade purchased by a trader.') },
                                { word: it.L('Expiry price'),        dataAnchor: 'expiry-price',        definition: it.L('The expiry price is the price of the underlying when the contract expires.') },
                                { word: it.L('Forex'),               dataAnchor: 'forex',               definition: it.L('In foreign exchange markets, traders can enter contracts based on the change in price of one currency as it relates to another currency. For example if a trader selects Rise in the EUR/USD market, they are predicting that the value of the Euro will rise in relation to the value of the US dollar.') },
                                { word: it.L('GMT'),                 dataAnchor: 'gmt',                 definition: it.L('GMT stands for Greenwich Mean Time, the official time used in the UK during winter. In summer, the UK changes to British Summer Time, which is GMT + 1 hour. All times on the [_1] site use GMT all year round.', it.website_name) },
                                { word: it.L('Higher/Lower trades'), dataAnchor: 'barriers',            definition: it.L('These are trades where the trader predicts if a market will finish higher or lower than a specified price target.') },
                                { word: it.L('Indices'),             dataAnchor: 'indices',             definition: it.L('Stock market indices measure the value of a selection of companies in the stock market.') },
                                { word: it.L('In/Out trades'),       dataAnchor: 'in-out-trades',       definition: it.L('These are trades where the trader selects a low and high barrier, and predicts if the market will stay within these barriers or go outside them (see also \'Stays Between/Goes Outside trades\').') },
                                { word: it.L('Market exit price'),   dataAnchor: 'market-exit-price',   definition: it.L('The market exit price is the price in effect at the end of the contract period.') },
                                { word: it.L('No Touch trades'),     dataAnchor: 'no-touch-trades',     definition: it.L('These are trades where the trader selects a price target, and predicts that the market will never touch the target before the expiry of the trade.') },
                                { word: it.L('(One) Touch trades'),  dataAnchor: 'one-touch-trades',    definition: it.L('These are trades where the trader selects a price target, and predicts that the market will touch the target before the expiry of the trade.') },
                                { word: it.L('Payout'),              dataAnchor: 'payout',              definition: it.L('The payout is the amount paid to an options trader if their prediction is correct.') },
                                { word: it.L('Pip'),                 dataAnchor: 'pip',                 definition: it.L('Pip stands for \'percentage in point\' which is generally the fourth decimal place (i.e. 0.0001).') },
                                { word: it.L('Profit'),              dataAnchor: 'profit',              definition: it.L('The profit is the difference between the purchase price (the stake) and the payout on a winning trade.') },
                                { word: it.L('Volatility Indices'),  dataAnchor: 'volatility-indices',  definition: it.L('The volatility indices simulate various real market situations and provide an ideal platform for getting used to trading and testing strategies under various market conditions. These indices depend on volatility and drift, and help users to try out scenarios like - high volatility, low volatility, bullish and bearish trends.') },
                                { word: it.L('Resale price'),        dataAnchor: 'resale-price',        definition: it.L('The resale price indicates a contract\'s current market price. Resale prices are on a best-efforts basis and may not be available at all times after purchase. See \'Sell option\' for more details on selling contracts before expiry.') },
                                { word: it.L('Return'),              dataAnchor: 'return',              definition: it.L('The return is the money realized when the contract expires (see \'Payout\').') },
                                { word: it.L('Rise/Fall trades'),    dataAnchor: 'rise-fall-trades',    definition: it.L('These are trades where the trader predicts if a market will rise or fall at the end of a selected time period.') },
                                { word: it.L('Sell option'),         dataAnchor: 'sell-option',         definition: it.L('It is sometimes possible to sell an option before the expiry of a trade, but only if a fair price can be determined. If this option is available, you will see a \'Sell\' button inside the popup window, after clicking on the \'View\' button next to your trade in the portfolio.') },
                                { word: it.L('Spot price'),          dataAnchor: 'spot-price',          definition: it.L('This is the current price at which an underlying can be bought or sold at a particular time.') },
                                { word: it.L('Stake'),               dataAnchor: 'stake',               definition: it.L('The stake is the amount that a trader must pay to enter into a trade.') },

                                { word: it.L('Stays Between/Goes Outside trades'), dataAnchor: 'stay-between-trades', definition: it.L('A Stays Between trade pays out if the market stays between (does not touch) BOTH the high barrier or the low barrier at any time during the period chosen by a trader. A Goes Outside trade pays out if the market touches EITHER the high barrier or the low barrier at any time during the period chosen by a trader.') },

                                { word: it.L('Tick'),       dataAnchor: 'tick',       definition: it.L('A tick is the minimum upward or downward movement in the price of a market.') },
                                { word: it.L('Underlying'), dataAnchor: 'underlying', definition: it.L('Each binary option is a prediction on the future movement of an underlying market.') },
                            ]}
                        />
                    </Section>
                    <NavButtons parent='binary' section='binary-options' />
                </div>
            </div>
        </div>
    );
};

export default BinaryOptions;
