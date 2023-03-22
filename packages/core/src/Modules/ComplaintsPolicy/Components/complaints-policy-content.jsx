import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { getLegalEntityName, Jurisdiction } from '@deriv/shared';
import { connect } from 'Stores/connect';
import 'Sass/app/modules/complaints-policy.scss';

const getIntroductionText = (landing_company_shortcode, mt5_login_list) => {
    // * mt5_login_list returns these:
    // landing_company_short: "svg" | "malta" | "maltainvest" |  "vanuatu"  | "labuan" | "bvi"
    const has_vanuatu = mt5_login_list.some(item => item.landing_company_short === Jurisdiction.VANUATU);
    const has_labuan = mt5_login_list.some(item => item.landing_company_short === Jurisdiction.LABUAN);

    switch (landing_company_shortcode) {
        case 'iom':
            return (
                <Localize
                    i18n_default_text='This complaints policy, which may change from time to time, applies to your account registered with {{legal_entity_name}}, having its registered office address at First Floor, Millennium House, Victoria Road, Douglas, Isle of Man, IM2 4RW, licensed and regulated respectively by (1) the Gambling Supervision Commission in the Isle of Man (current <0>licence</0> issued on 31 August 2017) and (2) the Gambling Commission in the UK (<1>licence no. 39172</1>).'
                    components={[<strong key={0} />, <strong key={1} />]}
                    values={{
                        legal_entity_name: getLegalEntityName('mx'),
                    }}
                />
            );
        case Jurisdiction.MALTA_INVEST:
            return localize(
                'This complaints policy, which may change from time to time, applies to your account registered with {{legal_entity_name}}.',
                {
                    legal_entity_name: getLegalEntityName(Jurisdiction.MALTA_INVEST),
                }
            );
        case 'malta':
            return (
                <Localize
                    i18n_default_text='This complaints policy, which may change from time to time, applies to your account(s) registered with {{legal_entity_name}}, having its registered office address at W Business Centre, Level 3, Triq Dun Karm, Birkirkara, BKR 9033, Malta, licensed and regulated by the Malta Gaming Authority in Malta for gambling products only, <0>licence no. MGA/B2C/102/2000</0>, and for clients residing in the UK by the UK Gambling Commission (account number 39495).'
                    components={[<strong key={0} />]}
                    values={{
                        legal_entity_name: getLegalEntityName('malta'),
                    }}
                />
            );
        default:
            if (has_vanuatu && has_labuan) {
                return localize(
                    'This complaints policy, which may change from time to time, applies to your account(s) registered with {{legal_entity_name_svg}}, {{legal_entity_name_fx}}, and {{legal_entity_name_v}}.',
                    {
                        legal_entity_name_svg: getLegalEntityName(Jurisdiction.SVG),
                        legal_entity_name_fx: getLegalEntityName('fx'),
                        legal_entity_name_v: getLegalEntityName('v'),
                    }
                );
            } else if (has_vanuatu) {
                return localize(
                    'This complaints policy, which may change from time to time, applies to your account(s) registered with {{legal_entity_name_svg}} and {{legal_entity_name_v}}.',
                    {
                        legal_entity_name_svg: getLegalEntityName(Jurisdiction.SVG),
                        legal_entity_name_v: getLegalEntityName('v'),
                    }
                );
            } else if (has_labuan) {
                return localize(
                    'This complaints policy, which may change from time to time, applies to your account(s) registered with {{legal_entity_name_svg}} and {{legal_entity_name_fx}}.',
                    {
                        legal_entity_name_svg: getLegalEntityName(Jurisdiction.SVG),
                        legal_entity_name_fx: getLegalEntityName('fx'),
                    }
                );
            }
            return localize(
                'This complaints policy, which may change from time to time, applies to your account(s) registered with {{legal_entity_name_svg}}.',
                {
                    legal_entity_name_svg: getLegalEntityName(Jurisdiction.SVG),
                }
            );
    }
};

const getYourDecisionText = (is_uk, landing_company_shortcode) => {
    const texts = [];

    switch (landing_company_shortcode) {
        case 'iom':
        case 'malta': {
            if (landing_company_shortcode === 'iom') {
                texts.push(
                    <Localize
                        key={0}
                        i18n_default_text='If you are not satisfied with the outcome, you can escalate your complaint to the <0>Independent Betting Adjudication Service (IBAS)</0> by filling the IBAS adjudication form. Please note that IBAS only deals with disputes that result from transactions.'
                        components={[
                            <a
                                key={0}
                                className='link link--orange'
                                rel='noopener noreferrer'
                                target='_blank'
                                href='https://www.ibas-uk.com/'
                            />,
                        ]}
                    />
                );
                texts.push(
                    <Localize
                        key={texts.length}
                        i18n_default_text='<0/><1/>If your complaint relates to our data processing practices, you can submit a formal complaint to your local supervisory authority.'
                        components={[<br key={0} />, <br key={1} />]}
                    />
                );
            } else {
                texts.push(
                    <Localize
                        key={texts.length}
                        i18n_default_text="You can send your complaint to the <0>European Commission's Online Dispute Resolution (ODR)</0> platform. This is not applicable to UK clients."
                        components={[
                            <a
                                key={0}
                                className='link link--orange'
                                rel='noopener noreferrer'
                                target='_blank'
                                href='https://ec.europa.eu/odr/'
                            />,
                        ]}
                    />
                );

                texts.push(
                    <Localize
                        key={texts.length}
                        i18n_default_text='<0/><1/>You can also refer your dispute to the Malta Gaming Authority via the <2>Player Support Unit</2>.'
                        components={[
                            <br key={0} />,
                            <br key={1} />,
                            <a
                                key={2}
                                className='link link--orange'
                                rel='noopener noreferrer'
                                target='_blank'
                                href='https://www.mga.org.mt/support/online-gaming-support/'
                            />,
                        ]}
                    />
                );

                texts.push(
                    <Localize
                        key={texts.length}
                        i18n_default_text='<0/><1/>If your complaint relates to our data processing practices, you can submit a formal complaint to the <2>Information and Data Protection Commissioner</2> (Malta) on their website or make a complaint to any supervisory authority within the European Union.'
                        components={[
                            <br key={0} />,
                            <br key={1} />,
                            <a
                                key={2}
                                className='link link--orange'
                                rel='noopener noreferrer'
                                target='_blank'
                                href='https://idpc.org.mt/en/Pages/Home.aspx'
                            />,
                        ]}
                    />
                );
            }
            break;
        }
        default: {
            texts.push(
                <Localize
                    key={0}
                    i18n_default_text='If you are not satisfied with the outcome, you can escalate your complaint to the <0>Financial Commission</0>.'
                    components={[
                        <a
                            key={0}
                            className='link link--orange'
                            rel='noopener noreferrer'
                            target='_blank'
                            href='https://financialcommission.org/resolving-a-dispute/how-to-file-a-complaintdispute/'
                        />,
                    ]}
                />
            );
            if (landing_company_shortcode === Jurisdiction.MALTA_INVEST) {
                texts.push(
                    <Localize
                        key={texts.length}
                        i18n_default_text='<0/><1/>You may also raise your unresolved dispute to the <2>Office of the Arbiter for Financial Services</2>.'
                        components={[
                            <br key={0} />,
                            <br key={1} />,
                            <a
                                key={2}
                                className='link link--orange'
                                rel='noopener noreferrer'
                                target='_blank'
                                href='https://www.financialarbiter.org.mt/'
                            />,
                        ]}
                    />
                );

                if (is_uk) {
                    texts.push(
                        <Localize
                            key={texts.length}
                            i18n_default_text='<0/><1/>If you reside in the UK and you are unhappy with our response you may escalate your complaint to the <2>Financial Ombudsman Service</2>.'
                            components={[
                                <br key={0} />,
                                <br key={1} />,
                                <a
                                    key={2}
                                    className='link link--orange'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href='https://www.financial-ombudsman.org.uk/'
                                />,
                            ]}
                        />
                    );
                }
            }
            break;
        }
    }

    return texts;
};

const getSubmissionOfAComplaintText = landing_company_shortcode => (
    <React.Fragment>
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
        {landing_company_shortcode === 'malta' && (
            <Localize
                i18n_default_text=' You may also call <0>+447723580049</0> to place your complaint.'
                components={[
                    <a
                        key={0}
                        className='link link--orange'
                        rel='noopener noreferrer'
                        target='_blank'
                        href='tel:+447723580049'
                    />,
                ]}
            />
        )}
    </React.Fragment>
);

const Content = ({ is_uk, landing_company_shortcode, mt5_login_list }) => {
    const policy_content = [
        {
            title: localize('1. Introduction'),
            content: {
                text: getIntroductionText(landing_company_shortcode, mt5_login_list),
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
                        text: getSubmissionOfAComplaintText(landing_company_shortcode),
                    },
                    {
                        title: localize('3.2. Handling your complaint'),
                        text: localize(
                            'We shall acknowledge receiving your complaint, review it carefully, and keep you updated on the handling process. We might request further information or clarifications to facilitate the resolution of the complaint.'
                        ),
                    },
                    {
                        title: localize('3.3. Resolving your complaint'),
                        text:
                            landing_company_shortcode === 'malta'
                                ? localize(
                                      'We shall try to resolve your complaint within 10 business days. We will inform you of the outcome together with an explanation of our position and propose any remedial measures we intend to take.'
                                  )
                                : localize(
                                      'We shall try to resolve your complaint within 15 business days. We will inform you of the outcome together with an explanation of our position and propose any remedial measures we intend to take.'
                                  ),
                    },
                    {
                        title: localize('3.4. Your decision'),
                        text: getYourDecisionText(is_uk, landing_company_shortcode),
                    },
                ],
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
                                    href='https://financialcommission.org/resolving-a-dispute/dispute-resolution-process/'
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

    const can_show_complaints_procedure = /^(svg|labuan|vanuatu|maltainvest)$/.test(landing_company_shortcode);

    const modal_content = [...policy_content, ...(can_show_complaints_procedure ? complaints_procedure : [])].map(
        (row, index) => (
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
                        {row.content.text}
                        {/* eslint-disable-next-line react/display-name */}
                        {row.content.subcontent?.map((item, i) => (
                            <div key={i} className='complaints-policy__subsection'>
                                <div className='complaints-policy__subsection-title'>{item.title}</div>
                                <div className='complaints-policy__subsection-content'>{item.text}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    );

    return (
        <div className='complaints-policy'>
            <div className='complaints-policy__wrapper'>{modal_content}</div>
        </div>
    );
};

export default connect(({ client }) => ({
    is_uk: client.is_uk,
    mt5_login_list: client.mt5_login_list,
}))(Content);
