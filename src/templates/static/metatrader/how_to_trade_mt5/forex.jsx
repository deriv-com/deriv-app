import React from 'react';
import { SeparatorLine } from '../../../_common/components/separator_line.jsx';
import { List, Table } from '../../../_common/components/elements.jsx';

const Step = ({
    is_first,
    is_last,
    number,
    title,
    step,
    children,
}) => (
    <React.Fragment>
        <div className='gr-row'>
            <div className='gr-9 gr-push-3'>
                { !is_first && <SeparatorLine className='gr-padding-30' /> }
                <h2>{title}</h2>
            </div>
        </div>
        <div className='gr-row'>
            <div className='gr-3 center-text'>
                <h3 className='secondary-color'>{step}</h3>
                <img src={it.url_for(`images/pages/metatrader/how-to/step${number}.svg`)} />
                { !is_last && <div className='vertical-dashed' /> }
            </div>
            <div className='gr-9'>
                {children}
            </div>
        </div>
    </React.Fragment>
);

const Forex = () => (
    <div id='forex_how_to'>
        <div className='gr-row'>
            <div className='gr-10 gr-push-1 center-text'>
                <h2>{it.L('How to trade Forex')}</h2>
                <p>{it.L('A Forex trader has one objective in mind when trading which is:')}</p>
                <p className='border-box'>{it.L('To exchange one currency for another in order to make profit.')}</p>
                <p>{it.L('But if you are new to Forex or financial trading of any kind, there is still a long way to go before you even purchase your first contract. This is why we have come up with a basic, step-by-step tutorial to help you bridge that gap and make your first trade.')}</p>
            </div>
        </div>

        <SeparatorLine className='gr-padding-30' />

        <Step title={it.L('Learn to read currency pairs')} step={it.L('Step 1')} number={1} is_first>
            <div>{it.L('Can\'t make heads or tails of currency pairs? Here is a simple way of looking at it:')}</div>
            <Table
                className='middle thin-border'
                data={{
                    tbody: [
                        [
                            { text: it.L('EUR') },
                            { text: <img src={it.url_for('images/pages/metatrader/how-to/flag_eur.svg')} /> },
                            { text: <React.Fragment><h3 className='no-margin'>{it.L('Based currency')}</h3>{it.L('Also known as transaction currency')}</React.Fragment>, className: 'align-start' },
                        ],
                        [
                            { text: it.L('USD'), className: 'no-border' },
                            { text: <img src={it.url_for('images/pages/metatrader/how-to/flag_us.svg')} />, className: 'no-border' },
                            { text: <React.Fragment><h3 className='no-margin'>{it.L('Quote currency')}</h3>{it.L('Also known as counter money')}</React.Fragment>, className: 'no-border align-start' },
                        ],
                    ],
                }}
            />
            <p>{it.L('Tips:')}</p>
            <List
                className='checked'
                items={[
                    { text: it.L('The base currency is always equal to one unit') },
                    { text: it.L('The price of the currency pair indicates how much of the quote currency is required to buy one unit of base currency. This is more commonly known as the exchange rate.') },
                ]}
            />
            <p>{it.L('Example:')}</p>
            <p>{it.L('If you see EUR/USD has a bid price of 1.05229, you will buy USD 1.05229 for every EUR 1 that you sell.')}</p>
        </Step>

        <Step title={it.L('Understand when to buy and sell')} step={it.L('Step 2')} number={2}>
            <div>{it.L('You want to buy a certain currency pair if you think the base currency will go up. The reverse holds true:')}</div>
            <p className='border-box'>{it.L('You want to sell that currency pair if you think the base currency will go down.')}</p>
            <p>{it.L('You have probably seen the terms \'going long\' and \'going short\' being used by a lot of Forex brokers and traders. Let\'s compare the differences between the two terms:')}</p>
            <p>{it.L('Long:')}</p>
            <List
                className='checked'
                items={[
                    { text: it.L('Go long = buy') },
                    { text: it.L('You are buying the base currency and selling the quote currency.') },
                    { text: it.L('You are expecting the base currency to rise in value so you can sell it back for a profit.') },
                ]}
            />
            <p>{it.L('Short:')}</p>
            <List
                className='checked'
                items={[
                    { text: it.L('Go short = sell') },
                    { text: it.L('You are selling the base currency and buying the quote currency.') },
                    { text: it.L('You are expecting the base currency to fall in value so you can buy it back at a lower price and make profit.') },
                ]}
            />
            <p>{it.L('Example:')}</p>
            <p>{it.L('After your analysis, you have come to the conclusion that the British economy will outperform its U.S. counterpart. Thus, you decide to go long and buy into the GBP/USD, expecting the GBP to rise in value.')}</p>
            <p>{it.L('If you decided that the British economy will underperform instead, then you will go short on the GBP/USD.')}</p>
        </Step>

        <Step title={it.L('Buy your first currency pairs')} step={it.L('Step 3')} number={3} is_last>
            <div>{it.L('After you have decided which position you want to take whether long or short you are well on your way to buying your first currency pair.')}</div>
            <p>{it.L('Example:')}</p>
            <div className='gr-row gr-nowrap gr-wrap-m gr-padding-20 gr-row-align-middle'>
                <div className='gr-adapt gr-12-m gr-padding-10 gr-parent'>
                    <img src={it.url_for('images/pages/metatrader/how-to/trade_button.svg')} />
                </div>
                <div className='gr-grow gr-12-m'>{it.L('GBP/USD currency pair and its bid-ask price.')}</div>
            </div>
            <p>{it.L('To go long, you will click on \'Buy\' to purchase GBP 1 for USD 1.22781. To go short, you will click on \'Sell\' to sell GBP 1 and receive USD 1.22771 in return.')}</p>
        </Step>
    </div>
);

export default Forex;
