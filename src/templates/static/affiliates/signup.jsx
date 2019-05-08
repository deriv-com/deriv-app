import React from 'react';
import { BoxRow, Box } from '../../_common/components/box_row.jsx';
import { Table } from '../../_common/components/elements.jsx';
import Step from '../../_common/components/step.jsx';
import { TabContainer, TabContent, TabContentContainer, TabsSubtabs } from '../../_common/components/tabs.jsx';

const AffiliateBox = ({ image, ...props }) => (
    <Box img_src={it.url_for(`images/pages/affiliates/${image}.svg`)} {...props} />
);

const Signup = () => (
    <div className='static_full affiliates-signup-page'>
        <div className='container'>
            <h1>{it.L('[_1] Affiliate Programme', it.website_name)}</h1>
            <p>
                {it.L('Join the [_1] Affiliate Programme and earn commission by referring new clients to our award-winning binary options trading platform.', it.website_name)}
            </p>

            <div className='gr-padding-20'>
                <h2 className='center-text margin-bottom-50'>{it.L('How it works')}</h2>
                <div className='steps'>
                    <Step circle_no='1' header={it.L('Sign up')}                         text={it.L('Getting started is free and easy – just [_1]fill out the application form[_2], choose your preferred commission plan and wait for our approval.', `<a href='${it.affiliate_signup_url}' target="_blank">` ,'</a>')} />
                    <Step circle_no='2' header={it.L('Introduce [_1]', it.website_name)} text={it.L('Use your unique affiliate link and the referral tools we provide to introduce [_1] to your audience.', it.website_name)} />
                    <Step circle_no='3' header={it.L('Earn')}                            text={it.L('Receive your affiliate commission once your referred clients start trading on our platform.')} />
                </div>
            </div>
        </div>

        <div className='fill-bg-color'>
            <div className='container center-text gr-padding-20'>
                <h2 className='margin-bottom-50'>{it.L('Why you should join the [_1] Affiliate Programme', it.website_name)}</h2>

                <BoxRow top_row>
                    <AffiliateBox title={it.L('Generous commission')}      image='commission-icon'       text={it.L('Choose a commission plan that suits your business strategy.')} />
                    <AffiliateBox title={it.L('On-time payments')}         image='payment-icon'          text={it.L('Get paid by the 15th of every month. We\'ve never missed a payment since we started our programme in March 2004.')} />
                    <AffiliateBox title={it.L('Dedicated support')}        image='contact-icon'          text={it.L('Contact our dedicated affiliate support team for help and suggestions.')} />
                </BoxRow>
                <BoxRow bottom_row>
                    <AffiliateBox title={it.L('Advanced referral tools')} image='marketing-icon'        text={it.L('Recommend our products easily, and keep track of all your earnings with our nifty referral tools.')} />
                    <AffiliateBox title={it.L('High conversions')}        image='conversion-icon'       text={it.L('We\'ve paid millions in commission to date through our industry-leading affiliate programme.')} />
                    <AffiliateBox title={it.L('Multiple opportunities')}  image='diversify-income-icon' text={it.L('Diversify your income stream through other partnership opportunities such as the [_1]Introducing Broker Programme[_2].', `<a href="${it.url_for('ib-programme/ib-signup')}">`, '</a>')} />
                </BoxRow>

                <div className='gr-padding-30'>
                    <a className='button' href={it.affiliate_signup_url} target='_blank' rel='noopener noreferrer'>
                        <span>{it.L('Apply now')}</span>
                    </a>
                </div>
            </div>
        </div>

        <div className='container gr-padding-20'>
            <div className='center-text'>
                <h2>{it.L('Types of affiliate commission plans')}</h2>
                <p>{it.L('Choose from the following affiliate commission plans:')}</p>
            </div>

            <TabContainer className='gr-padding-20 full-width' theme='light'>
                <TabsSubtabs
                    id='commission_tabs'
                    className='gr-parent tab-selector-wrapper'
                    items={[
                        { id: 'revenue_share',   text: it.L('Revenue share') },
                        { id: 'turnover',        text: it.L('Turnover') },
                        { id: 'cpa_eu_only',     text: it.L('CPA (EU only)') },
                        { id: 'commission_tabs_selector', className: 'tab-selector' },
                    ]}
                />
                <div className='tab-content'>
                    <TabContentContainer>
                        <TabContent id='revenue_share'>
                            <p className='mobile-text-small'>{it.L('Earn increasingly higher payouts with tiered and laddered commission rates that reward you based on the net revenue generated by your referred clients.')}</p>
                            <div className='gr-padding-20 center-text table-container'>
                                <Table
                                    data={{
                                        thead: [
                                            [
                                                { text: it.L('Tier') },
                                                { text: it.L('Total net revenue per month (USD)') },
                                                { text: it.L('Commission rates') },
                                            ],
                                        ],
                                        tbody: [
                                            [
                                                { text: '1' },
                                                { text: '$0 – $10,000' },
                                                { text: '20%' },
                                            ],
                                            [
                                                { text: '2' },
                                                { text: '$10,001 – $50,000' },
                                                { text: '25%' },
                                            ],
                                            [
                                                { text: '3' },
                                                { text: '$50,001 – $100,000' },
                                                { text: '30%' },
                                            ],
                                            [
                                                { text: '4' },
                                                { text: it.L('$100,001 and above') },
                                                { text: '35%' },
                                            ],
                                        ],
                                    }}
                                />
                            </div>
                            <p className='mobile-text-small'>{it.L('All commissions are credited into your account by the 15th of every month.')}</p>
                        </TabContent>
                        <TabContent id='turnover'>
                            <p className='mobile-text-small'>{it.L('Our turnover-based commission plan depends on the payout probability for each contract. Contracts with higher returns for the client offer lower commissions to the affiliate.')}</p>
                            <div className='gr-padding-20 center-text table-container'>
                                <Table
                                    data={{
                                        thead: [
                                            [
                                                { text: it.L('Probability of returns') },
                                                { text: it.L('Commission rates') },
                                            ],
                                        ],
                                        tbody: [
                                            [
                                                { text: '0 – 19.999%' },
                                                { text: '1.25%' },
                                            ],
                                            [
                                                { text: '20 – 39.999%' },
                                                { text: '1%' },
                                            ],
                                            [
                                                { text: '40 – 59.999%' },
                                                { text: '0.75%' },
                                            ],
                                            [
                                                { text: '60 – 79.999%' },
                                                { text: '0.5%' },
                                            ],
                                            [
                                                { text: '80 – 94.999%' },
                                                { text: '0.25%' },
                                            ],
                                            [
                                                { text: '95%+' },
                                                { text: '0%' },
                                            ],
                                        ],
                                    }}
                                />
                            </div>
                            <p className='mobile-text-small'>{it.L('All commissions are credited into your account by the 15th of every month.')}</p>
                        </TabContent>
                        <TabContent id='cpa_eu_only'>
                            <h3 className='gr-padding-20'>
                                <span>{it.L('Cost per acquisition (CPA) for EU affiliates only')}</span>
                            </h3>
                            <p className='mobile-text-small'>{it.L('Earn USD 100 in commission for each successful referral. Your referred client must open a [_1]real money investment account[_2] through your unique affiliate link and deposit a total of USD 100 or more (one-time or accumulative) in the account. This commission plan is only available to affiliates based in the EU.', '<strong>', '</strong>')}</p>
                            <p className='mobile-text-small'>{it.L('All commissions are credited into your account by the 15th of every month.')}</p>
                        </TabContent>
                    </TabContentContainer>
                </div>
            </TabContainer>

        </div>

        <div className='fill-bg-color'>
            <div className='container center-text gr-padding-30'>
                <p>{it.L('Sign up for the [_1] Affiliate Programme today:', it.website_name)}</p>
                <p>
                    <a className='button' href={it.affiliate_signup_url} target='_blank' rel='noopener noreferrer'>
                        <span>{it.L('Yes, I want to sign up as an affiliate')}</span>
                    </a>
                </p>
            </div>
        </div>

        <div className='container gr-padding-20'>
            <h2 className='center-text'>{it.L('FAQ')}</h2>

            <div className='gr-row'>
                <a href={`${it.url_for('affiliate/faq')}#general`} className='gr-3 gr-6-m center-text faq-box'>
                    <img className='fixed-height-img' src={it.url_for('images/pages/affiliates/general-faq-icon.svg')} alt='general-faq-icon' />
                    <p><strong>{it.L('General')}</strong></p>
                </a>
                <a href={`${it.url_for('affiliate/faq')}#account-management-and-tracking`} className='gr-3 gr-6-m center-text faq-box'>
                    <img className='fixed-height-img' src={it.url_for('images/pages/affiliates/account-icon.svg')} alt='account-icon' />
                    <p><strong>{it.L('Account management and tracking')}</strong></p>
                </a>
                <a href={`${it.url_for('affiliate/faq')}#referral-tools`} className='gr-3 gr-6-m center-text faq-box'>
                    <img className='fixed-height-img' src={it.url_for('images/pages/affiliates/marketing-icon.svg')} alt='marketing-icon' />
                    <p><strong>{it.L('Referral tools')}</strong></p>
                </a>
                <a href={`${it.url_for('affiliate/faq')}#support`} className='gr-3 gr-6-m center-text faq-box'>
                    <img className='fixed-height-img' src={it.url_for('images/pages/affiliates/support-faq-icon.svg')} alt='support-faq-icon' />
                    <p><strong>{it.L('Support')}</strong></p>
                </a>
            </div>
        </div>
    </div>
);

export default Signup;
