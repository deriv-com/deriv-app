import React from 'react';

const CharityHelper = ({ country, charities }) => (
    <div className='charity-country gr-padding-30'>
        <div className='fill-bg-color center-text'>
            <h3 className='gr-padding-10'>{country}</h3>
        </div>
        { charities.map((charity, inx) => (
            <div key={inx} className='gr-row'>
                <div className='gr-4 gr-12-m'><img className='responsive gr-padding-20' src={it.url_for(`/images/pages/charity/${charity.image}.jpg`)} /></div>
                <div className='gr-8 gr-12-m'>
                    <p><strong>{charity.title}</strong></p>
                    <p>{charity.text}</p>
                    { charity.contacts && charity.contacts.map((contact, inxc) => (
                        <p key={inxc}>
                            <strong>
                                {contact.text}:
                                <a href={(contact.mailto ? 'mailto:' : '') + contact.href} {...contact.attr}>
                                    {contact.href}
                                </a>
                            </strong>
                        </p>
                    ))}
                </div>
            </div>

        ))}
    </div>
);

const Charity = () => (
    <div className='charity static_full'>
        <div className='section'>
            <div className='section-content center-text'>
                <div className='gr-12'>
                    <h1>{it.L('Making a Positive Impact in Local Communities')}</h1>
                    <p>{it.L('[_1]\'s charitable initiative focuses on small charities and nonprofits around the world that are making a positive difference in their local communities. Our donations have a direct impact, free from the burden of overheads seen in larger charities.', it.website_name)}</p>
                </div>
                <div className='gallery'>
                    <img className='responsive' src={it.url_for('images/pages/charity/charity-1.jpg')} />
                    <img className='responsive' src={it.url_for('images/pages/charity/charity-2.jpg')} />
                    <img className='responsive' src={it.url_for('images/pages/charity/charity-3.jpg')} />
                </div>
            </div>

            <div className='section-content'>
                <CharityHelper
                    country={it.L('Malaysia')}
                    charities={[
                        {
                            image   : 'charity_run',
                            title   : it.L('PPUKM Physiotherapy Charity Run 2018'),
                            text    : it.L('This charity run is organized by The National University of Malaysia in conjunction with the International Day of Older Persons which is celebrated in October every year. The goal of the run is to raise awareness within local communities about the importance of physiotherapy for the elderly and to promote healthy lifestyles among Malaysians. The funds raised are used to buy and upgrade existing facilities for the rehabilitation of older patients.'),
                            contacts: [
                                { text: it.L('URL'), href: 'https://www.ppukm.ukm.my/physio-run', attr: { rel: 'noopener noreferrer' } },
                            ],
                        },
                        {
                            image   : 'learning_centre',
                            title   : it.L('Shelter Home\'s Shelter Community Learning Centre 3'),
                            text    : it.L('The Shelter Community Learning Centre 3 is a community school for Myanmar refugee children who are awaiting repatriation with their families to a third country. The school aims to provide these children – who are at their most vulnerable age – with an education which will prepare them for the future.'),
                            contacts: [
                                { text: it.L('URL'), href: 'http://www.shelterhome.org', attr: { rel: 'noopener noreferrer' } },
                            ],
                        },
                        {
                            image   : 'languages_refugee',
                            text    : it.L('Language Classes for Refugees (LCFR) is an educational programme for refugees organised by the \'Love & Respect Transformation Centre\' –  a social enterprise committed to long-term quality education. This programme teaches English, Malay, and French to age groups ranging from children to adults in order to provide them with language skills that will help them to find employment while they are waiting to be repatriated.'),
                            title   : it.L('Languages Classes for Refugees (LCFR)'),
                            contacts: [
                                {
                                    text: it.L('URL'),
                                    href: 'https://www.facebook.com/languagesclassesforrefugees',
                                    attr: { rel: 'noopener noreferrer' },
                                },
                                {
                                    text  : it.L('Contact'),
                                    mailto: 1,
                                    href  : 'spreadlnrevents@gmail.com',
                                },
                            ],
                        },
                    ]}
                />
            </div>

            <div className='section-content center-text'>
                <p>{it.L('We are always on the lookout for small, local charities where our contributions can make a direct impact. If you\'d like to talk to us about supporting your charity, please contact us at [_1].', '<a href="mailto:marketing@binary.com">marketing@binary.com</a>')}</p>
            </div>
        </div>
    </div>
);

export default Charity;
