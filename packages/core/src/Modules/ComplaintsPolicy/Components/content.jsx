import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import 'Sass/app/modules/complaints-policy.scss';

const Content = () => {
    const policy_content = [
        {
            title: localize('1. Introduction'),
            content: {
                text: localize(
                    'This complaints policy, which may change from time to time, applies to your account(s) registered with Deriv (SVG) LLC and Deriv (FX) Ltd.'
                ),
            },
        },
        {
            title: localize('2. Fair treatment'),
            content: {
                text: (
                    <Localize
                        i18n_default_text='Our company is one of the oldest and most reputable online trading companies in the world. We are committed to treat our clients fairly and provide them with excellent service.<0/><1/>Please provide us with feedback on how we can improve our services to you. Rest assured that you will be heard, valued, and treated fairly at all times.'
                        components={[<br key={0} />, <br key={1} />]}
                    />
                ),
            },
        },
        {
            title: localize('3. Complaints and Disputes'),
            content: {
                text: localize('Our complaints process comprises the following 4 steps:'),
                subcontent: [
                    {
                        title: localize('3.1. Submission of a complaint'),
                        text: (
                            <Localize
                                i18n_default_text='To file a complaint about our service, send an email to <0>complaints@deriv.com</0> and state your complaint in detail. Please submit any relevant screenshots of your trading or system for our better understanding.'
                                components={[
                                    <a
                                        key={0}
                                        className='link link--orange'
                                        rel='noopener noreferrer'
                                        target='_blank'
                                        href='mailto:complaints@deriv.com'
                                    />,
                                ]}
                            />
                        ),
                    },
                    {
                        title: localize('3.2. Handling your complaint'),
                        text: localize(
                            'We shall acknowledge receiving your complaint, review it carefully, and keep you updated on the handling process. We might request further information or clarifications to facilitate the resolution of the complaint.'
                        ),
                    },
                    {
                        title: localize('3.3. Resolving your complaint'),
                        text: localize(
                            'We shall try to resolve your complaint within 15 business days. We will inform you of the outcome together with an explanation of our position and propose any remedial measures we intend to take.'
                        ),
                    },
                ],
            },
        },
        {
            title: localize('4. Your decision'),
            content: {
                text: (
                    <Localize
                        i18n_default_text='If you are not satisfied with the outcome, you can escalate your complaint to the <0>Financial Commission</0>.'
                        components={[
                            <a
                                key={0}
                                className='link link--orange'
                                rel='noopener noreferrer'
                                target='_blank'
                                href='https://financialcommission.org/'
                            />,
                        ]}
                    />
                ),
            },
        },
    ];

    const complaints_procedure = [
        {
            title: localize('Financial commission complaints procedure'),
        },
        {
            title: localize('1. Filing complaints'),
            list: [
                <Localize
                    key={0}
                    i18n_default_text='<0>a.</0>You may file a complaint with the Financial Commission up to 45 days after the incident.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={1}
                    i18n_default_text='<0>b.</0>The Financial Commission has 5 days to acknowledge that your complaint was received and 14 days to answer the complaint through our Internal Dispute Resolution (IDR) procedure.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={2}
                    i18n_default_text='<0>c.</0>You will be able to file a complaint with the Financial Commission only if you are not satisfied with our decision or the decision wasn’t made within 14 days.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
            ],
        },
        {
            title: localize('2. Investigation phase'),
            list: [
                <Localize
                    key={0}
                    i18n_default_text='<0>a.</0>The Financial Commission will investigate the validity of the complaint within 5 business days.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={1}
                    i18n_default_text='<0>b.</0>The Head of the Dispute Resolution Committee (DRC) will contact both you and us within 5 business days to obtain all necessary information and see if there is a chance to settle the complaint during the investigation phase.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={2}
                    i18n_default_text='<0>c.</0>If no settlement opportunity can be found, the complaint will proceed to the determination phase to be handled by the DRC.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
            ],
        },
        {
            title: localize('3. Determination phase'),
            list: [
                <React.Fragment key={0}>
                    <span className='complaints-policy__list-item-prefix'>a.</span>
                    <span className='complaints-policy__list-item-text'>
                        <Localize
                            i18n_default_text='The DRC will make a <0>decision on the complaint</0> (please note that the DRC mentions no timeframe for announcing its decision).'
                            components={[
                                <a
                                    key={0}
                                    className='link link--orange'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href='https://financialcommission.org/resolving-a-dispute/dispute-resolution/'
                                />,
                            ]}
                        />
                    </span>
                </React.Fragment>,
                <Localize
                    key={1}
                    i18n_default_text='<0>b.</0>The DRC may request additional information from you or us, who must then provide the requested information within 7 days.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
            ],
        },
        {
            title: localize('4. Awards and orders'),
            list: [
                <Localize
                    key={0}
                    i18n_default_text='<0>a.</0>The decisions made by the DRC are binding on us. DRC decisions are binding on you only if you accept them.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={1}
                    i18n_default_text='<0>b.</0>If you agree with a DRC decision, you will need to accept it within 14 days. If you do not respond to the DRC decision within 14 days, the complaint is considered closed.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={2}
                    i18n_default_text='<0>c.</0>We must award the settlement within 28 days of when the decision is reached.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
                <Localize
                    key={3}
                    i18n_default_text='<0>d.</0>If the decision is made in our favour, you must provide a release for us within 7 days of when the decision is made, and the complaint will be considered closed.'
                    components={[<span className='complaints-policy__list-item-prefix' key={0} />]}
                />,
            ],
        },
        {
            title: localize('5. Disclaimer'),
            content: {
                text: localize(
                    'The Financial Commission accepts appeals for 45 days following the date of the incident and only after the trader has tried to resolve the issue with the company directly.'
                ),
            },
        },
    ];

    const modal_content = [...policy_content, ...complaints_procedure].map((row, index) => (
        <div key={index} className='complaints-policy__section'>
            <div className='complaints-policy__section-title'>{row.title}</div>
            {row.list && (
                <div className='complaints-policy__list'>
                    {row.list.map((item, i) => (
                        <div key={i} className='complaints-policy__list-item'>
                            {item}
                        </div>
                    ))}
                </div>
            )}
            {row.content && (
                <div className='complaints-policy__section-content'>
                    {row.content.text && row.content.text}
                    {row.content.subcontent &&
                        row.content.subcontent.map((item, i) => (
                            <div key={i} className='complaints-policy__subsection'>
                                <div className='complaints-policy__subsection-title'>{item.title}</div>
                                <div className='complaints-policy__subsection-content'>{item.text}</div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    ));

    return (
        <ThemedScrollbars className='complaints-policy__scrollbars'>
            <div className='complaints-policy__wrapper'>{modal_content}</div>
        </ThemedScrollbars>
    );
};

export default Content;
