import React from 'react';
import { List } from '../../_common/components/elements.jsx';

const Section = ({ id, header, children }) => (
    <div className='section'>
        <a id={id} />
        <h1>{header}</h1>
        {children}
    </div>
);

const PaymentAgent = () => (
    <div className='container'>
        <div className='payment-agent static_full gr-row'>
            <div className='gr-3 gr-hide-m sidebar-container'>
                <div className='sidebar'>
                    <List
                        id='sidebar-nav'
                        items={[
                            { href: '#payment-agents',              text: it.L('Payment Agents'), className: 'selected' },
                            { href: '#why-choose-payment-agents',   text: it.L('Why do Clients choose to use Payment Agents?') },
                            { href: '#who-can-apply-payment-agent', text: it.L('Who can apply to be a Payment Agent?') },
                            { href: '#benefits-of-payment-agent',   text: it.L('Benefits of being a Payment Agent') },
                            { href: '#next-steps',                  text: it.L('How does it work?') },
                        ]}
                    />
                    <div className='sidebar-button'><a href={`mailto:${it.affiliate_email}`}>{it.L('Contact us')}</a></div>
                </div>
            </div>
            <div className='gr-9 gr-12-m gr-parent'>
                <Section id='payment-agents' header={it.L('Payment Agents')}>
                    <p>{it.L('Are you a Payment Agent, or interested in acting as one?')}</p>
                    <p>{it.L('[_1] would like to team up with potential payment agents worldwide so we can offer local payment processing services to our clients in their respective regions.', it.website_name)}</p>
                    <div className='gr-row'>
                        <div className='gr-8 gr-12-m'>
                            <p>{it.L('A Payment Agent acts like an exchange between the Client (that is, our customer) and [_1]. The Payment Agent processes deposits and withdrawals for Clients who wish to use a specific e-wallet method or local currency that is not offered by [_1]. The transfer fees are borne by the Client.', it.website_name)}</p>
                        </div>
                        <div className='gr-4 gr-8-m gr-centered'>
                            <img className='responsive' src={it.url_for('images/pages/payment_agent/payment_agents.svg')} />
                        </div>
                    </div>
                    <p className='faded'>{it.L('Note: Payment Agent transfers are only available for accounts registered with Binary (CR) SA. Transactions are accepted only in US dollars.')}</p>
                </Section>

                <Section id='why-choose-payment-agents' header={it.L('Why do Clients choose to use Payment Agents?')}>
                    <ul className='checked'>
                        <li>{it.L('Allow Clients to use e-wallets, which are not available directly on [_1]', it.website_name)}</li>
                        <li>{it.L('Accept local bank wires')}</li>
                        <li>{it.L('Avoid the need to have an e-wallet')}</li>
                        <li>{it.L('Allow Clients to deposit with lower amounts (via local currency)')}</li>
                    </ul>
                </Section>

                <Section id='who-can-apply-payment-agent' header={it.L('Who can apply to be a Payment Agent?')}>
                    <div className='gr-row'>
                        <div className='gr-4 gr-8-m gr-centered'>
                            <img className='responsive' src={it.url_for('images/pages/payment_agent/who_payment_agents.svg')} />
                        </div>
                        <div className='gr-8 gr-12-m'>
                            <ul className='checked'>
                                <li>{it.L('Online currency exchangers')}</li>
                                <li>{it.L('[_1] affiliate partners who wish to support a big group of Clients', it.website_name)}</li>
                                <li>{it.L('Anyone who has potential to grow or increase traffic to [_1]', it.website_name)}</li>
                            </ul>
                        </div>
                    </div>
                </Section>

                <Section id='benefits-of-payment-agent' header={it.L('Benefits of being a Payment Agent')}>
                    <ul className='checked'>
                        <li><strong>{it.L('Additional business exposure:')}</strong> {it.L('You will increase awareness of your services and generate new business.')}</li>
                        <li><strong>{it.L('Commissions:')}</strong> {it.L('You will charge a commission to process the transactions.')}</li>
                        <li><strong>{it.L('Extra revenue stream:')}</strong> {it.L('You will have the potential to earn another level of income from our affiliate program.')}</li>
                        <li><strong>{it.L('Long-term partnership:')}</strong> {it.L('Your partnership with [_1] could be a means to promote your product or services for FREE to our 1,000,000+ registered clients, worldwide.', it.website_name)}</li>
                    </ul>
                </Section>

                <Section id='next-steps' header={it.L('How does it work?')}>
                    <p>{it.L('Interested, so what\'s next? If you can offer our Clients a specific e-wallet method or a local payment option that is not already provided by [_1], and you have a good track record in the market, then we would love to [_2]hear from you![_3]', it.website_name, `<a href='mailto:${it.affiliate_email}'>`, '</a>')}</p>
                    <p>{it.L('As a first step, please send us an application with:')}</p>
                    <ul className='checked'>
                        <li>{it.L('Your name, email address and contact number')}</li>
                        <li>{it.L('Your website request.url (if you have one)')}</li>
                        <li>{it.L('A list of payment methods you will accept from Clients')}</li>
                        <li>{it.L('The commission you will charge Clients on deposits and withdrawals')}</li>
                    </ul>
                    <p>{it.L('Please submit the above information to [_1].',`<a href='mailto:${it.affiliate_email}'>${it.affiliate_email}</a>`)}</p>
                    <p>{it.L('Once we receive your application, one of our affiliate managers will contact you to follow up with the next steps in the application process (this will include asking you to submit several documents).')}</p>
                    <p>{it.L('Your application will then be reviewed by our compliance and marketing departments. Once approved, we will put you live in our [_1]payment agent[_2] list.', `<a href="${it.url_for('cashier/payment_agent_listws')}">`, '</a>')}</p>
                </Section>

                <Section id='need-more-information' header={it.L('Need more information?')}>
                    <p>{it.L('If you would like more information on becoming a Payment Agent, please contact us at [_1]', `<a href='mailto:${it.affiliate_email}'>${it.affiliate_email}</a>`)}</p>
                    <p>{it.L('We look forward to hearing from you.')}</p>
                </Section>
            </div>
        </div>
    </div>
);

export default PaymentAgent;
