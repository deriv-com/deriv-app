import React             from 'react';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const BoxInner = ({ className = '', href, target, image, text }) => (
    <div className={`gr-6 center-text ${className}`}>
        { href ?
            <React.Fragment>
                <a href={target ? href : it.url_for(href)} target={target || '_self'}>
                    <img className='gr-7 gr-centered' src={it.url_for(`images/pages/about/${image}.svg`)} />
                </a>
                <p>{text}</p>
            </React.Fragment>
            :
            <React.Fragment>
                <img className='gr-7 gr-centered' src={it.url_for(`images/pages/about/${image}.svg`)} />
                <p>{text}</p>
            </React.Fragment>
        }
    </div>
);

const ValuesBox = ({ subheader, icon, paragraph }) => (
    <div className='gr-6 gr-12-p gr-12-m'>
        <div className='values-box'>
            <div className={`icon-wrapper ${icon}`} />
            <div className='content-wrapper'>
                <div>
                    <h4 className='values-box-subheader'>{subheader}</h4>
                </div>
                <SeparatorLine no_wrapper sub_class='header-line' />
                <div>
                    <p className='values-box-text'>
                        {paragraph}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const Box = ({ children }) => (
    <div className='gr-6 gr-12-m'>
        <div className='gr-row full-height'>
            {children}
        </div>
    </div>
);

const Index = () => (
    <div className='about-us box-inlay-borders static_full'>
        <div className='container section'>
            <div className='gr-parent'>
                <h1 className='center-text gr-padding-20'>
                    {it.L('The premier platform for trading binary options in the world\'s financial markets')}
                </h1>
                <div className='gr-row'>
                    <div className='gr-6 gr-12-m gr-padding-20'>
                        <img className='mac' src={it.url_for('images/pages/about/mac.svg')} />
                    </div>
                    <div className='gr-1 gr-hide-t gr-hide-p gr-hide-m' />
                    <div className='gr-5 gr-12-m'>
                        <p>{it.L('Founded in 1999, [_1] is one of the oldest and most respected names in online binary trading.', it.website_name)}</p>
                        <p>{it.L('Using our website, customers can trade currencies, indices, commodities, and volatility indices 24/7. We have the most flexible pricing and the most comprehensive suite of products available.')}</p>
                        <p>{it.L('[_1] has earned an enviable reputation for our commitment to high ethical standards and the quality of the trading experience we provide.', it.website_name)}</p>
                        <p>{it.L('When you trade with [_1], you can be assured that your deposits are held in a separate trust account and are not used for any other purpose.', it.website_name)}</p>
                    </div>
                </div>
            </div>
            <div className='gr-12'>
                <SeparatorLine no_wrapper sub_class='gr-padding-10' />
            </div>
            <div className='gr-parent'>
                <h1 className='center-text gr-padding-20' data-anchor='our-values'>
                    {it.L('Our values')}
                </h1>
                <div className='gr-row'>
                    <ValuesBox
                        subheader={it.L('Integrity')}
                        icon='ic-intergrity'
                        paragraph={it.L('We believe that we should always do the right thing. This includes serving our customers with honesty and transparency, settling all contracts by the book, and communicating in plain language that can be easily understood.')}
                    />
                    <ValuesBox
                        subheader={it.L('Teamwork')}
                        icon='ic-teamwork'
                        paragraph={it.L('We value positive team players who can work together to overcome challenges and achieve common goals.')}
                    />
                    <ValuesBox
                        subheader={it.L('Competence')}
                        icon='ic-competence'
                        paragraph={it.L('We love to work with smart and talented people who are eager to roll up their sleeves and get things done.')}
                    />
                    <ValuesBox
                        subheader={it.L('Customer focus')}
                        icon='ic-customer-focus'
                        paragraph={it.L('We always put our customers first and dedicate ourselves to building products and services that give them the best trading experience possible.')}
                    />

                    <div className='gr-12 center-text'>
                        <p>{it.L('Want to be a part of our dynamic culture? Browse all our openings and see where you fit:')}</p>
                    </div>
                    <div className='center-element'>
                        <a className='button' href={it.url_for('careers?anchor=open-positions')}>
                            <span>{it.L('Open positions')}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div className='fill-bg-color'>
            <div className='container section'>
                <div className='gr-padding-10 facts'>
                    <h1 className='center-text gr-padding-20'>{it.L('Key facts')}</h1>
                    <div className='gr-row border-bottom no-padding'>
                        <Box>
                            <BoxInner className='border-right-top' href='/group-history' image='founded' text={it.L('[_1]Founded[_2] October 1999', `<a href="${ it.url_for('group-history') }">`, '</a>')} />
                            <BoxInner className='border-right-top' image='debt-free' text={it.L('Debt-free')} />
                        </Box>
                        <Box>
                            <BoxInner className='border-right-top' href='/binary-in-numbers?anchor=employee' image='staff' text={it.L('Over [_1] [_2]staff[_3] and contractors worldwide', '200', `<a href="${it.url_for('binary-in-numbers?anchor=employee')}">`, '</a>')} />
                            <BoxInner image='1mil' text={it.L('Over 1 million registered accounts worldwide')} />
                        </Box>
                    </div>
                    <div className='gr-row gr-parent'>
                        <Box>
                            <BoxInner className='border-right-bottom gr-padding-30' href='https://binarycom.statuspage.io/#system-metrics' target='_blank' image='transacts' text={it.L('Binary\'s platform transacts on average [_1] [_2]transactions[_3] per second, 24/7', '20', '<a href="https://binarycom.statuspage.io/#system-metrics" target="_blank" rel="noopener noreferrer">', '</a>')} />
                            <BoxInner className='border-right-bottom gr-padding-30' image='locations' text={it.L('Offices in Malta and Malaysia')} />
                        </Box>
                        <Box>
                            <BoxInner className='border-right-bottom gr-padding-30' href='regulation' image='license' text={it.L('Licensed and regulated in Malta, the United Kingdom, the Isle of Man, and Ireland. [_1]Learn more[_2]', `<a href="${ it.url_for('regulation') }">`, '</a>')} />
                            <BoxInner className='gr-padding-30' image='languages' text={it.L('Published in Chinese, English, French, German, Indonesian, Italian, Polish, Portuguese, Russian, Spanish, Thai and Vietnamese')} />
                        </Box>
                    </div>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='gr-parent'>
                <p>{it.L('[_1] is owned and operated by the Binary Group Ltd. group of companies. For more information, [_2]visit our history page[_3].', it.website_name, `<a href="${ it.url_for('group-history') }">`, '</a>')}</p>
                <p>{it.L('In the UK, our clients trade through Binary (IOM) Ltd and Binary Investments (Europe) Ltd. In the Isle of Man, they trade through Binary (IOM) Ltd. In the European Union (except UK), they trade through Binary (Europe) Ltd and Binary Investments (Europe) Ltd. In the rest of the world, they trade through Binary (C.R.) S.A., Binary (V) Ltd, Binary (BVI) Ltd and Binary (FX) Ltd.')}</p>
            </div>
        </div>
    </div>
);

export default Index;
