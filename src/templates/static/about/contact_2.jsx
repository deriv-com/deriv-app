import React               from 'react';
import { Select, InfoBox } from '../../_common/components/elements.jsx';

const support_email = 'support@binary.com';

const Contact2 = () => (
    <div className='container' id='contact_content'>
        <div className='gr-row gr-parent static_full border-bottom gr-padding-30'>
            <div className='contact-content'>
                <h1 className='center-text'>{it.L('Contact us')}</h1>
                <div className='gr-row'>
                    <div className='gr-8 gr-8-t gr-7-p gr-12-m'>
                        <div className='gr-padding-10 gr-parent'>
                            <div className='gr-row'>
                                <div className='gr-3 gr-4-p gr-4-m'>
                                    <img className='responsive' src={it.url_for('images/pages/contact_2/contact-icon.svg')} />
                                </div>
                                <div className='gr-9 gr-8-p gr-8-m'>
                                    <div className='gr-row'>
                                        <div className='gr-12'>
                                            <label htmlFor='cs_telephone_number'><strong>{it.L('Telephone:')}</strong></label>
                                        </div>
                                        <div className='gr-12 gr-padding-10'>
                                            <Select
                                                id='cs_telephone_number'
                                                options={[
                                                    { text: it.L('Australia'),      value: it.L('[_1] (Toll Free)', '+61 (02) 8294 5448, 1800 093570') },
                                                    { text: it.L('Ireland'),        value: it.L('[_1] (Toll Free)', '+353 (0) 76 888 7500, 1800931084') },
                                                    { text: it.L('Poland'),         value: '+48 58 881 00 02' },
                                                    { text: it.L('Russia'),         value: it.L('[_1] (Toll Free)', '8 10 8002 8553011') },
                                                    { text: it.L('United Kingdom'), value: it.L('[_1] (Toll Free)', '+44 (0) 1666 800042, 0800 011 9847'), selected: true },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    <div className='gr-row'>
                                        <div className='gr-12' id='display_cs_telephone'>
                                            <a href='tel: +44 (0) 1666 800042'>
                                                {('+44 (0) 1666 800042')}
                                            </a>
                                            <br />
                                            {it.L('[_1] (Toll Free)', '<a href="tel:0800 011 9847">0800 011 9847</a>')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='gr-row'>
                            <div className='gr-11 gr-10-t gr-12-p gr-12-m'>
                                <p>{it.L('If you are not located in the above-mentioned countries, simply dial any of our contact numbers for help.')}</p>
                            </div>
                        </div>
                        <div className='hint calls_recording'>
                            * {it.L('All calls are recorded for training and monitoring purposes')}
                        </div>
                        <div className='gr-parent'>
                            <div className='chat'>
                                <div className='chat-container'>
                                    <img className='chat-icon' src={it.url_for('images/pages/contact_2/chat-icon.svg')} />
                                    <a className='button-secondary' rel='noopener noreferrer' id='chat_button'>
                                        <span>{it.L('Live chat')}</span>
                                    </a>
                                </div>
                                <div className='hint gr-padding-10 gr-child'>
                                    { /*  &zwj; to prevent number linking as phone number in iOS  */ }
                                    <p className='no-margin'>{it.L('Weekdays:')} &zwj;2200 - 1300 GMT</p>
                                    <p className='no-margin'>{it.L('Weekend:')} &zwj;0000 - 0900 GMT</p>
                                </div>
                            </div>
                        </div>
                        <div className='gr-parent invisible' id='live_chat_unavailable'>
                            <p className='notice-msg center-text'>
                                {it.L('Sorry, live chat is currently unavailable. Please email us at [_1].', '<a href=\'mailto:support@binary.com\'>support@binary.com</a>')}
                            </p>
                        </div>
                    </div>
                    <div className='gr-4 gr-4-t gr-5-p gr-12-m'>
                        <div className='gr-padding-10 gr-parent'>
                            <p className='no-margin'><strong>{it.L('Email:')}</strong></p>
                        </div>
                        <div className='gr-padding-10 gr-parent'>
                            <p className='no-margin'>{it.L('For general support:')}</p>
                        </div>
                        <div className='gr-padding-10 gr-parent u-mar-bottom-small'>
                            <a href={(`mailto:${support_email}`)} rel='nofollow'>{support_email}</a>
                        </div>
                        <div className='gr-padding-10 gr-parent'>
                            <p className='no-margin'>{it.L('For payments-related queries:')}</p>
                        </div>
                        <div className='gr-padding-10 gr-parent u-mar-bottom-small'>
                            <a href='mailto:payments@binary.com'>payments@binary.com</a>
                        </div>
                        <div className='gr-padding-10 gr-parent'>
                            <p className='no-margin'>{it.L('For affiliate, partnership, and other marketing-related queries:')}</p>
                        </div>
                        <div className='gr-padding-10 gr-parent'>
                            <a href='mailto:marketing@binary.com'>marketing@binary.com</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='gr-padding-30' id='company_addresses'>
            <div className='gr-padding-20 center-text gr-parent'>
                <h1>{it.L('Company addresses')}</h1>
            </div>
            <div className='gr-row'>
                <InfoBox padding='6' header={it.L('Malta')}       text={it.L('Binary (Europe) Ltd & Binary Investments (Europe) Ltd, W Business Centre, Level 3, Triq Dun Karm, Birkirkara, BKR 9033')} />
                <InfoBox padding='6' header={it.L('Isle of Man')} text={it.L('Binary (IOM) Ltd, First Floor, Millennium House, Victoria Road, Douglas, IM2 4RW')} />
            </div>

            <div className='gr-hide-p gr-hide-m gr-padding-20' />

            <div className='gr-row'>
                <InfoBox padding='6' header={it.L('Malaysia')} sub_header={it.L('Cyberjaya Office')} text={it.L('Binary Group Services Sdn. Bhd., C-13, iTech Tower, Jalan Impact, Cyber 6, 63000 Cyberjaya, Selangor Darul Ehsan')} />
                <InfoBox padding='6' header={it.L('Malaysia')} sub_header={it.L('Labuan')} text={it.L('Binary (FX) Ltd, Lot No. F16, First Floor, Paragon Labuan, Jalan Tun Mustapha, 87000 Federal Territory of Labuan')} />
            </div>
        </div>
    </div>
);

export default Contact2;
