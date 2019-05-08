import React                   from 'react';
import { Section, ListStrong } from '../get_started/common.jsx';
import { List }                from '../../_common/components/elements.jsx';
import { SeparatorLine }       from '../../_common/components/separator_line.jsx';

const FAQ = () => (
    <div className='static_full affiliates-faq-page'>
        <h1>{it.L('Affiliate FAQ')}</h1>
        <div className='gr-row'>
            <div className='gr-3 gr-12-m sidebar-container'>
                <div className='sidebar'>
                    <List
                        id='sidebar-nav'
                        items={[
                            { id: 'general',                         href: '#general',                         text: it.L('General') },
                            { id: 'account-management-and-tracking', href: '#account-management-and-tracking', text: it.L('Account management and tracking') },
                            { id: 'referral-tools',                  href: '#referral-tools',                  text: it.L('Referral tools') },
                            { id: 'support',                         href: '#support',                         text: it.L('Support') },
                        ]}
                    />
                </div>
            </div>
            <div className='gr-9 gr-12-m'>
                <Section id='general' header={it.L('General')}>
                    <h3>{it.L('What is the [_1] Affiliate Programme all about?', it.website_name)}</h3>
                    <p>{it.L('The [_1] Affiliate Programme allows you to benefit from referring new clients to our site.', it.website_name)}</p>
                    <p>{it.L('If you\'re a broker we\'d like to work with you. You will be introducing your clients to a unique and innovative product: the [_1] trading platform. Your clients will love the [_1] trading platform because we offer a complete binary options trading experience tailored to the needs of an exceptionally wide range of traders.', it.website_name)}</p>
                    <p>{it.L('Novice traders can use our intuitive platform to learn about trading, practise trading, and gain trading experiences. Seasoned traders can use the [_1] platform and take full advantage of the wide range of trading and analysis tools we have to offer.', it.website_name)}</p>

                    <h3>{it.L('Who can apply as a [_1] affiliate?', it.website_name)}</h3>
                    <ul className='bullet'>
                        <ListStrong header={it.L('Webmaster')}                  text={it.L('Do you run a website that promotes Forex or binary options? Join our global network of affiliates and turn your online traffic into revenue.')} />
                        <ListStrong header={it.L('Trading guru')}               text={it.L('Earn additional income with us as you grow your community of potential and existing online traders through useful trading insights and mentorship.')} />
                        <ListStrong header={it.L('Webinar speaker')}            text={it.L('Monetise your online trading discussions with your audience of trading enthusiasts while helping them improve their trading experience.')} />
                        <ListStrong header={it.L('Web and software developer')} text={it.L('Receive commission when you bring in new clients through trading applications and interfaces you build using the [_1] API.', it.website_name)} />
                        <ListStrong header={it.L('Social media admin')}         text={it.L('Do you manage a social media page that\'s dedicated to online trading? Partner with us and convert your audience into potential profit.')} />
                        <ListStrong header={it.L('Blogger and vlogger')}        text={it.L('Maintaining a page or video channel about online trading? Get rewarded when you refer your followers and viewers to trade on our award-winning binary options platform.')} />
                    </ul>

                    <h3>{it.L('Why should I become a [_1] affiliate?', it.website_name)}</h3>
                    <p>{it.L('[_1] is a licensed and regulated binary options trading platform that\'s been operating since 2000. It has:', it.website_name)}</p>
                    <ul className='bullet'>
                        <li>{it.L('An international appeal with multilingual support in English, Spanish, French, German, Portuguese, Chinese, Italian, Thai, Polish, and Russian')}</li>
                        <li>{it.L('An intuitive, web-based platform that\'s instantly available to traders of all levels – anytime, anywhere')}</li>
                        <li>{it.L('A competitive and flexible affiliate programme that can be adapted to your needs')}</li>
                    </ul>

                    <h3>{it.L('Is there a cost for joining?')}</h3>
                    <p>{it.L('Not at all. Joining our affiliate programme is completely free and always will be.')}</p>

                    <h3>{it.L('What is the definition of a referred client?')}</h3>
                    <p>{it.L('A referred client is someone who has been referred through your unique affiliate link and who has deposited money into their [_1] account. They must fulfil the following criteria:', it.website_name)}</p>
                    <ul className='bullet'>
                        <li>{it.L('Have not previously been a [_1] customer', it.website_name)}</li>
                        <li>{it.L('Aged 18 years old and above')}</li>
                    </ul>

                    <h3>{it.L('Who can be a client on the [_1] platform?', it.website_name)}</h3>
                    <p>{it.L('Anyone aged 18 years old and above who is not the resident of a "restricted country" (as listed in our [_1]Terms & Conditions[_2]) can become a [_3] client.', `<a href="${it.url_for('terms-and-conditions')}">`, '</a>', it.website_name)}</p>
                </Section>

                <Section id='account-management-and-tracking' header={it.L('Account management and tracking')}>
                    <h3>{it.L('How can I become an affiliate?')}</h3>
                    <p>{it.L('It\'s easy. Just go to the signup page and complete the [_1]affiliate registration form[_2]. We\'ll review your application and get back to you if your application is successful.', `<a href="${it.affiliate_signup_url}">`, '</a>')}</p>

                    <h3>{it.L('I forgot my password, what should I do?')}</h3>
                    <p>{it.L('Don\'t worry, you can simply [_1]reset your password[_2].', `<a href="${it.affiliate_password_url}">`, '</a>')}</p>

                    <h3>{it.L('How can I change my payment method?')}</h3>
                    <p>{it.L('Log in to your [_1] affiliate account and go to: Finances → Payment instructions.', it.website_name)}</p>

                    <h3>{it.L('How and when will I receive my affiliate earnings?')}</h3>
                    <p>{it.L('Your commission for the previous calendar month will be deposited into your account by the 15th of every month.')}</p>

                    <h3>{it.L('How do I know how much I have earned?')}</h3>
                    <p>{it.L('Log in to your [_1] affiliate account and go to: Reports → Detailed activity report', it.website_name)}</p>

                    <h3>{it.L('What kind of reports can I generate?')}</h3>
                    <p>{it.L('You can generate all kinds of insightful reports, including the following:')}</p>
                    <ul className='bullet'>
                        <li>{it.L('Hits & Impression report: Displays your hit rate and click through rates')}</li>
                        <li>{it.L('Countries report: Displays a list of countries where your clicks are coming from')}</li>
                        <li>{it.L('My Players report: Displays a list of your clients according to their IDs and the date they signed up')}</li>
                    </ul>

                    <h3>{it.L('Can I offer my referrals an incentive to sign up through my unique affiliate link rather than sign up directly?')}</h3>
                    <p>{it.L('We prohibit the use of unauthorised incentives, gifts, and payments to encourage customer signups. If we have reason to believe that you have engaged in such activity, we reserve the right to withhold any payments due to you. However, if you have a specific incentive in mind, then please contact your account manager for further discussion and approval.')}</p>
                </Section>

                <Section id='referral-tools' header={it.L('Referral tools')}>
                    <h3>{it.L('What referral tools do you offer?')}</h3>
                    <p>{it.L('We have a tested and proven selection of referral tools including banners, reviews, videos, and text ads for you to use. If you would like certain items to be customised to your preferences, please contact your account manager at [_1]. You can also use the MyAffiliates system to track and optimise your campaigns.', `<a href='mailto:${it.affiliate_email}'>${it.affiliate_email}</a>`)}</p>
                </Section>

                <Section id='support' header={it.L('Support')}>
                    <h3>{it.L('Where can I send my questions, comments, and suggestions?')}</h3>
                    <p>{it.L('Feel free to get in touch with us at [_1]. We\'d love to hear from you.', `<a href='mailto:${it.affiliate_email}'>${it.affiliate_email}</a>`)}</p>
                </Section>

                <SeparatorLine className='gr-padding-30' />
                <div className='gr-padding-30 gr-parent center-text'>
                    <a className='button-secondary' href={it.url_for('affiliate/signup')}>
                        <span>{it.L('Back to affiliate programme')}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default FAQ;
