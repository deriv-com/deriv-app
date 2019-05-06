import React from 'react';
import PaymentLogo from '../_common/components/payment_logo.jsx';

const Tour = () => (
    <div className='tour container'>
        <div className='static_full'>
            <div className='section border-bottom'>
                <div className='section-content center-text gr-padding-30 gr-parent'>
                    <h1>{it.L('First, define your position...')}</h1>
                    <p>{it.L('When you start trading with [_1], you\'ll be directed to the trading screen, where you set your trading parameters, and choose what you want to trade, how and when.', it.website_name)}</p>
                    <a className='button' href={it.url_for('trading')}>
                        <img className='responsive' src={it.url_for('images/pages/tour/trade-tutorial_1.svg')} />
                    </a>
                </div>
            </div>
            <div className='section border-bottom'>
                <div className='section-content center-text gr-padding-30'>
                    <h1>{it.L('2-way pricing')}</h1>
                    <p>{it.L('Simply change any of your parameters and the trade price instantly changes, giving you real-time knowledge of your stake. [_1] ensures fair and transparent pricing by showing you both sides of the trade.', it.website_name)}</p>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m'>
                            <a className='button' href={it.url_for('trading')}>
                                <img className='responsive' src={it.url_for('images/pages/tour/2-way-pricing_live.svg')} />
                            </a>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <a className='button' href={it.url_for('trading')}>
                                <img className='responsive' src={it.url_for('images/pages/tour/2-way-pricing_opposite.svg')} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='section border-bottom'>
                <div className='section-content center-text gr-padding-30'>
                    <h1>{it.L('Then, make your trade')}</h1>
                    <p>{it.L('As soon as you click on the \'PURCHASE\' button, your trade registers in your account. The price of your trade continues to update in real time.')}</p>
                    <img className='responsive' src={it.url_for('images/pages/tour/tour-portfolio-snapshot_1.svg')} />
                </div>
            </div>
            <div className='section border-bottom'>
                <div className='section-content center-text gr-padding-30'>
                    <h1>{it.L('Exit your trades before expiry')}</h1>
                    <p>{it.L('With [_1], you can sell your contracts before expiry to keep any profits you may have made or to minimise your losses. You don\'t have to wait until the actual expiration time.', it.website_name)}</p>
                </div>
            </div>
            <div className='section border-bottom'>
                <div className='section-content center-text gr-padding-30'>
                    <h1>{it.L('Bank your way')}</h1>
                    <a className='button' href={it.url_for('cashier/payment_methods')}>
                        <span>{it.L('View payment methods')}</span>
                    </a>
                    <p>{it.L('Trade with ease with [_1]\'s wide range of deposit and withdrawal methods. Your funds will be segregated and held in secure and licensed financial institutions.', it.website_name)}</p>
                    <div className='gr-12 gr-padding-30'>
                        <div className='gr-row gr-row-align-center'>
                            <PaymentLogo />
                        </div>
                    </div>
                </div>
            </div>
            <div className='section border-bottom'>
                <div className='section-content center-text gr-padding-30'>
                    <h1>{it.L('Learn from us')}</h1>
                    <p>{it.L('Stay informed. [_1] offers daily market reports and market research, as well as frequent trading webinars.', it.website_name)}</p>
                    <span id='edu-research-tool' />
                    <a className='button' href={it.url_for('resources')}>
                        <img className='responsive' src={it.url_for('images/pages/tour/tour-tools-education.svg')} />
                    </a>
                </div>
            </div>
            <div className='section border-bottom'>
                <div className='section-content center-text gr-padding-30 gr-child'>
                    <h1>{it.L('Talk to us')}</h1>
                    <p>{it.L('Feel free to contact our friendly and helpful customer service experts. They\'re always available to answer your questions. You can contact us via email and telephone.')}</p>
                    <div className='gr-4 gr-8-m gr-centered'>
                        <a className='button' href={it.url_for('contact')}>
                            <img className='responsive' src={it.url_for('images/pages/tour/tour-customer-support.png')} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Tour;
