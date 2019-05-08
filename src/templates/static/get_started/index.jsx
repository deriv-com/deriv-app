import React             from 'react';
import { Button }        from '../../_common/components/elements.jsx';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';
import {
    TabContainer,
    TabContent,
    TabContentContainer,
    TabsSubtabs }        from '../../_common/components/tabs.jsx';

const GetStartedSection = ({ link, hash, image, header, text }) => {
    const href = `${it.url_for(link)}#${hash}`;
    return (
        <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
            <div className='gr-row'>
                <div className='gr-4'>
                    <a href={href}>
                        <img className='responsive' src={it.url_for(`images/pages/get-started/${image}.svg`)} />
                    </a>
                </div>
                <div className='gr-8'>
                    <a href={href}><h3>{header}</h3></a>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    );
};

const GetStartedSectionWrapper = ({
    dataShow,
    section_id,
    section_header,
    section_description,
    section_button_url  = '',
    section_button_text = '',
    children,
}) => (
    <div data-show={dataShow || undefined}>
        <div className='gr-padding-30 gr-parent' id={section_id}>
            <h2>{section_header}</h2>
            <p>{section_description}</p>
            { section_button_url &&
                <div className='gr-row'>
                    <div className='gr-12'>
                        <a className='button' href={it.url_for(section_button_url)}><span>{section_button_text}</span></a>
                    </div>
                </div> }
            {children}
        </div>
        <SeparatorLine invisible className='gr-padding-30' />
    </div>
);

const CTA = () => (
    <div data-show='default'>
        <SeparatorLine show_mobile className='gr-padding-20 gr-child' />
        <div className='center-text'>
            <p>{it.L('Don\'t have a [_1] account yet?', it.website_name)}</p>
            <a className='button' href={it.url_for('new-account')}><span>{it.L('Create free account')}</span></a>
        </div>
    </div>
);

const Index = () => (
    <div className='static_full get-started'>
        <h1 className='center-text'>{it.L('Get Started')}</h1>
        <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
            <TabsSubtabs
                id='get_started_tabs'
                className='gr-padding-20 gr-parent tab-selector-wrapper'
                items={[
                    { id: 'binary',   text: it.L('Binary Options') },
                    { id: 'lookback', text: it.L('Lookbacks') },
                    { id: 'mt5',      text: it.L('MetaTrader 5') },
                    { id: 'get_started_tabs_selector', className: 'tab-selector' },
                ]}
            />
            <div className='tab-content'>
                <TabContentContainer>
                    <TabContent id='binary'>
                        <h2>{it.L('Binary Options')}</h2>
                        <p>{it.L('Options that offer a fixed payout based on a simple yes/no proposition.')}</p>
                        <div className='gr-row' id='binary-options'>
                            <GetStartedSection
                                link='get-started/binary-options'
                                hash='what-are-binary-options'
                                image='binary-options/what-are-binary-option'
                                header={it.L('What are binary options')}
                                text={it.L('Understand the simple idea behind binary options and their advantages over other financial instruments.')}
                            />
                            <GetStartedSection
                                link='get-started/binary-options'
                                hash='how-to-trade-binary'
                                image='binary-options/how-to-trade-binary'
                                header={it.L('How to trade binary options')}
                                text={it.L('Learn how to trade with our award-winning binary options platform in this simple step-by-step guide.')}
                            />
                            <GetStartedSection
                                link='get-started/binary-options'
                                hash='types-of-trades'
                                image='binary-options/types-of-trades'
                                header={it.L('Types of trades')}
                                text={it.L('Learn about the types of trades that can help you execute your trading strategy on rising, falling, and even sideways markets.')}
                            />
                            <GetStartedSection
                                link='get-started/binary-options'
                                hash='range-of-markets'
                                image='binary-options/range-of-markets'
                                header={it.L('Range of markets')}
                                text={it.L('Trade binary options on a wide range of underlying markets with limited risk.')}
                            />
                            <GetStartedSection
                                link='get-started/binary-options'
                                hash='glossary'
                                image='binary-options/glossary'
                                header={it.L('Glossary')}
                                text={it.L('Check out some technical terms before you start.')}
                            />
                        </div>
                        <CTA />
                    </TabContent>
                    <TabContent id='mt5'>
                        <h2>{it.L('MetaTrader 5')}</h2>
                        <p>{it.L('Trade Forex, Contracts for Difference (CFDs), and binary options on MetaTrader 5 - a multi-asset platform that offers outstanding trading possibilities and technical analysis tools.')}</p>

                        <SeparatorLine invisible className='gr-padding-30' />

                        <GetStartedSectionWrapper
                            section_id='forex'
                            section_header={it.L('Forex')}
                            section_description={it.L('The Foreign Exchange Market (Forex) is the world\'s largest and most liquid market – where anyone can buy, sell, and exchange currencies.')}
                        >
                            <div className='gr-row'>
                                <GetStartedSection
                                    link='get-started/forex'
                                    hash='what-forex-trading'
                                    image='mt5/what-forex-trading'
                                    header={it.L('What is Forex trading')}
                                    text={it.L('New to Forex? We explain the basics of the world\'s largest and most liquid market.')}
                                />
                                <GetStartedSection
                                    link='get-started/forex'
                                    hash='how-to-trade-forex'
                                    image='mt5/how-to-trade-forex'
                                    header={it.L('How to trade Forex')}
                                    text={it.L('Learn how to read currency pairs, when to go long or short, and how to buy your first currency pair.')}
                                />
                                <GetStartedSection
                                    link='get-started/forex'
                                    hash='margin-policy'
                                    image='mt5/margin-policy'
                                    header={it.L('Forex margin policy')}
                                    text={it.L('Not sure how margin works? Read our margin policy and learn how to calculate the margin for our currency pairs.')}
                                />
                                <GetStartedSection
                                    link='get-started/forex'
                                    hash='contract-specification'
                                    image='mt5/contract-specification'
                                    header={it.L('Forex contract specifications')}
                                    text={it.L('Find out more about the costs and details of every currency pair we offer.')}
                                />
                            </div>
                        </GetStartedSectionWrapper>
                        <GetStartedSectionWrapper
                            dataShow='-default'
                            section_id='cryptocurrencies'
                            section_header={it.L('Cryptocurrencies')}
                            section_description={it.L('Cryptocurrencies such as Bitcoin and Ethereum are decentralised digital assets that enable instant payments to anywhere in the world.')}
                        >
                            <div className='gr-row'>
                                <GetStartedSection
                                    link='get-started/cryptocurrencies'
                                    hash='what-crypto-trading'
                                    image='mt5/what-crypto-trading'
                                    header={it.L('What is cryptocurrency trading')}
                                    text={it.L('Speculate on the price movement of cryptocurrencies such as Bitcoin, Ethereum, and Litecoin without owning them.')}
                                />
                                <GetStartedSection
                                    link='get-started/cryptocurrencies'
                                    hash='how-trade-crypto'
                                    image='mt5/how-trade-crypto'
                                    header={it.L('How to trade cryptocurrencies')}
                                    text={it.L('Trade popular cryptocurrencies on our MT5 platform with leverage and variable spreads. No wallets are required to start trading.')}
                                />
                                <GetStartedSection
                                    link='get-started/cryptocurrencies'
                                    hash='margin-policy'
                                    image='mt5/margin-policy'
                                    header={it.L('Cryptocurrency margin policy')}
                                    text={it.L('Not sure how margin works? Read our margin policy and learn how to calculate the margin for our cryptocurrency pairs.')}
                                />
                                <GetStartedSection
                                    link='get-started/cryptocurrencies'
                                    hash='contract-specification'
                                    image='mt5/contract-specification'
                                    header={it.L('Cryptocurrency contract specifications and commission scheme')}
                                    text={it.L('Find out more about the costs and details of every cryptocurrency pair we offer.')}
                                />
                            </div>
                        </GetStartedSectionWrapper>
                        <GetStartedSectionWrapper
                            section_id='cfds'
                            section_header={it.L('CFDs')}
                            section_description={it.L('Contracts for Difference (CFDs) are financial derivatives that allow you to trade on the movement of underlying assets without owning them.')}
                        >
                            <div className='gr-row'>
                                <GetStartedSection
                                    link='get-started/cfds'
                                    hash='what-cfds-trading'
                                    image='mt5/what-cfds-trading'
                                    header={it.L('What is CFD trading')}
                                    text={it.L('Read our simple introduction to this popular derivative instrument to find out what you can trade with CFDs and their advantages.')}
                                />
                                <GetStartedSection
                                    link='get-started/cfds'
                                    hash='how-trade-cfds'
                                    image='mt5/how-trade-cfds'
                                    header={it.L('How to trade CFDs')}
                                    text={it.L('Plan to start trading CFDs? Learn when to buy and sell, how to calculate your profits and losses, and how to close a position.')}
                                />
                                <GetStartedSection
                                    link='get-started/cfds'
                                    hash='margin-policy'
                                    image='mt5/margin-policy'
                                    header={it.L('CFD margin policy')}
                                    text={it.L('Not sure how margin works? Read our margin policy and learn how to calculate the margin for our CFDs.')}
                                />
                                <GetStartedSection
                                    link='get-started/cfds'
                                    hash='contract-specification'
                                    image='mt5/contract-specification'
                                    header={it.L('CFD contract specifications')}
                                    text={it.L('Find out more about the costs and details of each CFD asset we offer.')}
                                />
                            </div>
                        </GetStartedSectionWrapper>
                        <GetStartedSectionWrapper
                            section_id='metals'
                            section_header={it.L('Metals')}
                            section_description={it.L('Diversify your portfolio with all four types of precious metals that are widely known as "safe haven" investments: gold, silver, platinum, and palladium.')}
                        >
                            <div className='gr-row'>
                                <GetStartedSection
                                    link='get-started/metals'
                                    hash='what-metals-trading'
                                    image='mt5/what-metals-trading'
                                    header={it.L('What is metals trading')}
                                    text={it.L('Learn the basics of metals trading and the categories of metals available.')}
                                />
                                <GetStartedSection
                                    link='get-started/metals'
                                    hash='how-trade-metals'
                                    image='mt5/how-trade-metals'
                                    header={it.L('How to trade metals')}
                                    text={it.L('Buy or sell all four available precious metals – depending on your market view. Also, learn what factors affect prices.')}
                                />
                                <GetStartedSection
                                    link='get-started/metals'
                                    hash='margin-policy'
                                    image='mt5/margin-policy'
                                    header={it.L('Metals margin policy')}
                                    text={it.L('Not sure how margin works? Read our margin policy and learn how to calculate the margin for our metal pairs.')}
                                />
                                <GetStartedSection
                                    link='get-started/metals'
                                    hash='contract-specification'
                                    image='mt5/contract-specification'
                                    header={it.L('Metals contract specifications')}
                                    text={it.L('Find out more about the costs and details of every metal pair we offer.')}
                                />
                            </div>
                        </GetStartedSectionWrapper>
                        <GetStartedSectionWrapper
                            section_id='binary-options-mt5'
                            section_header={it.L('Binary Options on MT5')}
                            section_description={it.L('Explore a whole new world of binary options trading with the world\'s leading multi-asset platform.')}
                        >
                            <div className='gr-row'>
                                <GetStartedSection
                                    link='get-started/binary-options-mt5'
                                    hash='what-are-binary-options'
                                    image='mt5/what-binary-trading'
                                    header={it.L('Introduction to binary options on MT5')}
                                    text={it.L('Binary options trading is now available on our MT5 platform. Learn more about its benefits and available markets.')}
                                />
                                <GetStartedSection
                                    link='get-started/binary-options-mt5'
                                    hash='how-to-trade-binary'
                                    image='mt5/how-trade-binary'
                                    header={it.L('How to trade binary options on MT5')}
                                    text={it.L('Follow our step-by-step guide to start trading binary options on MT5.')}
                                />
                                <GetStartedSection
                                    link='get-started/binary-options-mt5'
                                    hash='types-of-trades'
                                    image='binary-options/types-of-trades'
                                    header={it.L('Types of trades')}
                                    text={it.L('The various trade types available on our MT5 platform.')}
                                />
                            </div>
                            <div className='center-text gr-padding-20'>
                                <Button
                                    className='button'
                                    href={it.url_for('user/metatrader')}
                                    text={it.L('Create an MT5 account now')}
                                />
                            </div>
                        </GetStartedSectionWrapper>
                        <CTA />
                    </TabContent>
                    <TabContent id='lookback'>
                        <h2>{it.L('Lookbacks')}</h2>
                        <h3>{it.L('What are lookbacks')}</h3>
                        <p>{it.L('A lookback contract has a payout that depends on the optimum high or low achieved by the market. The option allows the holder to "look back" over time to determine the payout.')}</p>
                        <SeparatorLine invisible className='gr-padding-10' />
                        <h3>{it.L('Types of lookbacks')}</h3>
                        <p>{it.L('We offer three types of lookbacks:')}</p>
                        <div className='gr-row'>
                            <div className='gr-4 gr-12-m gr-padding-10 gr-child'>
                                <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/high-close.svg`)} />
                                <ul className='checked'>
                                    <li>{it.L('High-Close')}</li>
                                </ul>
                                <p>{it.L('Win the multiplier times the high minus close.')}</p>
                            </div>
                            <div className='gr-4 gr-12-m gr-padding-10 gr-child'>
                                <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/close-low.svg`)} />
                                <ul className='checked'>
                                    <li>{it.L('Close-Low')}</li>
                                </ul>
                                <p>{it.L('Win the multiplier times the close minus low.')}</p>
                            </div>
                            <div className='gr-4 gr-12-m gr-padding-10 gr-child'>
                                <img className='responsive' src={it.url_for(`images/pages/trade-explanation/${it.language.toLowerCase()}/high-low.svg`)} />
                                <ul className='checked'>
                                    <li>{it.L('High-Low')}</li>
                                </ul>
                                <p>{it.L('Win the multiplier times the high minus low.')}</p>
                            </div>
                        </div>
                        <SeparatorLine invisible />
                        <p>{it.L('For example, let\'s say the market has a low of 5,200 and a close of 6,000 over the contract duration, then a "Close-Low" lookback with a multiplier of $2 would have a payout of:')}</p>
                        <div className='formula center-text'>
                            <span>{it.L('2 * (6,000 – 5,200) = $1600')}</span>
                        </div>
                        <p>{it.L('Lookbacks options are currently only available for [_1]Volatility Indices[_2].', `<a href=${it.url_for('get-started/binary-options')}?anchor=volatility-indices#range-of-markets>`, '</a>')}</p>
                        <p>{it.L('Return to player (RTP) % for lookbacks for a multiplier of 1 and 1m duration is around 87% on average.')}</p>
                        <CTA />
                    </TabContent>
                </TabContentContainer>
            </div>
        </TabContainer>
    </div>
);

export default Index;
