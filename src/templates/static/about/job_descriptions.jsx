import React             from 'react';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const Column = ({
    className,
    header,
    text,
    id,
    subsection,
}) => (
    <div className='gr-6 gr-12-p gr-12-m gr-padding-20'>
        {className ?
            <h3 className={className}>{header}</h3>
            :
            <h3>{header}</h3>
        }
        <p>{text}</p>
        <a href={it.url_for(`open-positions/job-details?dept=${id}#${subsection}`)}>{it.L('Learn more')}</a>
    </div>
);

const Row = ({ title, id, sections = [], last }) => (
    <React.Fragment>
        <div className='gr-row gr-padding-10' id={id}>
            <div className='gr-3 gr-5-p gr-12-m'>
                <div className='gr-12 gr-padding-10 center-text'>
                    <h2 className='gr-gutter'>{title}</h2>
                    <img className='responsive' src={it.url_for(`images/pages/careers/${id}.svg`)} />
                </div>
            </div>
            <div className='gr-9 gr-7-p gr-12-m'>
                <div className='gr-row'>
                    {sections.map((section, idx) => (
                        <Column
                            header={section.header}
                            text={section.text}
                            subsection={section.subsection}
                            className={section.className}
                            id={id}
                            key={idx}
                        />
                    ))}
                </div>
            </div>
        </div>
        {!last ? <SeparatorLine /> : '' }
    </React.Fragment>
);

const JobDescriptions = () => (
    <div className='open-positions container'>
        <div className='gr-parent static_full'>
            <div className='gr-padding-10'>
                <h1>{it.L('Open Positions')}</h1>
            </div>

            <Row
                id='information_technology'
                title={it.L('IT')}
                sections={[
                    { header: it.L('DevOps Engineer'),      subsection: 'devops_engineer',      text: it.L('As our DevOps Engineer, you will have a critical role in our approach to our infrastructure and operations. The stability and scalability of our applications have a direct impact on our bottom line. This means that you will be taking on a mission critical role.') },
                    { header: it.L('System Administrator'), subsection: 'system_administrator', text: it.L('The System Administration team is responsible for the upkeep, configuration, and reliable operation of our computer software, hardware, and networks.') },
                    { header: it.L('Back-End Developer'),   subsection: 'backend_developer',    text: it.L('As our Back-End Developer, you will be taking on the challenge of writing robust, high-quality, and production-ready code. Your work will greatly contribute to the architecture that drives our high-traffic binary options trading website.') },
                    { header: it.L('Front-End Developer'),  subsection: 'frontend_developer',   text: it.L('As our Front-End Developer, you will be taking on the challenge of developing and maintaining advanced applications and interfaces that connect clients with our patented trading system.') },
                    { header: it.L('Perl Developer'),       subsection: 'perl_developer',       text: it.L('As our Perl Developer, you will be taking on the challenge of writing robust, high-quality, and production-ready code. Your work will greatly contribute to the architecture that drives our high-traffic binary options trading website.'), className: 'one-line gr-nowrap gr-wrap-p' },

                    { header: it.L('Cryptocurrency/Blockchain Developer'), subsection: 'cryptocurrency_blockchain_developer', text: it.L('As our Cryptocurrency/Blockchain Developer, you will be taking on the challenge of revamping our existing cashier system and infrastructure for our ICO launch. You will also drive all our future blockchain-based projects. Your work will greatly contribute to the architecture that drives our high-traffic binary options trading website.') },

                    { header: it.L('Security Researcher'), subsection: 'security_researcher', text: it.L('As our Security Researcher, we expect you to stay informed about the latest security bulletins and findings, and actively monitor our software development pipeline to find and raise potential security issues.'), className: 'one-line gr-nowrap gr-wrap-p' },

                    { header: it.L('PostgreSQL Database Administrator (DBA)'), subsection: 'postgresql_database_administrator', text: it.L('As our PostgreSQL Database Administrator, you will plan, implement, and manage the database systems that are essential to the architecture of our high-traffic binary options trading platform.') },

                    { header: it.L('UI/UX Designer'), subsection: 'ui_ux_designer', text: it.L('As our UI/UX Designer, you will play a key role in conceptualising and defining user experience and interaction across multiple websites and applications.'), className: 'one-line gr-nowrap gr-wrap-p' },
                ]}
            />

            <Row
                id='quality_assurance'
                title={it.L('Quality Assurance')}
                sections={[
                    { header: it.L('Software Tester'), subsection: 'software_tester', text: it.L('As our Software Tester, we rely on you to run high-quality tests to ensure the stability, quality, and usability of our website and codebase with each software release.'), className: 'nowrap' },
                ]}
            />

            <Row
                id='quantitative_analysis'
                title={it.L('Quantitative Analysis')}
                sections={[
                    { header: it.L('Quantitative Analyst'),      subsection: 'quantitative_analyst',      text: it.L('[_1] Quantitative Analytics team is responsible for the pricing of our binary options. You will join them in managing the risk and profitability of the company\'s options book.', it.website_name) },
                    { header: it.L('Financial Markets Analyst'), subsection: 'financial_markets_analyst', text: it.L('As our Senior Financial Markets Analyst, you will manage the day-to-day risk of our trading books, conduct complex quantitative analysis, carry out performance testing, develop advanced data analytics tools, and support other related operations that have a direct impact on the profitability and future growth of our company.') },
                ]}
            />

            <Row
                id='data_analytics'
                title={it.L('Data Analytics')}
                sections={[
                    { header: it.L('Data Scientist'), subsection: 'data_scientist', text: it.L('We need a talented Data Scientist with the technical skills and creative curiosity to explore and solve complex business problems.'), className: 'nowrap' },
                ]}
            />

            <Row
                id='marketing'
                title={it.L('Marketing')}
                sections={[
                    { header: it.L('Affiliate/Country Manager'),     subsection: 'affiliate_country_manager',     text: it.L('The Country Manager is expected to acquire, service, manage, and expand our network of active affiliates in the countries where Binary Group targets to be represented. You will also contribute your energy, skills, and knowledge of the local business culture to increase our rapid growth rate worldwide.') },
                    { header: it.L('Technical Marketing Executive'), subsection: 'technical_marketing_executive', text: it.L('As our Technical Marketing Executive, you will act on data-driven information and assist in troubleshooting issues to further nurture and grow our client base.') },
                    { header: it.L('Marketing Executive'),           subsection: 'marketing_executive',           text: it.L('As our Marketing Executive, you will coordinate and execute marketing campaigns across a variety of channels, and continuously identify the best ways to reach current and prospective customers.') },
                    { header: it.L('Graphics Designer'),             subsection: 'graphics_designer',             text: it.L('As our Graphic Designer, you will develop high-impact graphics and visual elements such as images and icons for our websites and applications. You will play an essential role in creating user interface assets that bring our products and users closer together.') },
                    { header: it.L('Copywriter'),                    subsection: 'copywriter',                    text: it.L('As our Copywriter, you will help us to craft copy and content that engages our audiences - both online and offline.') },
                ]}
            />

            <Row
                id='accounting'
                title={it.L('Accounts/ Payments')}
                sections={[
                    { header: it.L('Accounts And Payments Executive'), subsection: 'accounts_and_payments_executive', text: it.L('As our Accounts & Payments Executive, you will be able to contribute to all these key areas and increase the efficiency of our financial operations.') },
                ]}
            />

            <Row
                id='compliance'
                title={it.L('Compliance and Risk Management')}
                sections={[
                    { header: it.L('Compliance Executive'),            subsection: 'compliance_executive',            text: it.L('As our Compliance Executive, you must ensure that our group of companies worldwide conduct their business operations in full compliance with relevant laws and regulations - both national and international.') },
                    { header: it.L('Risk Management Executive'),       subsection: 'risk_management_executive',       text: it.L('You are responsible for mitigating the risks and abuse that we face from fraud and money laundering. To accomplish this, you must monitor, analyse, and conduct various anti-fraud and AML checks on client accounts and deposits. You will join us in Malta and report to our Head of Payments.') },
                    { header: it.L('Payments and Compliance Analyst'), subsection: 'payments_and_compliance_analyst', text: it.L('As our Risk Management Executive, we will depend on you to identify, analyse, and take necessary measures to reduce or eliminate risks faced by the organisation.') },
                ]}
            />

            <Row
                id='internal_audit'
                title={it.L('Internal Audit')}
                sections={[
                    { header: it.L('Internal Audit Executive'), subsection: 'internal_audit_executive', text: it.L('The Internal Audit team is the catalyst for improving our organisation\'s governance, risk management, and internal controls by providing insights and recommendations based on the audits they perform.') },
                ]}
            />

            <Row
                id='human_resources'
                title={it.L('Human Resource')}
                sections={[
                    { header: it.L('HR Operations Executive'),      subsection: 'hr_operations_executive',      text: it.L('As our Human Resource Operations Executive, you will be counted on to lead, execute, and support a wide range of HR-related and administrative tasks to ensure the smooth operations of our offices worldwide.') },
                    { header: it.L('Talent Acquisition Executive'), subsection: 'talent_acquisition_executive', text: it.L('The Recruitment team plays a challenging role in the company by sourcing and selecting quality applicants that will contribute to the company growth.') },
                ]}
            />

            <Row
                id='customer_support'
                title={it.L('Customer Support')}
                last
                sections={[
                    { header: it.L('Customer Support Executive'), subsection: 'customer_support_executive', text: it.L('As our Customer Support Executive, you will serve as the voice of the company, and help our customers resolve and reduce the issues they\'re facing with our products and services. The frontline is essential to our business and you are expected to deliver world-class customer service that creates customer loyalty and promotes business growth.') },
                ]}
            />

        </div>
    </div>
);

export default JobDescriptions;
