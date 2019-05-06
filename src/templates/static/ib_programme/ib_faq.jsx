import React             from 'react';
import { Section }       from '../get_started/common.jsx';
import { List }          from '../../_common/components/elements.jsx';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const FAQ = () => (
    <div className='static_full ib-faq-page'>
        <h1>{it.L('IB programme FAQ')}</h1>
        <div className='gr-row'>
            <div className='gr-3 gr-12-m sidebar-container'>
                <div className='sidebar'>
                    <List
                        id='sidebar-nav'
                        items={[
                            { id: 'general',            href: '#general',            text: it.L('General') },
                            { id: 'account-management', href: '#account-management', text: it.L('Account management') },
                            { id: 'referral-tools',     href: '#referral-tools',     text: it.L('Referral tools') },
                        ]}
                    />
                </div>
            </div>
            <div className='gr-9 gr-12-m'>
                <Section id='general' header={it.L('General')}>
                    <h3>{it.L('What is the [_1] IB Programme all about?', it.website_name)}</h3>
                    <p>{it.L('Refer new clients to our MetaTrader 5 platform and earn a commission on their Forex and CFD trading activity.')}</p>

                    <h3>{it.L('How much do I get paid if I refer clients onto your MT5 platform?')}</h3>
                    <p>{it.L('You will earn a fixed payout based on the volume of individual trades purchased by each referred client. Please refer to our IB commission structure for Forex, metals, and Volatility Indices.')}</p>

                    <h3>{it.L('Is there a fee to join the [_1] IB Programme?', it.website_name)}</h3>
                    <p>{it.L('It\'s completely free to join our IB programme. We\'ve never charged a fee and we never will.')}</p>
                </Section>

                <Section id='account-management' header={it.L('Account management')}>
                    <h3>{it.L('How do I register to become a [_1] IB?', it.website_name)}</h3>
                    <p>{it.L('Thank you for your interest in partnering with us. We\'ve made it easy for you to apply online. Just fill out the [_1]online application form[_2] with all necessary details. If you are already registered as a [_3] affiliate, you can email us at [_4] instead. We will contact you directly if your application is successful.', `<a href='${it.affiliate_signup_url}'>`, '</a>', it.website_name, `<a href='mailto:${it.affiliate_email}'>${it.affiliate_email}</a>`)}</p>

                    <h3>{it.L('When are my commissions paid?')}</h3>
                    <p>{it.L('IB earnings from your MT5 referrals are credited daily into your MT5 account.')}</p>

                    <h3>{it.L('How can I withdraw my commissions?')}</h3>
                    <p>{it.L('IB commissions are credited directly into your MT5 account. You can transfer funds from your MT5 account to your [_1] Real Account, then withdraw the funds using your preferred withdrawal method.', it.website_name)}</p>
                </Section>

                <Section id='referral-tools' header={it.L('Referral tools')}>
                    <h3>{it.L('Do you offer any referral tools to your IBs?')}</h3>
                    <p>{it.L('Yes, we will provide you with banners, links, reviews, videos, and text ads that you can use to drive referrals to the [_1] MT5 platform.', it.website_name)}</p>

                    <h3>{it.L('Are there any minimum client or volume conditions that I need to meet before I can withdraw my commissions?')}</h3>
                    <p>{it.L('No, there are no minimum requirements to withdraw your IB commissions.')}</p>

                    <h3>{it.L('Do you offer any tools to manage my clients\' trades?')}</h3>
                    <p>{it.L('Are you a money manager who wants to easily manage multiple client accounts? Our [_1]Multiple Accounts Manager (MAM)[_2] application gives you the ability to view, track, and trade on behalf of all MT5 client accounts under your control.', `<a href='${it.url_for('multiple-accounts-manager')}'>`, '</a>')}</p>
                </Section>

                <SeparatorLine className='gr-padding-30' />
                <div className='gr-padding-30 gr-parent center-text'>
                    <a className='button-secondary' href={it.url_for('ib-programme/ib-signup')}>
                        <span>{it.L('Back to IB programme')}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default FAQ;
