import React                 from 'react';
import {
    Box,
    BuySellCurrency,
    HeaderSecondary,
    MtBox,
    NavButtons,
    Section,
    MTAccountOpeningButton } from './common.jsx';
import {
    List,
    Table }                  from '../../_common/components/elements.jsx';

const hundred_thousand = '100,000';
const hundredth        = '0.01';

const Forex = () => (
    <div className='static_full get-started'>
        <h1>{it.L('MetaTrader 5')}</h1>
        <div className='gr-row'>
            <div className='gr-3 gr-hide-m sidebar-container'>
                <div className='sidebar'>
                    <List
                        id='sidebar-nav'
                        items={[
                            { id: 'what-forex-trading',     href: '#what-forex-trading',     text: it.L('What is Forex trading') },
                            { id: 'how-to-trade-forex',     href: '#how-to-trade-forex',     text: it.L('How to trade Forex') },
                            { id: 'margin-policy',          href: '#margin-policy',          text: it.L('Forex margin policy') },
                            { id: 'contract-specification', href: '#contract-specification', text: it.L('Forex contract specifications') },
                        ]}
                    />
                </div>

                <MTAccountOpeningButton />
            </div>
            <div className='gr-9 gr-12-m'>
                <Section id='what-forex-trading' header={it.L('What is Forex trading')}>
                    <p>{it.L('The foreign exchange market (Forex) is the world\'s most liquid and most traded market, where trades worth trillions are completed each day.')}</p>
                    <p>{it.L('Forex trading involves buying one currency and selling another currency at the same time. This is why you always see them quoted in pairs. For example: EUR/USD and GBP/USD.')}</p>

                    <HeaderSecondary header={it.L('Which currencies can I trade')} />
                    <p>{it.L('Forex trading involves buying or selling these "currency pairs". When you buy a currency pair such as EUR/USD, it means that you are buying the EURO and selling the USD at the same time.')}</p>
                    <p>{it.L('Currency pairs are categorised as follows:')}</p>
                    <ul className='bullet'>
                        <li>{it.L('Major pairs – Consist of the world\'s most widely traded currency pairs')}</li>
                        <li>{it.L('Minor pairs – Consist of less liquid currency pairs')}</li>
                        <li>{it.L('Exotic pairs – Consist of one non-USD major currency that\'s paired with the currency of an emerging economy. For example: GBP/HKD')}</li>
                    </ul>

                    <HeaderSecondary header={it.L('The spread – why it matters')} />
                    <p>{it.L('When you see currency pairs offered by a broker or trading service, there are usually two prices available: the ask price and the bid price. These are also known as the buy price and the sell price respectively.')}</p>
                    <p>{it.L('The spread is the difference between the ask and bid price.')}</p>
                    <p>{it.L('Based on the table below, can you tell what is the spread for the EUR/USD currency pair?')}</p>

                    <Table
                        scroll
                        data={{
                            thead: [[
                                { text: it.L('Symbol'), className: 'gr-padding-10' },
                                { text: it.L('Bid'),    className: 'gr-padding-10' },
                                { text: it.L('Ask'),    className: 'gr-padding-10' },
                            ]],
                            tbody: [
                                [{ text: 'EUR/USD' }, { text: '1.05652', className: 'loss'   }, { text: '1.05653', className: 'loss'   }],
                                [{ text: 'GBP/USD' }, { text: '1.24509', className: 'loss'   }, { text: '1.24515', className: 'loss'   }],
                                [{ text: 'USD/CHF' }, { text: '1.01010', className: 'loss'   }, { text: '1.01015', className: 'profit' }],
                                [{ text: 'USD/JPY' }, { text: '113.248', className: 'profit' }, { text: '113.251', className: 'profit' }],
                                [{ text: 'USD/CAD' }, { text: '1.31441', className: 'profit' }, { text: '1.31444', className: 'profit' }],
                                [{ text: 'AUD/USD' }, { text: '0.76876', className: 'loss'   }, { text: '0.76879', className: 'loss'   }],
                                [{ text: 'AUD/NZD' }, { text: '1.06683', className: 'profit' }, { text: '1.06691', className: 'profit' }],
                                [{ text: 'AUD/CAD' }, { text: '1.01043', className: 'profit' }, { text: '1.01050', className: 'loss'   }],
                                [{ text: 'AUD/CHF' }, { text: '0.77652', className: 'loss'   }, { text: '0.77658', className: 'profit' }],
                            ],
                        }}
                    />

                    <p>{it.L('Let\'s calculate the spread for EUR/USD:')}</p>

                    <Box text={`${it.L('Ask price')} – ${it.L('Bid price')} = ${it.L('Spread')}`} text_two='1.05653 – 1.05652 = 0.00001' />

                    <HeaderSecondary header={it.L('What time is the market open for me to trade')} />
                    <p>{it.L('The Forex is an over-the-counter market where trading takes place between two parties, and not with a centralised exchange or marketplace.')}</p>
                    <p>{it.L('Depending on your broker or trading platform, you can start trading from the time the Sydney market opens on Monday morning to the time the New York market closes on Friday evening – up to 24 hours a day, five days a week.')}</p>
                    <p>{it.L('[_1] clients can trade Forex from Sunday 21:00 GMT to Friday 21:00 GMT.', it.website_name)}</p>
                </Section>
                <Section id='how-to-trade-forex' header={it.L('How to trade Forex')}>
                    <p>{it.L('A Forex trader always has one objective in mind when trading: to exchange one currency for another in order to make a profit.')}</p>
                    <p>{it.L('This is why we\'ve come up with the following three-step tutorial to help you bridge that gap and make your first trade:')}</p>

                    <HeaderSecondary header={it.L('Step 1: Learn to read currency pairs')} />
                    <p>{it.L('One of the first things most Forex traders learn is how to read a currency pair. There are two parts to a currency pair')}</p>
                    <h1 className='center-text'><strong><span className='primary-color'>EUR /</span> USD</strong></h1>
                    <div className='gr-row'>
                        <div className='gr-6 align-end'>
                            <div className='primary-color gr-padding-10 gr-parent'><strong>{it.L('Base currency')}</strong></div>
                            {it.L('Also known as transaction currency')}
                        </div>
                        <div className='gr-6 align-start'>
                            <div className='secondary-color gr-padding-10 gr-parent'><strong>{it.L('Quote currency')}</strong></div>
                            {it.L('Also known as counter currency')}
                        </div>
                    </div>
                    <p><strong>{it.L('Tips')}</strong></p>
                    <ul className='bullet'>
                        <li>{it.L('The base currency is always equal to one unit.')}</li>
                        <li>{it.L('The ask price of the currency pair indicates how much of the quote currency is required to buy one unit of base currency. This is more commonly known as the exchange rate.')}</li>
                    </ul>
                    <p>{it.L('For example, if you see that the EUR/USD has an ask price of 1.05382, you\'ll sell USD 1.05382 (quote currency) for every EUR 1 (base currency) you buy.')}</p>
                    <p>{it.L('If the bid price is 1.05229, you\'ll buy USD 1.05229 for every EUR 1 you sell.')}</p>

                    <HeaderSecondary header={it.L('Step 2: Understand when to buy and when to sell')} />
                    <p>{it.L('Think that a certain currency will go up or down? Learn when you should buy (or "go long") and when to sell (or "go short").')}</p>
                    <p>{it.L('Traders choose to buy a certain currency pair if they think the value of the base currency will rise. The opposite is also true: they sell a certain currency pair if they think the value of the base currency will fall.')}</p>
                    <p>{it.L('Let\'s compare the differences between buying and selling, using the EUR/USD as an example:')}</p>
                    <BuySellCurrency currency_one={it.L('EUR')} currency_two={it.L('USD')} />

                    <HeaderSecondary header={it.L('Step 3: How to purchase your first currency pair')} />
                    <p>{it.L('After you\'ve decided which position you want to take, your next step is to purchase that currency pair on MetaTrader 5')}.</p>
                    <p>{it.L('Here\'s an example of the EUR/USD currency pair and its bid-ask price:')}</p>
                    <img className='gr-6 gr-12-m gr-no-gutter' src={it.url_for('images/pages/get-started/mt5/forex/price.png')} />
                    <p>{it.L('To go long, you\'ll want to click on \'Buy\' to purchase EUR 1 for USD 1.17726')}</p>
                    <p>{it.L('To go short, you\'ll click on \'Sell\' to sell EUR 1 and receive USD 1.17725 in return.')}</p>
                </Section>
                <Section id='margin-policy' header={it.L('Forex margin policy')}>
                    <p>{it.L('Margin allows you to trade on leverage – meaning your existing capital can give you a much higher level of market exposure.')}</p>
                    <p>{it.L('For example, if you wanted to purchase 100 units of a particular asset that\'s trading at USD 50 per unit through a traditional broker, it would typically cost you USD 5,000 for this transaction.')}</p>
                    <p>{it.L('However, with leverage you can purchase those 100 units at a fraction of the typical cost – depending on the leverage afforded to you by your broker or trading platform.')}</p>

                    <HeaderSecondary header={it.L('How to calculate margin')} />
                    <p>{it.L('You can determine the margin for our currency pairs by using the formula below:')}</p>

                    <MtBox icon_1='l1-icon' icon_2='l2-icon' text={it.L('For example, if you buy one lot of the EUR/USD pair with a contract size of 100,000 and leverage of 100:1, the margin that you need to purchase one lot of EUR/USD will be calculated as follows:')} />

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
                <Section id='contract-specification' header={it.L('Forex contract specifications')}>
                    <HeaderSecondary header={it.L('Major pairs')} />
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
                                [{ text: 'AUD/CAD' }, { text: it.L('Australian Dollar vs Canadian Dollar')    }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'AUD/CHF' }, { text: it.L('Australian Dollar vs Swiss Franc')        }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'AUD/JPY' }, { text: it.L('Australian Dollar vs Japanese Yen')       }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'AUD/NZD' }, { text: it.L('Australian Dollar vs New Zealand Dollar') }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'AUD/USD' }, { text: it.L('Australian Dollar vs US Dollar')          }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/AUD' }, { text: it.L('Euro vs Australian Dollar')               }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/CAD' }, { text: it.L('Euro vs Canadian Dollar')                 }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/CHF' }, { text: it.L('Euro vs Swiss Franc')                     }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/GBP' }, { text: it.L('Euro vs Great Britain Pound')             }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/JPY' }, { text: it.L('Euro vs Japanese Yen')                    }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/NZD' }, { text: it.L('Euro vs New Zealand Dollar')              }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/USD' }, { text: it.L('Euro vs US Dollar')                       }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'GBP/CHF' }, { text: it.L('Great Britain Pound vs Swiss Franc')      }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'GBP/JPY' }, { text: it.L('Great Britain Pound vs Japanese Yen')     }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'GBP/USD' }, { text: it.L('Great Britain Pound vs US Dollar')        }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'NZD/USD' }, { text: it.L('New Zealand Dollar vs US Dollar')         }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/CAD' }, { text: it.L('US Dollar vs Canadian Dollar')            }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/CHF' }, { text: it.L('US Dollar vs Swiss Franc')                }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/JPY' }, { text: it.L('US Dollar vs Japanese Yen')               }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                            ],
                        }}
                    />

                    <HeaderSecondary header={it.L('Minor pairs')} />
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
                                [{ text: 'CAD/CHF' }, { text: it.L('Canadian Dollar vs Swiss Franc')            }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'CAD/JPY' }, { text: it.L('Canadian Dollar vs Japanese Yen')           }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/NOK' }, { text: it.L('Euro vs Norwegian Krone')                   }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/PLN' }, { text: it.L('Euro vs Polish Zloty')                      }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/SEK' }, { text: it.L('Euro vs Swedish Krona')                     }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'GBP/AUD' }, { text: it.L('Great Britain Pound vs Australian Dollar')  }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'GBP/CAD' }, { text: it.L('Great Britain Pound vs Canadian Dollar')    }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'GBP/NOK' }, { text: it.L('Great Britain Pound vs Norwegian Krone')    }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'GBP/NZD' }, { text: it.L('Great Britain Pound vs New Zealand Dollar') }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'GBP/SEK' }, { text: it.L('Great Britain Pound vs Swedish Krona')      }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'NZD/CAD' }, { text: it.L('New Zealand Dollar vs Canadian Dollar')     }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'NZD/JPY' }, { text: it.L('New Zealand Dollar vs Japanese Yen')        }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/CNH' }, { text: it.L('US Dollar vs Chinese Renminbi')             }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/MXN' }, { text: it.L('US Dollar vs Mexican Peso')                 }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/NOK' }, { text: it.L('US Dollar vs Norwegian Krone')              }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/PLN' }, { text: it.L('US Dollar vs Polish Zloty')                 }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/SEK' }, { text: it.L('US Dollar vs Swedish Krona')                }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/ZAR' }, { text: it.L('US Dollar vs South African Rand')           }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                            ],
                        }}
                    />

                    <HeaderSecondary header={it.L('Exotic pairs')} />
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
                                [{ text: 'AUD/SGD' }, { text: it.L('Australian Dollar vs Singapore Dollar')   }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'CHF/JPY' }, { text: it.L('Swiss Franc vs Japanese Yen')             }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/SGD' }, { text: it.L('Euro vs Singapore Dollar')                }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'EUR/TRY' }, { text: it.L('Euro vs Turkish Lira')                    }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'GBP/SGD' }, { text: it.L('Great Britain Pound vs Singapore Dollar') }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'HKD/JPY' }, { text: it.L('Hong Kong Dollar vs Japanese Yen')        }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'NZD/CHF' }, { text: it.L('New Zealand Dollar vs Swiss Franc')       }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'NZD/SGD' }, { text: it.L('New Zealand Dollar vs Singapore Dollar')  }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/HKD' }, { text: it.L('US Dollar vs Hong Kong Dollar')           }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/RUB' }, { text: it.L('US Dollar vs Russian Ruble')              }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/SGD' }, { text: it.L('US Dollar vs Singapore Dollar')           }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                                [{ text: 'USD/TRY' }, { text: it.L('US Dollar vs Turkish Lira')               }, { text: hundred_thousand }, { text: hundredth }, { text: hundredth }],
                            ],
                        }}
                    />

                    <HeaderSecondary header={it.L('How to read the contract specifications table')} />
                    <p>{it.L('The Forex is typically traded in <i>lots</i>. One standard <i>lot</i> is equivalent to 100,000 units. Each time you open a position on a currency symbol, you can start with a minimum transaction of <i>0.01 lots</i>.')}</p>
                    <p>{it.L('For information about Forex leverage refer to our [_1]Margin Policy[_2].', '<a href="#margin-policy">', '</a>')}</p>

                    <HeaderSecondary header={it.L('Important notes on our swap rates (overnight funding)')} />
                    <p>{it.L('If you keep any positions open overnight, an interest adjustment will be made to your trading account as indication of the cost required to keep your position open.')}</p>
                    <p>{it.L('This interest adjustment (or swap rate) is based on interbank lending rates, on top of a 2% fee.')}</p>
                    <p>{it.L('The interest adjustment is calculated in \'points\' – meaning we will convert the relevant interbank lending rates to \'points\' in the base currency.')}</p>
                    <p>{it.L('Please take note that our swap rate also depends on the time and days you hold your positions open:')}</p>
                    <ul className='bullet'>
                        <li>{it.L('You will be subjected to swap rates if you keep a position open past 23:59:59 GMT.')}</li>
                        <li>{it.L('Positions that are still open on Wednesday at 23:59:59 GMT will be charged three times the swap rate to account for weekends – a standard practice for all Forex brokers.')}</li>
                        <li>{it.L('Our swap rate may also be adjusted to take holidays into account.')}</li>
                    </ul>
                </Section>

                <NavButtons parent='mt5' section='forex' />
            </div>
        </div>
    </div>
);

export default Forex;
