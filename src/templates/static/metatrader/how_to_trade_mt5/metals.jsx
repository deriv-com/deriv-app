import React             from 'react';
import {
    List,
    Table }              from '../../../_common/components/elements.jsx';
import { SeparatorLine } from '../../../_common/components/separator_line.jsx';

const Equation = ({ operand_1, operand_2, operand_3, operand_4 }) => (
    <React.Fragment>
        {operand_1}
        <img className='math-sign' src={it.url_for('images/pages/metatrader/how-to/minus.svg')} />
        {operand_2}
        <img className='math-sign' src={it.url_for('images/pages/metatrader/how-to/multiply.svg')} />
        {operand_3}
        <img className='math-sign' src={it.url_for('images/pages/metatrader/how-to/equal.svg')} />
        {operand_4}
    </React.Fragment>
);

const Metals = () => (
    <div id='metals_how_to'>
        <div className='gr-row'>
            <div className='gr-8 gr-push-2 center-text'>
                <h2>{it.L('How to trade Metals?')}</h2>
                <p>{it.L('Learn the basic concepts of trading Meta assets on MetaTrader 5.')}</p>
                <p className='border-box'>{it.L('When you are trading metals, you can choose to open a buy position if you think that the price of an asset will rise or a sell position if you think that the price of an asset will fall.')}</p>
            </div>
        </div>

        <SeparatorLine className='gr-padding-30' />

        <div className='center-text'>
            <h2>{it.L('When to buy and sell?')}</h2>
            <p>{it.L('Can\'t figure it out on when to buy and sell? Here is a simple way of looking at it:')}</p>
            <div className='gr-row'>
                <div className='gr-8 gr-push-2 gr-12-m gr-push-0-m'>
                    <Table
                        className='middle thin-border'
                        data={{
                            tbody: [
                                [
                                    { text: it.L('Buy') },
                                    { text: <img src={it.url_for('images/pages/metatrader/how-to/buy.svg')} /> },
                                    { text: it.L('In this case, you predict that the price will rise. This is also known as \'going long\'.'), className: 'align-start' },
                                ],
                                [
                                    { text: it.L('Sell'), className: 'no-border' },
                                    { text: <img src={it.url_for('images/pages/metatrader/how-to/sell.svg')} />, className: 'no-border' },
                                    { text: it.L('In this case, you predict that the price will fall. This is also known as \'going short\'.'), className: 'no-border align-start' },
                                ],
                            ],
                        }}
                    />
                </div>
            </div>
            <div className='gr-row'>
                <div className='gr-10 gr-push-1'>
                    <p>{it.L('Example: XAU/USD (Gold vs US Dollar) symbol pair')}</p>
                    <p>{it.L('If you decide to buy or \'go long\' on the XAU/USD, you will profit if the price of the XAU/USD rises, and incur losses if the price falls.')}</p>
                    <p>{it.L('If you decide to sell or \'go short\' on XAU/USD, you will profit if the price of the XAU/USD falls, and incur losses if the price rises.')}</p>
                </div>
            </div>
        </div>

        <SeparatorLine className='gr-padding-30' />

        <div className='gr-row'>
            <div className='gr-10 gr-push-1 center-text'>
                <h2>{it.L('Factors that affect precious metal prices')}</h2>
                <p>{it.L('Knowing when to buy and sell precious metals largely depends on how well you know the factors that influence market prices. The most common influencing factors are:')}</p>
                <List
                    className='checked align-start'
                    items={[
                        { text: it.L('Supply - Decline or increase in supply') },
                        { text: it.L('Demand – Driven by industrial and commercial applications, including new technological products or fashion trends') },
                        { text: it.L('Market volatility – Political, economic, or social instability may lead to more volatile financial markets that affect the prices of certain metals') },
                    ]}
                />
                <p>{it.L('As conclusion, keeping up with market news and trends in a certain sector can help you always ')}</p>
            </div>
        </div>

        <SeparatorLine className='gr-padding-30' />

        <div className='gr-row'>
            <div className='gr-10 gr-push-1 center-text'>
                <h2>{it.L('How to calculate your profit and losses?')}</h2>
                <p>{it.L('Example: XAU/USD (Gold vs US Dollar) symbol pair')}</p>
                <p>{it.L('Please note that one lot is equivalent to 100 units, based on our contract specifications. Your profit or loss will be calculated as follows:')}</p>
                <p className='border-box'>{it.L('When you are trading metals, you can choose to open a buy position if you think that the price of an asset will rise or a sell position if you think that the price of an asset will fall.')}</p>
                <p>
                    <Equation
                        operand_1={it.L('Closing price')}
                        operand_2={it.L('Opening price')}
                        operand_3={it.L('Lot units')}
                        operand_4={it.L('Profit or Loss')}
                    />
                </p>
                <p className='border-box'>
                    <Equation
                        operand_1={<React.Fragment>US<span className='symbols usd' />1,255.80</React.Fragment>}
                        operand_2={<React.Fragment>US<span className='symbols usd' />1,255.06</React.Fragment>}
                        operand_3={100}
                        operand_4={<React.Fragment>US<span className='symbols usd' />74</React.Fragment>}
                    />
                </p>
            </div>
        </div>
    </div>
);

export default Metals;
