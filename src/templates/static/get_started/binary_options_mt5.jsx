import React                 from 'react';
import {
    Section,
    HeaderSecondary,
    NavButtons,
    MTAccountOpeningButton } from './common.jsx';
import { List }              from '../../_common/components/elements.jsx';
import { SeparatorLine }     from '../../_common/components/separator_line.jsx';
import Loading               from '../../_common/components/loading.jsx';

const BinaryOptionsForMT5 = () => (
    <div className='static_full get-started'>
        <h1>{it.L('Binary Options on MT5')}</h1>
        <div className='gr-row'>
            <div className='gr-3 gr-hide-m sidebar-container'>
                <div className='sidebar'>
                    <List
                        id='sidebar-nav'
                        items={[
                            { id: 'what-are-binary-options', href: '#what-are-binary-options', text: it.L('Introduction to binary options on MT5') },
                            { id: 'how-to-trade-binary',     href: '#how-to-trade-binary',     text: it.L('How to trade binary options on MT5'), dataShow: '-eucountry' },
                            { id: 'types-of-trades',         href: '#types-of-trades',         text: it.L('Types of trades') },
                        ]}
                    />

                    <MTAccountOpeningButton />
                </div>
            </div>
            <div className='gr-9 gr-12-m'>
                <div id='loading_binary_options_mt5'>
                    <Loading />
                </div>
                <Section id='what-are-binary-options' header={it.L('Introduction to binary options on MT5')}>
                    <p>{it.L('Binary options are now available for you to trade on MT5 – our advanced multi-asset trading platform that offers unlimited trading possibilities.')}</p>

                    <HeaderSecondary header={it.L('Why you should trade binary options on MT5')} />
                    <ul className='checked gr-parent gr-padding-10'>
                        <li>{it.L('Trade binary options and CFDs from the same powerful interface')}</li>
                        <li>{it.L('Use comprehensive technical analysis tools to predict price movements')}</li>
                        <li>{it.L('Monitor your trades easily with real-time visualisations')}</li>
                        <li>{it.L('Access your trading history through our Expert Advisors (EA)')}</li>
                    </ul>

                    <HeaderSecondary header={it.L('Available markets')} />
                    <p>{it.L('Binary options on MT5 are available exclusively on Volatility Indices which are synthetic indices that simulate market volatility and are available for trading 24 hours a day, seven days a week.')}</p>
                    <p className='no-margin gr-padding-10 gr-child'>{it.L('Five total assets are available for you to choose from:')}</p>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m'>
                            <ul className='bullet'>
                                <li>{it.L('Volatility 10 Index')}</li>
                                <li>{it.L('Volatility 25 Index')}</li>
                                <li>{it.L('Volatility 50 Index')}</li>
                            </ul>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <ul className='bullet'>
                                <li>{it.L('Volatility 75 Index')}</li>
                                <li>{it.L('Volatility 100 Index')}</li>
                            </ul>
                        </div>
                    </div>
                    <p>{it.L('Each index corresponds to simulated markets with constant volatilities of 10%, 25%, 50%, 75%, and 100% respectively.')}</p>
                </Section>
                <Section id='how-to-trade-binary' header={it.L('How to trade binary options on MT5')} data-show='-eucountry'>
                    <p>{it.L('Get started with the [_1] Expert Advisor (EA) for binary options trading on MT5 by following these steps:', it.website_name)}</p>

                    <SeparatorLine invisible show_mobile className='gr-padding-10' />

                    <h3 className='secondary-color'>{it.L('Step 1: Log in to MT5 using your MT5 Volatility Indices account')}</h3>
                    <div>
                        <img className='responsive' src={it.url_for('images/pages/get-started/mt5/how-to-trade-binary/step-1.png')} />
                    </div>

                    <SeparatorLine invisible show_mobile className='gr-padding-10' />

                    <h3 className='secondary-color'>{it.L('Step 2: Download the [_1] EA', it.website_name)}</h3>
                    <div className='center-text' id='step-2'>
                        <div>
                            <div className='gr-2 gr-no-gutter gr-centered gr-padding-20 gr-parent'>
                                <img className='responsive' src={it.url_for('images/pages/metatrader/dashboard/ea.svg')} />
                            </div>
                            <h3>{it.L('[_1] Expert Advisor (EA)', it.website_name)}</h3>
                            <p><strong>{it.L('Note:')}</strong>&nbsp;{it.L('This application only supports Windows operating systems.')}</p>
                            <a className='button' href='https://s3.amazonaws.com/binary-mt5/Binary.com%20Expert%20Advisor.ex5' download>
                                <span>{it.L('Download')}</span>
                            </a>
                        </div>
                    </div>

                    <SeparatorLine invisible show_mobile className='gr-padding-10' />

                    <h3 className='secondary-color'>{it.L('Step 3: Double-click the file to add the EA to your MT5 platform')}</h3>
                    <div>
                        <img className='responsive' src={it.url_for('images/pages/get-started/mt5/how-to-trade-binary/step-3.png')} />
                    </div>
                    <p>{it.L('Simply double-click the file to add the EA to your MT5 platform, then, head over to the Navigator window to see if the [_1] EA is available.', it.website_name)}</p>

                    <SeparatorLine invisible show_mobile className='gr-padding-10' />

                    <h3 className='secondary-color'>{it.L('Step 4: Choose asset and open the live chart')}</h3>
                    <div>
                        <img className='responsive' src={it.url_for('images/pages/get-started/mt5/how-to-trade-binary/step-4.png')} />
                    </div>
                    <p>{it.L('Select any of the highlighted symbols above to open a live chart. Right-click and choose \'Chart Window\' to open the live chart.')}</p>

                    <SeparatorLine invisible show_mobile className='gr-padding-10' />

                    <h3 className='secondary-color'>{it.L('Step 5: Enable EA and automated trading')}</h3>
                    <div>
                        <img className='responsive' src={it.url_for('images/pages/get-started/mt5/how-to-trade-binary/step-5.png')} />
                    </div>
                    <p>{it.L('After the live chart is active, double-click on the [_1] EA in the Navigator window. A pop-up window will appear and you will need to check the box labelled \'Allow Automated Trading\'. If automated trading is enabled, you should see the \'Auto Trading\' indicator turn green.', it.website_name)}</p>

                    <SeparatorLine invisible show_mobile className='gr-padding-10' />

                    <h3 className='secondary-color'>{it.L('Step 6: Start trading')}</h3>
                    <div>
                        <img className='responsive' src={it.url_for('images/pages/get-started/mt5/how-to-trade-binary/step-6.png')} />
                    </div>
                    <p>{it.L('Finally, make your prediction: will the market price end up higher or lower than the entry spot at the end of the contract? If you need to review a previous transaction, you may browse your full transaction history via the \'History\' tab.')}</p>

                    <SeparatorLine invisible show_mobile className='gr-padding-10' />
                </Section>
                <Section id='types-of-trades' header={it.L('Types of trades')}>
                    <p>{it.L('We offer the following trade types on our MT5 platform:')}</p>

                    <HeaderSecondary header={it.L('Up/Down')} />
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m'>
                            <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/up.svg`)} />
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/down.svg`)} />
                        </div>
                    </div>
                    <p>{it.L('Predict whether the exit spot will be higher or lower than the entry spot within a selected duration from 5 ticks to 10 ticks, or 1 minute to 5 minutes.')}</p>

                    <HeaderSecondary header={it.L('High Tick/Low Tick')} />
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m'>
                            <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/high-tick.svg`)} />
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/low-tick.svg`)} />
                        </div>
                    </div>
                    <p>{it.L('Predict the highest or lowest tick among the next 5 ticks.')}</p>

                    <HeaderSecondary header={it.L('Matches/Differs')} />
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m'>
                            <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/matches.svg`)} />
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/differs.svg`)} />
                        </div>
                    </div>
                    <p>{it.L('Predict whether the last digit of the last tick will match or differ from your prediction within a selected duration from 5 ticks to 10 ticks.')}</p>

                    <HeaderSecondary header={it.L('Even/Odd')} />
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m'>
                            <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/even.svg`)} />
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/odd.svg`)} />
                        </div>
                    </div>
                    <p>{it.L('Predict whether the last digit of the last tick will be even or odd within a selected duration from 5 ticks to 10 ticks.')}</p>

                    <HeaderSecondary header={it.L('Over/Under')} />
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m'>
                            <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/over.svg`)} />
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/under.svg`)} />
                        </div>
                    </div>
                    <p>{it.L('Predict whether the last digit of the last tick will be greater or less than your prediction within a selected duration from 5 ticks to 10 ticks.')}</p>
                </Section>
                <NavButtons parent='binary' section='binary-options-mt5' />
            </div>
        </div>
    </div>
);

export default BinaryOptionsForMT5;
