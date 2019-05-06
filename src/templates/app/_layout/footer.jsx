import React from 'react';
import { List } from '../../_common/components/elements.jsx';

const FooterColumn = ({ header, items }) => (
    <div className='gr-4'>
        <h4 className='secondary-color'><strong>{header}</strong></h4>
        <List items={items} />
    </div>
);

const SocialIcons = ({ networks }) => (
    <div id='social-icons' className='social-icons flex-row'>
        { networks.map((net, idx) => (
            <a key={idx} href={net.href} target='_blank' rel='noopener noreferrer'>
                <img src={it.url_for(`images/pages/footer/${net.media}.svg`)} />
            </a>
        ))}
    </div>
);

const StatusNotification = () => (
    <div id='status_notification'>
        <div id='status_notification_type'>
            <img src={it.url_for('images/server_status/ic-warning.svg')}  alt='Information icon' />
        </div>
        <p id='status_notification_text' />
        <div id='status_notification_close'>
            <img src={it.url_for('images/server_status/ic-close.svg')}  alt='Warning icon' />
        </div>
    </div>
);

const DialogNotification = () => (
    <div id='dialog_notification' className='primary-bg-color'>
        <p id='dialog_notification_text'>{it.L('Our website uses cookies to give you the best user experience. For more information, [_1]view our policy[_2].', `<a href="${it.url_for('terms-and-conditions')}?anchor=cookies-and-device-information#privacy" target="_blank" rel="noopener noreferrer">`, '</a>')}</p>
        <a className='button-secondary gr-gutter-left gr-no-gutter-m' id='dialog_notification_accept' type='button'><span>{it.L('OK')}</span></a>
    </div>
);

const Footer = () => (
    <div id='footer' className='no-print'>
        <div id='footer-menu' className='primary-bg-color gr-padding-10'>
            <div className='container'>
                <div className='gr-row gr-padding-10'>
                    <div className='gr-6 gr-12-m gr-parent gr-no-gutter gr-padding-30'>
                        <div className='gr-row'>
                            <FooterColumn
                                header={it.L('Our Company')}
                                items={[
                                    { text: it.L('About Us'),               href: it.url_for('about-us') },
                                    { text: it.L('Group History'),          href: it.url_for('group-history') },
                                    { text: it.L('Binary in Numbers'),      href: it.url_for('binary-in-numbers') },
                                    { text: it.L('Careers'),                href: it.url_for('careers') },
                                    { text: it.L('Patents'),                href: it.url_for('legal/us_patents') },
                                    { text: it.L('Contact Us'),             href: it.url_for('contact') },
                                ]}
                            />

                            <FooterColumn
                                header={it.L('Education')}
                                items={[
                                    { text: it.L('Why Us?'),         href: it.url_for('why-us') },
                                    { text: it.L('Getting Started'), href: it.url_for('get-started') },
                                    { text: it.L('Platform Tour'),   href: it.url_for('tour') },
                                    { text: it.L('GamCare'),         href: 'http://www.gamcare.org.uk/',            target: '_blank', dataShow: 'eucountry' },
                                    { text: it.L('Academy'),         href: 'https://academy.binary.com',            target: '_blank' },
                                    { text: it.L('Webinars'),        href: 'https://academy.binary.com/en/events/', target: '_blank' },
                                    { text: it.L('Keep Safe'),       href: it.url_for('keep-safe'),                 className: 'client_logged_out invisible' },
                                ]}
                            />

                            <FooterColumn
                                header={it.L('Banking')}
                                items={[
                                    { text: it.L('Cashier'),         href: it.url_for('cashier') },
                                    { text: it.L('Payment Methods'), href: it.url_for('cashier/payment_methods') },
                                ]}
                            />
                        </div>
                    </div>
                    <div className='gr-6 gr-12-m gr-parent gr-no-gutter'>
                        <div className='gr-row'>
                            <FooterColumn
                                header={it.L('Legal')}
                                items={[
                                    { text: it.L('Regulatory Information'), href: it.url_for('regulation') },
                                    { text: it.L('Terms and Conditions'),   href: it.url_for('terms-and-conditions') },
                                    { text: it.L('Security and Privacy'),   href: it.url_for('terms-and-conditions'), param: '?anchor=security-and-privacy#privacy' },
                                    { text: it.L('Responsible Trading'),    href: it.url_for('responsible-trading') },
                                ]}
                            />

                            <FooterColumn
                                header={it.L('Trading')}
                                items={[
                                    { text: it.L('Platforms'),      href: it.url_for('platforms') },
                                    { text: it.L('Asset Index'),    href: it.url_for('resources/asset_indexws') },
                                    { text: it.L('Trading Times'),  href: it.url_for('resources/market_timesws') },
                                    { text: it.L('Network Status'), href: 'https://binarycom.statuspage.io', target: '_blank' },
                                ]}
                            />

                            <FooterColumn
                                header={it.L('Partner With Us')}
                                items={[
                                    { text: it.L('Affiliate Programme'),     href: it.url_for('affiliate/signup') },
                                    { text: it.L('IB Programme'),            href: it.url_for('ib-programme/ib-signup') },
                                    { text: it.L('API'),                     href: 'https://developers.binary.com', target: '_blank' },
                                    { text: it.L('Binary Shop'),             href: 'https://shop.binary.com',       target: '_blank' },
                                    /* { text: it.L('Charitable Activities'),   href: it.url_for('charity') }, */
                                    { text: it.L('All Partnership Options'), href: it.url_for('partners') },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id='footer-regulatory' className='primary-bg-color-dark gr-padding-10'>
            <div className='container' data-show='-eucountry'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <div className='icon-row flex-row'>
                            <div className='regulation-logos flex-row'>
                                <a className='vanuatu-icon' href='https://www.vfsc.vu/' target='_blank' rel='noopener noreferrer'>
                                    <img className='responsive' src={it.url_for('images/pages/regulation/vanuatu-logo.png')} />
                                </a>
                                <a className='bvi-icon' href='http://www.bvifsc.vg/' target='_blank' rel='noopener noreferrer'>
                                    <img className='responsive' src={it.url_for('images/pages/regulation/bvi.png')} />
                                </a>
                                <a className='labuan-icon' href='https://www.labuanibfc.com/' target='_blank' rel='noopener noreferrer'>
                                    <img className='responsive' src={it.url_for('images/pages/footer/labuan_FSA.svg')} />
                                </a>
                            </div>
                            <SocialIcons
                                networks={[
                                    { media: 'youtube',     href: 'https://www.youtube.com/user/BinaryTradingVideos' },
                                    { media: 'facebook',    href: 'https://www.facebook.com/binarydotcom' },
                                    { media: 'twitter',     href: 'https://twitter.com/Binarydotcom' },
                                    { media: 'telegram',    href: 'https://t.me/binarydotcom' },
                                    { media: 'reddit',      href: 'https://www.reddit.com/r/binarydotcom/' },
                                ]}
                            />
                        </div>
                    </div>
                </div>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <p>
                            {it.L('In the EU, financial products are offered by Binary Investments (Europe) Ltd., W Business Centre, Level 3, Triq Dun Karm, Birkirkara, BKR 9033, Malta, regulated as a Category 3 Investment Services provider by the Malta Financial Services Authority ([_1]licence no. IS/70156[_2]).', `<a href=${it.url_for('download/WS-Binary-Investments-Europe-Limited.pdf')} target="_blank">`, '</a>')}
                        </p>
                        <p>
                            {it.L('Outside the EU, financial products are offered by Binary (C.R.) S.A., 5th Floor, Building 6 Centro Ejecutivo La Sabana, Sabana Sur, San José, Costa Rica, Binary (V) Ltd, Govant Building, Port Vila, PO Box 1276, Vanuatu, regulated by the Vanuatu Financial Services Commission ([_1]view licence[_2]), Binary (BVI) Ltd, Kingston Chambers, P.O. Box 173, Road Town, Tortola, British Virgin Islands, regulated by the British Virgin Islands Financial Services Commission ([_3]licence no. SIBA/L/18/1114[_4]), and Binary (FX) Ltd., Lot No. F16, First Floor, Paragon Labuan, Jalan Tun Mustapha, 87000 Labuan, Malaysia, regulated by the Labuan Financial Services Authority to carry on a money-broking business ([_5]licence no. MB/18/0024[_6]).',
                                '<a href="https://www.vfsc.vu/wp-content/uploads/2015/12/List-of-Licensees-under-Dealers-in-Securities-Licensing-Act-CAP-70-18.11.2016.pdf" target="_blank" rel="noopener noreferrer">', '</a>',
                                `<a href=${it.url_for('download/regulation/BVI_license.pdf')} target="_blank">`, '</a>',
                                `<a href=${it.url_for('download/regulation/Labuan-license.pdf')} target="_blank">`, '</a>')}
                        </p>
                        <p>
                            {it.L('This website\'s services are not made available in certain countries such as the USA, Canada, Costa Rica, Hong Kong, Japan, or to persons under age 18.')}
                        </p>
                        <fieldset className='fld-risk-warning'>
                            <legend>{it.L('Risk Warning')}</legend>
                            <p>{it.L('The financial products offered via this website include binary options, contracts for difference ("CFDs") and other complex derivatives and financial products. Trading binary options may not be suitable for everyone. Trading CFDs carries a high level of risk since leverage can work both to your advantage and disadvantage. As a result, the products offered on this website may not be suitable for all investors because of the risk of losing all of your invested capital. You should never invest money that you cannot afford to lose, and never trade with borrowed money. Before trading in the complex financial products offered, please be sure to understand the risks involved and learn about [_1]Responsible Trading[_2].', `<a href="${it.url_for('responsible-trading')}">`, '</a>')}</p>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div className='container' data-show='eucountry'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <div className='icon-row flex-row'>
                            <div className='regulation-logos flex-row'>
                                <a className='iom-icon' href='https://www.gov.im/gambling/' target='_blank' rel='noopener noreferrer'>
                                    <img className='responsive' src={it.url_for('images/pages/footer/isle-of-man.png')} />
                                </a>
                                <div className='mga-gamstop-icon-container'>
                                    <a className='gamstop-icon' href='https://www.gamstop.co.uk' target='_blank' rel='noopener noreferrer'>
                                        <img className='responsive' src={it.url_for('images/pages/footer/gamstop.svg')} />
                                    </a>
                                    <a className='mga-icon' href='https://www.authorisation.mga.org.mt/verification.aspx?lang=EN&company=a5fd1edc-d072-4c26-b0cd-ab3fa0f0cc40&details=1' target='_blank' rel='noopener noreferrer'>
                                        <img className='responsive' src={it.url_for('images/pages/footer/mga-logo-footer.svg')} />
                                    </a>
                                </div>
                                <div className='age-restriction-sign'>
                                    <img className='responsive' src={it.url_for('images/pages/footer/18+.svg')} />
                                </div>
                            </div>
                            <SocialIcons
                                networks={[
                                    { media: 'youtube',     href: 'https://www.youtube.com/user/BinaryTradingVideos' },
                                    { media: 'facebook',    href: 'https://www.facebook.com/binarydotcom' },
                                    { media: 'twitter',     href: 'https://twitter.com/Binarydotcom' },
                                    { media: 'telegram',    href: 'https://t.me/binarydotcom' },
                                    { media: 'reddit',      href: 'https://www.reddit.com/r/binarydotcom/' },
                                ]}
                            />
                        </div>
                    </div>
                </div>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <p>
                            {it.L('In the EU, financial products are offered by Binary Investments (Europe) Ltd., W Business Centre, Level 3, Triq Dun Karm, Birkirkara, BKR 9033, Malta, licensed and regulated as a Category 3 Investment Services provider by the Malta Financial Services Authority (licence no. IS/70156).')}
                        </p>
                        <p>
                            {it.L('In the Isle of Man and the UK, Volatility Indices are offered by Binary (IOM) Ltd., First Floor, Millennium House, Victoria Road, Douglas, IM2 4RW, Isle of Man, British Isles; licensed and regulated respectively by (1) the Gambling Supervision Commission in the Isle of Man (current licence issued on 31 August 2017) and by (2) the Gambling Commission in the UK (licence [_1]reference no: 39172[_2]).', '<a href="https://secure.gamblingcommission.gov.uk/PublicRegister/Search/Detail/39172" target="_blank" rel="noopener noreferrer">', '</a>')}
                        </p>
                        <p>
                            {it.L('In the rest of the EU, Volatility Indices are offered by Binary (Europe) Ltd., W Business Centre, Level 3, Triq Dun Karm, Birkirkara, BKR 9033, Malta; licensed and regulated by (1) the Malta Gaming Authority in Malta (licence no. MGA/B2C/102/2000 issued on 01 August 2018), for UK clients by (2) the UK Gambling Commission (licence [_1]reference no: 39495[_2]), and for Irish clients by (3) the Revenue Commissioners in Ireland (Remote Bookmaker\'s Licence no. 1010285 issued on 1 July 2017). View complete [_3]Regulatory Information[_2].', '<a href="https://secure.gamblingcommission.gov.uk/PublicRegister/Search/Detail/39495" target="_blank" rel="noopener noreferrer">', '</a>', `<a href="${it.url_for('regulation')}">`)}
                        </p>
                    </div>
                </div>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <div className='about-binary'>
                            <p>
                                {it.L('[_1] is an award-winning online trading provider that helps its clients to trade on financial markets through binary options and CFDs. Trading binary options and CFDs on Volatility Indices is classified as a gambling activity. Remember that gambling can be addictive – please play responsibly. Learn more about [_2]Responsible Trading[_3]. Some products are not available in all countries. This website\'s services are not made available in certain countries such as the USA, Canada, Costa Rica, Hong Kong, or to persons under age 18.', it.website_name, `<a href="${it.url_for('responsible-trading')}">`, '</a>')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <div className='risk-warning'>
                            <p>
                                {it.L('Trading binary options may not be suitable for everyone, so please ensure that you fully understand the risks involved. Your losses can exceed your initial deposit and you do not own or have any interest in the underlying asset.')}
                            </p>
                            <p className='eu-only invisible'>
                                {it.L('CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 74-89% of retail investor accounts lose money when trading CFDs. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id='end-note' className='invisible content-inverse-color center-text' />
        <StatusNotification />
        <DialogNotification />
    </div>
);

export default Footer;
