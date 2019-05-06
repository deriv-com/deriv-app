import React                 from 'react';
import {
    Box,
    HeaderSecondary,
    ListStrong,
    NavButtons,
    Section,
    BuySellImage,
    MtBox,
    MTAccountOpeningButton } from './common.jsx';
import {
    List,
    Table }                  from '../../_common/components/elements.jsx';
import { SeparatorLine }     from '../../_common/components/separator_line.jsx';

const hundred       = 100;
const hundredth     = 0.01;
const five_thousand = 5000;

const Lot = () => (
    <React.Fragment>
        <SeparatorLine invisible show_mobile className='gr-padding-10' />

        <Box>
            <div className='align-start gr-12'>
                <div className='gr-row'>
                    <div className='gr-1 align-self-center'>
                        <div className='notice-circle'>i</div>
                    </div>
                    <div className='gr-11'>
                        <p className='no-margin'>{it.L('Please note that one lot is equivalent to 100 units, based on our [_1]contract specifications[_2].', '<a href="#contract-specification">', '</a>')}</p>
                    </div>
                </div>
            </div>
        </Box>
    </React.Fragment>
);

const Metals = () => (
    <div className='static_full get-started'>
        <h1>{it.L('MetaTrader 5')}</h1>
        <div className='gr-row'>
            <div className='gr-3 gr-hide-m sidebar-container'>
                <div className='sidebar'>
                    <List
                        id='sidebar-nav'
                        items={[
                            { id: 'what-metals-trading',      href: '#what-metals-trading',      text: it.L('What is metals trading') },
                            { id: 'how-trade-metals',         href: '#how-trade-metals',         text: it.L('How to trade metals') },
                            { id: 'margin-policy',            href: '#margin-policy',            text: it.L('Metals margin policy') },
                            { id: 'contract-specification',   href: '#contract-specification',   text: it.L('Metals contract specifications') },
                        ]}
                    />
                </div>

                <MTAccountOpeningButton />
            </div>
            <div className='gr-9 gr-12-m'>
                <Section id='what-metals-trading' header={it.L('What is metals trading')}>
                    <p>{it.L('Diversify your portfolio with some of the most popular commodities in the world including gold and silver.')}</p>
                    <p>{it.L('Metals trading lets you speculate on the price movement of a particular metal asset in order to profit from the price difference when the asset value rises or falls.')}</p>

                    <HeaderSecondary header={it.L('Metal – a hard commodity')} />
                    <p>{it.L('Metals are also known as "hard" commodities as they are natural resources that must be mined or extracted.')}</p>
                    <p>{it.L('Metals are categorised into two types:')}</p>
                    <ul className='bullet'>
                        <li>{it.L('Industrial metals')}<br />{it.L('Industrial metals – also known as base metals – are abundant, but oxidise or corrode easily. Industrial metals feature heavily across a wide range of industrial and commercial applications, including electrical wiring, automobiles, and batteries.')}</li>
                        <li>{it.L('Precious metals')}<br />{it.L('Precious metals are harder to come by and are more valuable than industrial metals. Because precious metals are softer and less reactive, they are widely used in jewellery, medical devices, and electronics.')}</li>
                    </ul>

                    <HeaderSecondary header={it.L('Why you should trade precious metals with [_1]', it.website_name)} />
                    <ul className='checked'>
                        <ListStrong header={it.L('Competitive spreads')} text={it.L('Trade metals on competitive fixed and variable spreads.')} />
                        <ListStrong header={it.L('Commission-free')}     text={it.L('Pay no commission on all metal contracts.')} />
                        <ListStrong header={it.L('Comprehensive')}       text={it.L('Trade all four precious metals on one platform.')} />
                    </ul>
                </Section>
                <Section id='how-trade-metals' header={it.L('How to trade metals')}>
                    <p>{it.L('Learn the basic concepts of trading metal pairs on our MetaTrader 5 platform.')}</p>

                    <HeaderSecondary header={it.L('When to buy and sell')} />
                    <p>{it.L('When you are trading metals, you can choose to open a buy position (if you think that the price of an asset will rise) or a sell position (if you think that the price of an asset will fall).')}</p>

                    <BuySellImage />

                    <p>{it.L('Let\'s use the XAU/USD (Gold vs US dollar) metal pair as an example.')}</p>
                    <p>{it.L('If you decide to buy or \'go long\' on the XAU/USD, you will profit if the price of the XAU/USD rises, and incur losses if the price falls.')}</p>
                    <p>{it.L('If you decide to sell or \'go short\' on XAU/USD, you will profit if the price of the XAU/USD falls, and incur losses if the price rises.')}</p>

                    <HeaderSecondary header={it.L('Factors that affect metal prices')} />
                    <p>{it.L('Knowing when to buy and sell metals largely depends on how well you know the factors that influence market prices. The most common influencing factors are:')}</p>
                    <ul className='checked'>
                        <li>{it.L('Supply – Decline or increase in supply')}</li>
                        <li>{it.L('Demand – Driven by industrial and commercial applications, including new technological products or fashion trends')}</li>
                        <li>{it.L('Market volatility – Political, economic, or social instability may lead to more volatile financial markets that affect the prices of certain metals')}</li>
                    </ul>
                    <p>{it.L('Keeping up with market news and trends in a certain sector can help you tremendously, especially if you\'re just starting out.')}</p>

                    <HeaderSecondary header={it.L('How to calculate your profits and losses')} />
                    <p>{it.L('Let\'s use the XAU/USD metal pair again as an example.')}</p>
                    <p>{it.L('Due to market volatility and gold\'s reputation as a safe-haven asset, you predict that the price of gold will rise.')}</p>
                    <p>{it.L('After you purchase one lot of XAU/USD at a price of USD 1,255.06, the price of gold increases and you decide to sell when it reaches USD 1,255.80. Your profit or loss comes down to the price difference multiplied by the total lots you purchased.')}</p>
                    <p>{it.L('Your profit or loss is calculated as follows:')}</p>
                    <Box text={`(${it.L('Closing price')} – ${it.L('Opening price')}) x ${it.L('Lot units')} = ${it.L('Profit/Loss')}`} text_two={`(1,255.80 – 1,255.06) x 100 = ${it.L('USD')} 74`} />

                    <Lot />
                </Section>
                <Section id='margin-policy' header={it.L('Metals margin policy')}>
                    <p>{it.L('Margin allows you to trade on leverage – giving you the same level of market exposure using much less capital.')}</p>
                    <p>{it.L('For example, if you wanted to purchase 100 units of a particular asset trading at USD 50 per unit through a traditional broker, it would cost you USD 5,000 for this transaction.')}</p>
                    <p>{it.L('With leverage, you can purchase 100 units of the same asset at a fraction of the cost.')}</p>

                    <HeaderSecondary header={it.L('How to calculate margin')} />
                    <p>{it.L('You can determine the required margin for our metal pairs by using the formula below:')}</p>

                    <MtBox icon_1='l1-icon' icon_2='metal-icon' text={it.L('For example, if you buy one lot of the XAU/USD pair at 300:1 leverage and a market price of USD 1,250.15, the margin required to purchase that one lot will be calculated as follows:')} />

                    <p>{it.L('Without margin, purchasing one lot of the XAU/USD pair will cost you:')}</p>
                    <Box text={`100 * 1250.15 = ${it.L('USD')} 125,015`} />

                    <Lot />

                    <HeaderSecondary header={it.L('What\'s a margin call and how is it applied')} />
                    <p>{it.L('Equity is the sum of your balance and floating profit and loss (PnL). Margin level is the ratio of equity to margin. When that ratio reaches a specified percentage (usually 100%), your account will be placed under margin call. This does not affect your ability to open new positions; it serves to alert you that your floating PnL is moving lower. However, it is recommended to add funds to your account in order to keep your positions open. Alternatively, you may close losing positions.')}</p>

                    <HeaderSecondary header={it.L('What\'s a stop out level and how is it applied')} />
                    <p>{it.L('If your margin level reaches an even lower level (usually 50%), it will reach the stop out level where it is unable to sustain an open position. This will lead to some, or all your open positions being forcibly closed (also known as "forced liquidation").')}</p>
                    <p>{it.L('When your account hits the forced liquidation level, your orders and positions are forcibly closed in the following sequence:')}</p>
                    <ol>
                        <li>{it.L('We delete an order with the largest margin reserved')}</li>
                        <li>{it.L('If your margin level is still under the stop out level, your next order will be deleted. However, orders without margin requirements will not be deleted')}</li>
                        <li>{it.L('If your margin level is still under the stop out level, we will close an open position with the largest loss')}</li>
                        <li>{it.L('We will continue to close open positions until your margin level becomes higher than the stop out level')}</li>
                    </ol>
                </Section>
                <Section id='contract-specification' header={it.L('Metals contract specifications')}>
                    <Table
                        scroll
                        data={{
                            thead: [[
                                { text: it.L('Symbol'),         className: 'gr-padding-10' },
                                { text: it.L('Description'),    className: 'gr-padding-10' },
                                { text: it.L('Lot size'),       className: 'gr-padding-10 w-80' },
                                { text: it.L('Minimum volume'), className: 'gr-padding-10 w-80' },
                                { text: it.L('Volume step'),    className: 'gr-padding-10 w-80' },
                            ]],
                            tbody: [
                                [{ text: 'XAG/USD' }, { text: it.L('Silver vs US Dollar')    }, { text: five_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'XAU/USD' }, { text: it.L('Gold vs US Dollar')      }, { text: hundred       }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'XPD/USD' }, { text: it.L('Palladium vs US Dollar') }, { text: hundred       }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'XPT/USD' }, { text: it.L('Platinum vs US Dollar')  }, { text: hundred       }, { text: hundredth }, { text: hundredth }],
                            ],
                        }}
                    />

                    <HeaderSecondary header={it.L('How to read the table above')} />
                    <p>{it.L('Our metal pairs are typically traded in lots. One standard lot is equivalent to 100 units except silver where 1 lot equals 5,000 units. Each time you open a position on a symbol, you can start with a minimum transaction of 0.01 lots.')}</p>
                    <p>{it.L('For information about Forex leverage refer to our [_1]Margin Policy[_2].', '<a href="#margin-policy">', '</a>')}</p>

                    <HeaderSecondary header={it.L('Important notes on our swap rates (overnight funding)')} />
                    <p>{it.L('If you keep any positions open overnight, an interest adjustment will be made to your trading account as indication of the cost required to keep your position open.')}</p>
                    <p>{it.L('This interest adjustment (or swap rate) is based on interbank lending rates, on top of a 2% fee.')}</p>
                    <p>{it.L('The interest adjustment is calculated in points, meaning we will convert the relevant interbank lending rates to points in the base currency.')}</p>
                    <p>{it.L('Please take note that our swap rate also depends on the time and days you hold your positions open:')}</p>
                    <ul className='bullet'>
                        <li>{it.L('You will be subjected to swap rates if you keep a position open past 23:59:59 GMT.')}</li>
                        <li>{it.L('Positions that are still open on Wednesday at 23:59:59 GMT will be charged three times the swap rate to account for weekends – a standard practice for all brokers.')}</li>
                        <li>{it.L('Our swap rate may also be adjusted to take holidays into account.')}</li>
                    </ul>
                </Section>
                <NavButtons parent='mt5' section='metals' />
            </div>
        </div>
    </div>
);

export default Metals;
