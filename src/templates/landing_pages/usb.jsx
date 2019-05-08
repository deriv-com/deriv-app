import React from 'react';
import Layout from './_common/layout.jsx';

const UsbPage = () => (
    <Layout
        meta_description={`${it.broker_name} Introducing USB`}
        css_files={[
            it.url_for('css/usb_style.css'),
            'https://style.binary.com/binary.css',
            'https://style.binary.com/binary.more.css',
        ]}
        js_files={[
            'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',
            'https://style.binary.com/binary.more.js',
            'https://academy.binary.com/js/animate.min.js',
            it.url_for('js/landing_pages/common.js'),
            it.url_for('js/landing_pages/usb_page.js'),
        ]}
    >

        <div id='page-top' />
        <nav className='navbar navbar-custom navbar-fixed-top' role='navigation'>
            <div className='navbar-container'>
                <div className='nav-col-left'>
                    <div className='logo-wrapper'>
                        <a className='logo-parent' href={it.url_for('home')}>
                            <div className='logo'>
                                <div />
                            </div>
                            <div className='mobile-hide binary-logo-text'>
                                <div />
                            </div>
                        </a>
                    </div>
                </div>
                <div className='nav-col-right'>
                    <div id='push' className='grill grill-ico' />
                    <div id='push-nav' className='topnav'>
                        <a className='page-scroll' href='#video'>{('Overview')}</a>
                        <a className='page-scroll' href='#why-usb'>{('Why USB')}</a>
                        <a className='page-scroll' href='#get-started'>{('Get started')}</a>
                        <a className='page-scroll' href='#tech'>{('Technology')}</a>
                        <a className='page-scroll' href='#faq'>{('FAQ')}</a>
                    </div>
                </div>
            </div>
        </nav>
        <div className='home--header'>
            <div className='header-content'>
                <h1 className='header-title content-inverse-color ft-300'>{('Welcome to the future')}</h1>
                <span className='header-sub secondary-color'>{('Introducing USB')}</span>
                <span className='header-sub content-inverse-color'>{('A stablecoin backed by the US Dollar')}</span>
            </div>
        </div>
        <div className='section-md primary-bg-color coin-section'>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-middle'>
                    <div className='gr-2 gr-12-m gr-12-p'>
                        <img className='usb-coin' src={it.url_for('images/usb_page/usb-coin-logo.png')} alt='USB' />
                    </div>
                    <div className='gr-10 gr-12-m gr-12-p'>
                        <p className='content-inverse-color ft-400'>{('Guaranteed by ')}{it.broker_name}{(', USB is a digital currency pegged to the US Dollar on a one-to-one basis. Send and receive payments with the peace of mind that your currency is backed by the strength of ')}{it.broker_name}{(' balance sheet.')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id='video' className='dark-grey-bg section-md'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <h2 className='section-title primary-color'>{('An overview of the ')}{it.broker_name}{(' USB stablecoin')}</h2>
                        <p>{('Put your confidence in an optimal currency backed by a market leader.')}</p>
                    </div>
                </div>
            </div>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-center'>
                    <div className='gr-9'>
                        <div className='separator-md' />
                        <div className='video-container'>
                            <iframe src='https://www.youtube.com/embed/cdkwhBK5fnk?rel=0&showinfo=0' frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
                        </div>
                        <div className='separator-md' />
                    </div>
                </div>
                <div className='gr-row gr-row-align-center'>
                    <div className='gr-12'>
                        <p>{('Explore the possibilities of a new generation of cryptocurrency')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id='why-usb' className='section-md'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12 center-text bottom-50'>
                        <h2 className='section-title'>{('Why USB?')}</h2>
                        <p>{('The value of USB is pegged to the US Dollar, so you get the best of both worlds: the benefits of decentralised digital assets and the stability of fiat currencies.')}</p>
                    </div>
                </div>
            </div>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-between'>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-redeem' />
                        <h3 className='ft-400'>{('Fully backed by US Dollar')}</h3>
                        <p>{('USB is a stable coin pegged to the US Dollar on a one-to-one basis. ')}{it.broker_name}{(' guarantees that 1 USB will always be worth 1 USD.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-redeem-usd' />
                        <h3 className='ft-400'>{('Redeem for USD anytime')}</h3>
                        <p>{('To redeem USB for USD, complete the ')}{it.broker_name}{(' KYC check, then perform the conversion using our ')}<a href={it.url_for('cashier/account_transfer')}>{('transfer between accounts')}</a> {('facility.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-peaceofmind' />
                        <h3 className='ft-400'>{('Peace of mind')}</h3>
                        <p>{('USB is backed by ')}{it.broker_name}{(' – a profitable, 18-year-old company with')} <a href={it.url_for('binary-in-numbers')}>{('annual turnover exceeding USD 1 billion')}</a>.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='gr-row'>
                <div className='gr-12'>
                    <div className='separator-line-thin-gray' />
                </div>
            </div>
        </div>
        <div id='usb-clients' className='section-md'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12 bottom-50'>
                        <h2 className='section-title'>{('Who is it for?')}</h2>
                        <p>{('USB can be used by anyone for any transaction that requires a stable currency, including:')}</p>
                    </div>
                </div>
            </div>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-between'>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-clients' />
                        <h3 className='ft-400'>{it.broker_name}{(' clients')}</h3>
                        <p>{('Trade on ')}{it.broker_name}{(' using USB.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-crypto-traders' />
                        <h3 className='ft-400'>{('Crypto traders')}</h3>
                        <p>{('Use USB to hedge against volatility in the cryptocurrency markets. Move in and out of cryptocurrencies and USB to profit from market swings.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-online-business' />
                        <h3 className='ft-400'>{('Online businesses')}</h3>
                        <p>{('Accept USB in your online store for secure and efficient payments, and avoid the hassle of dealing with banks and credit card companies.')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id='get-started' className='primary-bg-color section-md'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12 bottom-50'>
                        <h2 className='section-title content-inverse-color'>{('How do I start?')}</h2>
                        <p className='content-inverse-color'>{('Start buying USB and store the tokens in a compatible wallet for future transactions:')}</p>
                    </div>
                </div>
            </div>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-between'>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-buy' />
                        <h3 className='ft-400 content-inverse-color'>{('Buy')}</h3>
                        <p className='content-inverse-color'>{('Purchase USB via your ')}{it.broker_name}{(' account. 1 USB is always priced at 1 USD.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-hold' />
                        <h3 className='ft-400 content-inverse-color'>{('Hold')}</h3>
                        <p className='content-inverse-color'>{('Hold your USB in any ERC20-compatible wallet, such as')} <a className='content-inverse-color' href='https://trustwalletapp.com/' target='_blank' rel='noopener noreferrer'>{('Trust Wallet')}</a>.</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-trade' />
                        <h3 className='ft-400 content-inverse-color'>{('Trade')}</h3>
                        <p className='content-inverse-color'>{('We\'re applying for listing of the USB token on major cryptocurrency exchanges.')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id='tech' className='section-md dark-grey-bg'>
            <div className='container'>
                <div className='gr-row'>
                    <div className='gr-12 center-text bottom-50'>
                        <h2 className='section-title primary-color'>{('Technical implementation')}</h2>
                        <p>{('Our USB token is powered by secure and transparent blockchain technology:')}</p>
                    </div>
                </div>
            </div>
            <div className='container center-text'>
                <div className='gr-row gr-row-align-between'>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-contract' />
                        <h3 className='ft-400'>{('Contract address')}</h3>
                        <p>{('USB is an ERC20 token.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-supply' />
                        <h3 className='ft-400'>{('Supply and divisibility')}</h3>
                        <p>{('Each token is divisible to 18 decimal places.')}</p>
                    </div>
                    <div className='gr-3 gr-12-t gr-12-m gr-12-p mb-bottom-30'>
                        <div className='icon-xl icon-source-code' />
                        <h3 className='ft-400'>{('Source code')}</h3>
                        <p>{('The source code of the USB token can be freely')} <a href='http://etherscan.io/address/0xaf8bef28181aa864b3b60cc88d1f3788c1025ecb' target='_blank' rel='noopener noreferrer'>{('audited on Etherscan')}</a>.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='section-md' id='faq'>
            <div className='container center-text'>
                <div className='gr-row'>
                    <div className='gr-12 bottom-50'>
                        <h2 className='section-title'>{it.broker_name} {('USB – Frequently asked questions')}</h2>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <div className='separator-xl' />
                        <div id='accordion'>
                            <h3>{('What is USB?')}</h3>
                            <div>{('USB is a stablecoin exclusively issued by ')}{it.broker_name}{('. It is permanently pegged to the US dollar on a one-to-one basis.')}</div>
                            <h3>{('What are the usages of USB?')}</h3>
                            <div>{('Use USB as normal money. For example, you can initiate trades, payments, and online transactions with USB.')}</div>
                            <h3>{('Why use USB?')}</h3>
                            <div>{('USB has a flat rate: one USB is always equal to one US dollar. Thus, it is as stable and secure as the US dollar. It is also issued and guaranteed by ')}{it.broker_name}{(', a market leader with 18 years of trading history and a billion-dollar annual turnover.')}</div>
                            <h3>{('Who can use USB?')}</h3>
                            <div>{('Anybody who wants to make a transaction with a stable, dependable cryptocurrency can use USB. Crypto traders can use USB to hedge against price volatility in cryptocurrency markets and exchange USB with other cryptocurrencies to benefit from market swings. Online consumers and businesses can use USB to enjoy a more secure and efficient payment method and avoid the hassle of dealing with banks and credit card companies.')}</div>
                            <h3>{('How many USBs are supplied?')}</h3>
                            <div>{('Twenty million.')}</div>
                            <h3>{('How can I get started with USB?')}</h3>
                            <div>
                                <ol>
                                    <li>{('Create an ERC-20 compatible wallet to carry your USB')}</li>
                                    <li>{('Purchase USB on ')}{it.broker_name}</li>
                                    <li>{('Use your USB to trade binary options, Forex, CFDs, and more at ')}{it.broker_name}</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='separator-md' />
        </div>

    </Layout>
);

export default UsbPage;
