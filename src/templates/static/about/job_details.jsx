import React    from 'react';
import { List } from '../../_common/components/elements.jsx';

const InvisibleHeading = ({ headers = [] }) => (
    <div className='center-text' id='title'>
        { headers.map((header, idx) => (
            <h1 className={`${header.className} invisible`} key={idx}>{header.string}</h1>
        ))}
    </div>
);

const UlText = ({ text, paragraph, className, items = [] }) => (
    <React.Fragment>
        <p><strong>{text}</strong></p>
        { paragraph && <p>{paragraph}</p> }
        { items && <List className={className} items={items} /> }
    </React.Fragment>
);

const SideBar = ({ className, sidebar_items = [] }) => (
    <div className={`sidebar invisible ${className}`}>
        <ul id='sidebar-nav'>
            { sidebar_items.map((sidebar_item, idx) => (
                <li key={idx}><a href={`#${sidebar_item.href}`}>{sidebar_item.string}</a></li>
            ))}
        </ul>
    </div>
);

const InvisibleImage = ({ classNames = [] }) => (
    <div className='gr-12 center-text' id='image'>
        { classNames.map((className,idx) => (
            <img className={`responsive invisible dept-image ${className}`} src={it.url_for(`images/pages/careers/${className}.svg`)} key={idx} />
        ))}
    </div>
);

const JobDetails = () => (
    <div className='job-details container'>
        <div className='gr-parent static_full'>
            <div className='gr-row'>
                <div className='gr-3 gr-padding-10 gr-hide-m gr-hide-p'>

                    <InvisibleImage
                        classNames={[
                            'information_technology',
                            'quality_assurance',
                            'quantitative_analysis',
                            'data_analytics',
                            'marketing',
                            'accounting',
                            'compliance',
                            'customer_support',
                            'human_resources',
                            'administrator',
                            'internal_audit',
                        ]}
                    />
                    <div className='gr-12 gr-padding-10'>
                        <InvisibleHeading
                            headers={[
                                { className: 'information_technology', string: it.L('IT') },
                                { className: 'quality_assurance',      string: it.L('Quality Assurance') },
                                { className: 'quantitative_analysis',  string: it.L('Quantitative Analysis') },
                                { className: 'data_analytics',         string: it.L('Data Analytics') },
                                { className: 'marketing',              string: it.L('Marketing') },
                                { className: 'accounting',             string: it.L('Accounts/ Payments') },
                                { className: 'compliance',             string: it.L('Compliance and Risk Management') },
                                { className: 'customer_support',       string: it.L('Customer Support') },
                                { className: 'internal_audit',         string: it.L('Internal Audit') },
                                { className: 'human_resources',        string: it.L('Human Resources') },
                            ]}
                        />
                    </div>
                    <div className='gr-12 gr-padding-10 sidebar-container'>
                        <SideBar
                            className='information_technology'
                            sidebar_items={[
                                { href: 'devops_engineer',                     string: it.L('DevOps Engineer') },
                                { href: 'system_administrator',                string: it.L('System Administrator') },
                                { href: 'backend_developer',                   string: it.L('Back-End Developer') },
                                { href: 'frontend_developer',                  string: it.L('Front-End Developer') },
                                { href: 'perl_developer',                      string: it.L('Perl Developer') },
                                { href: 'cryptocurrency_blockchain_developer', string: it.L('Cryptocurrency/Blockchain Developer') },
                                { href: 'security_researcher',                 string: it.L('Security Researcher') },
                                { href: 'postgresql_database_administrator',   string: it.L('PostgreSQL Database Administrator (DBA)') },
                                { href: 'ui_ux_designer',                      string: it.L('UI/UX Designer') },
                            ]}
                        />

                        <SideBar
                            className='quality_assurance'
                            sidebar_items={[
                                { href: 'software_tester', string: it.L('Software Tester') },
                            ]}
                        />

                        <SideBar
                            className='quantitative_analysis'
                            sidebar_items={[
                                { href: 'quantitative_analyst',      string: it.L('Quantitative Analyst') },
                                { href: 'financial_markets_analyst', string: it.L('Financial Markets Analyst') },
                            ]}
                        />

                        <SideBar
                            className='data_analytics'
                            sidebar_items={[
                                { href: 'data_scientist', string: it.L('Data Scientist') },
                            ]}
                        />

                        <SideBar
                            className='marketing'
                            sidebar_items={[
                                { href: 'affiliate_country_manager',     string: it.L('Affiliate/Country Manager') },
                                { href: 'technical_marketing_executive', string: it.L('Technical Marketing Executive') },
                                { href: 'marketing_executive',           string: it.L('Marketing Executive') },
                                { href: 'graphics_designer',             string: it.L('Graphics Designer') },
                                { href: 'copywriter',                    string: it.L('Copywriter') },
                            ]}
                        />

                        <SideBar
                            className='accounting'
                            sidebar_items={[
                                { href: 'accounts_and_payments_executive', string: it.L('Accounts and Payments Executive') },
                            ]}
                        />

                        <SideBar
                            className='compliance'
                            sidebar_items={[
                                { href: 'compliance_executive',            string: it.L('Compliance Executive') },
                                { href: 'payments_and_compliance_analyst', string: it.L('Payments and Compliance Analyst') },
                                { href: 'risk_management_executive',       string: it.L('Risk Management Executive') },
                            ]}
                        />

                        <SideBar
                            className='internal_audit'
                            sidebar_items={[
                                { href: 'internal_audit_executive', string: it.L('Internal Audit Executive') },
                            ]}
                        />

                        <SideBar
                            className='human_resources'
                            sidebar_items={[
                                { href: 'hr_operations_executive',      string: it.L('HR Operations Executive') },
                                { href: 'talent_acquisition_executive', string: it.L('Talent Acquisition Executive') },
                            ]}
                        />

                        <SideBar
                            className='customer_support'
                            sidebar_items={[
                                { href: 'customer_support_executive', string: it.L('Customer Support Executive') },
                            ]}
                        />
                    </div>
                </div>

                <div className='gr-9 gr-padding-10 gr-12-m gr-12-p sections'>
                    <div className='information_technology'>
                        <div className='invisible' id='devops_engineer'>
                            <h1>{it.L('DevOps Engineer')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development and operation of our high-traffic web applications.', it.website_name)}</p>
                            <p>{it.L('As our DevOps Engineer, you will have a critical role in our approach to our infrastructure and operations. The stability and scalability of our applications have a direct impact on our bottom line. This means that you will be taking on a mission critical role.')}</p>
                            <p>{it.L('To excel, you must demonstrate a passion for open-source technologies. You must also have a burning desire to challenge yourself in a fast-paced environment.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Collaborate with a team of world-class, Linux-based Devops Engineers') },
                                    { text: it.L('Translate the ongoing business needs of the company into a suitable IT infrastructure') },
                                    { text: it.L('Monitor hardware and software deployment, including our worldwide network of servers and office networks') },
                                    { text: it.L('Oversee incident responses for our production servers') },
                                    { text: it.L('Take necessary measures to correct and enhance IT operations') },
                                    { text: it.L('Manage security, intrusion detection, DDoS protection, and PCI compliance measures for each deployed server') },
                                    { text: it.L('Conduct disaster and recovery planning, as well as their execution') },
                                    { text: it.L('Improve our automation (Chef, etc.)') },
                                    { text: it.L('Keep our infrastructure up-to-date with current cutting edge developments') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Expertise in cloud solutions and infrastructure virtualization, including AWS, Google Cloud Platform, and KVM') },
                                    { text: it.L('Experience with Linux and open-source applications such as rsyslog, DHCP, iptables, Postfix, NGINX, and initialization systems such as systemd and SysVinit') },
                                    { text: it.L('Extensive experience with TCP/IP networking, VPNs, and IPsec') },
                                    { text: it.L('Knowledge of hardware and software firewalls, intrusion detection methods, security systems, and DDoS protection') },
                                    { text: it.L('Thorough knowledge of bash scripting, and experience with the Perl scripting language') },
                                    { text: it.L('Experience in Chef, Ansible, SaltStack, or similar configuration management tools') },
                                    { text: it.L('Experience in site reliability engineering (SRE)') },
                                    { text: it.L('Experience in managing round-the-clock operations for incident resolution, including alerts, rotations, and escalations') },
                                    { text: it.L('Experience designing and working with high-availability web service architecture') },
                                    { text: it.L('Experience in application containerization') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='system_administrator'>
                            <h1>{it.L('System Administrator')}</h1>

                            <p>{it.L('The System Administration team is responsible for the upkeep, configuration, and reliable operation of our computer software, hardware, and networks.')}</p>
                            <p>{it.L('To excel, you must demonstrate a passion for open-source technologies. You must also have a burning desire to challenge yourself in a fast-paced environment.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Assist in the daily IT requirements of our offices') },
                                    { text: it.L('Plan and implement IT solutions to achieve desired results') },
                                    { text: it.L('Keep up with the latest developments in IT and maintain knowledge relevant to the requirements of the business') },
                                    { text: it.L('Plan and implement methods of best practices in IT security') },
                                    { text: it.L('Review and maintain third-party services used by the company') },
                                    { text: it.L('Recommend alternatives to redundant or obsolete systems') },
                                    { text: it.L('Manage and maintain all software, hardware, and associated peripherals including printers, copiers, and phones') },
                                    { text: it.L('Manage IT assets and maintain an up-to-date asset registry') },
                                    { text: it.L('Liaise with external suppliers to ensure purchases are made at the most cost-efficient rate') },
                                    { text: it.L('Prepare and present proposals for the provisioning of IT-related systems and services') },
                                    { text: it.L('Provide onsite support to all employees with the necessary hardware and software required for their jobs') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('A diploma or degree in Computer Science or Information Technology, or good experience in the field of IT operations/administration') },
                                    { text: it.L('Exceptional English communication skills (both oral and written)') },
                                    { text: it.L('Hands-on experience in troubleshooting computer software, hardware, and a variety of internet applications and networks') },
                                    { text: it.L('Hands-on experience in systems and network security. Experience with Fortigate or similar devices (e.g.Cisco, Mikrotik)') },
                                    { text: it.L('Knowledge of Mac or Linux Technologies and associated security risks') },
                                    { text: it.L('Knowledge of VPN concepts and prior experience of setting up site-to-site networks') },
                                    { text: it.L('Experience with +DRAC is a plus') },
                                    { text: it.L('Experience in ARUBA or similar enterprise WiFi AP management is a plus') },
                                    { text: it.L('Experience in end-user device security audit and policy implementation is a plus') },
                                    { text: it.L('The willingness to learn new skills') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='backend_developer'>
                            <h1>{it.L('Back-End Developer')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our high-traffic networks. As our Back-End Developer, you will be taking on the challenge of writing robust, high-quality, and production-ready code. Your work will greatly contribute to the architecture that drives our high-traffic binary options trading website.', it.website_name)}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Develop and maintain world-class web applications') },
                                    { text: it.L('Build, maintain, and optimise the technology that powers our servers, applications, and Databases') },
                                    { text: it.L('Work closely with other teams to come up with effective architecture to support the deployment of new products and features') },
                                    { text: it.L('Troubleshoot and debug problems in existing applications, and find new ways to improve their speed, functionality, and scalability') },
                                    { text: it.L('Participate in all aspects of the product lifecycle') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Experience with languages such as Perl, Python, PHP, C/C++, Go, or Ruby, and a willingness to become highly proficient with Perl') },
                                    { text: it.L('Expertise in Linux system administration') },
                                    { text: it.L('Experience with relational database design, and/or open-source RDBMS systems such as MySQL and PostgreSQL') },
                                    { text: it.L('Familiarity with Perl DBI, Moose, PSGI/Plack, NGINX, JavaScript, Redis, and Git') },
                                    { text: it.L('Ability to produce high-quality, self-documenting code by using test-driven development (TDD) techniques') },
                                    { text: it.L('Passion for Linux and other open-source platforms') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='frontend_developer'>
                            <h1>{it.L('Front-End Developer')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our websites, applications, and high-traffic networks. As our Front-End Developer, you will be taking on the challenge of developing and maintaining advanced applications and interfaces that connect clients with our patented trading system.', it.website_name)}</p>
                            <p>{it.L('You will also test and debug complex technical and UI issues related to our trading platform (that processes over one million transactions per day), based on feedback from our clients and customer service team.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Develop and maintain advanced features, tools, and applications according to best practices in UI/UX, front-end development and hybrid mobile application development') },
                                    { text: it.L('Test and debug our ever-evolving product line to improve their speed, scalability, and usability across multiple browsers, devices, and web standards') },
                                    { text: it.L('Stay on top of the latest JavaScript frameworks, libraries, and tools in order to apply them when necessary to solve challenges related to web and mobile development') },
                                    { text: it.L('Ensure the design and development of each page or product is consistent with our style guide, and that everything works as planned with each release') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Extensive knowledge in advanced coding techniques, cross-platform development, and hybrid mobile app development') },
                                    { text: it.L('Ability to write high-quality, self-documenting code using test-driven development techniques') },
                                    { text: it.L('Extensive experience of JavaScript, HTML, CSS, AJAX, and JSON') },
                                    { text: it.L('Familiarity with various JavaScript standards, libraries, frameworks, compilers, and transpilers including ES6, TypeScript, Babel, SystemJS, Web Workers, jQuery, React, and Angular') },
                                    { text: it.L('Experience with package managers (npm), task runners (Gulp, Webpack, Grunt), CSS processors (Sass, Stylus), and APIs (WebSocket)') },
                                    { text: it.L('Familiarity with testing and debugging processes, including unit testing and UI testing') },
                                    { text: it.L('Passion for Linux and other open-source platforms') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='perl_developer'>
                            <h1>{it.L('Perl Developer')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our high- traffic networks. As our Perl Developer, you will be taking on the challenge of writing robust, high-quality, and production-ready code. Your work will greatly contribute to the architecture that drives our high-traffic binary options trading website.', it.website_name)}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Develop and maintain world-class web applications') },
                                    { text: it.L('Build, maintain, and optimise the technology that powers our servers, applications, and databases') },
                                    { text: it.L('Work closely with other teams to come up with effective architecture to support the deployment of new products and features') },
                                    { text: it.L('Troubleshoot and debug problems in existing applications, and find new ways to improve their speed, functionality, and scalability') },
                                    { text: it.L('Participate in all aspects of the product lifecycle') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Deep Perl expertise') },
                                    { text: it.L('Expertise in Linux system administration') },
                                    { text: it.L('Experience with relational database design, and/or open-source RDBMS systems such as MySQL and PostgreSQL') },
                                    { text: it.L('Familiarity with Perl DBI, Moose, PSGI/Plack, nginx, JavaScript, Redis, and Git') },
                                    { text: it.L('Ability to produce high-quality, self-documenting code by using test-driven development (TDD) techniques') },
                                    { text: it.L('Event-driven programming in Perl') },
                                    { text: it.L('Passion for Linux, and other open-source platforms') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='cryptocurrency_blockchain_developer'>
                            <h1>{it.L('Cryptocurrency/Blockchain Developer')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our system infrastructure and high-traffic networks. As our Cryptocurrency/Blockchain Developer, you will be taking on the challenge of revamping our existing cashier system and infrastructure for our ICO launch. You will also drive all our future blockchain-based projects. Your work will greatly contribute to the architecture that drives our high-traffic binary options trading website.', it.website_name)}</p>

                            <UlText
                                text={it.L('You will:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Design and develop applications and platforms based on blockchain technology') },
                                    { text: it.L('Work closely with both technical and non-technical teams to develop and integrate blockchain solutions for our business') },
                                    { text: it.L('Provide technical leadership on cryptocurrencies and blockchain technology') },
                                    { text: it.L('Research and evaluate blockchain technologies and solutions to identify use cases and implementation') },
                                    { text: it.L('Write robust, high-quality, and production-ready code for our websites and applications') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Experience with languages such as Perl, Python, PHP, C/C++, Go, or Ruby, and a willingness to become highly proficient with Perl') },
                                    { text: it.L('Experience with Solidity and the development of Dapps') },
                                    { text: it.L('Excellent understanding of Bitcoin or other cryptocurrencies') },
                                    { text: it.L('Understanding of cryptography, including asymmetric, symmetric, hash functions, and encryption/signatures') },
                                    { text: it.L('Familiarity with concepts such as blockchain confirmations, multisig, and HD wallets') },
                                    { text: it.L('Knowledge of coloured coins and Ethereum tokens, including ERC20/23/223') },
                                    { text: it.L('Experience with Bitcoin or Geth RPC APIs is a plus') },
                                    { text: it.L('Knowledge of hashing algorithms, including SHA and scrypt') },
                                    { text: it.L('Ability to produce high-quality, self-documenting code by using test-driven development (TDD) techniques') },
                                    { text: it.L('Passion for Linux and other open-source platforms') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='security_researcher'>
                            <h1>{it.L('Security Researcher')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our high-traffic web applications. As our Security Researcher, we expect you to stay informed about the latest security bulletins and findings, and actively monitor our software development pipeline to find and raise potential security issues.', it.website_name)}</p>

                            <p>{it.L('As a strong proponent of open source, we encourage publication of findings, methods, and tools via GitHub and our technical blog at [_1] You will also assist our developers in understanding and patching the bugs that you find.', '<a href=\'https://tech.binary.com/\' target=\'_blank\'>https://tech.binary.com/</a>')}</p>

                            <p>{it.L('You will also encourage security awareness throughout the organisation via regular communication on security best practices and the latest online threats.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Check our systems against the latest attacks, vulnerabilities, and mitigations') },
                                    { text: it.L('Identify attack vectors') },
                                    { text: it.L('Conduct security reviews of production infrastructure') },
                                    { text: it.L('Build security tools and processes for critical infrastructure monitoring, protection, and mitigation') },
                                    { text: it.L('Perform regular pentesting of our web applications') },
                                    { text: it.L('Monitor our automated security scripts and utilise them to identify threats') },
                                    { text: it.L('Manage our bug bounty programme') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Experience with web application security and testing, security monitoring, and intrusion detection') },
                                    { text: it.L('Experience with fuzzing and finding edge cases in validation') },
                                    { text: it.L('Understanding of encryption fundamentals and the OWASP Top 10') },
                                    { text: it.L('A good understanding of attacks and mitigations such as timing, injection (e.g. form parameter/SQL), side-channel, DoS, buffer overflows and DNS cache poisoning') },
                                    { text: it.L('Able to assess the security impact of bugs and API inconsistencies') },
                                    { text: it.L('Familiarity with industry standard tools such as Burp Suit and Metasploit') },
                                    { text: it.L('Experience in writing custom code and scripts to investigate security threats') },
                                    { text: it.L('A clear understanding of the OSI model, TCP/IP, and other industry-standard network defense concepts') },
                                    { text: it.L('Knowledge of the latest industry trends and best practices in information security') },
                                    { text: it.L('Extensive experience in bug bounty programmes such as HackerOne, Bugcrowd, and Cobalt') },
                                    { text: it.L('OSCP, CEH, Security+, CISSP, or any GIAC certification is an advantage') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='postgresql_database_administrator'>

                            <h1>{it.L('PostgreSQL Database Administrator (DBA)')}</h1>

                            <p>{it.L('[_1]\'s  IT team is responsible for the design, development, and operation of our high-traffic networks. As our PostgreSQL Database Administrator, you will plan, implement, and manage the database systems that are essential to the architecture of our high-traffic binary options trading platform.', it.website_name)}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Plan, install, and configure world-class database systems that meet business objectives and the needs of end users') },
                                    { text: it.L('Assist backend developers in writing production-ready SQL code') },
                                    { text: it.L('Plan and carry out the upgrade and migration of databases as needed') },
                                    { text: it.L('Develop, implement, and test database backup and recovery plans') },
                                    { text: it.L('Manage database security by controlling access to data through authentication, authorisation, and auditing') },
                                    { text: it.L('Perform tests to ensure database performance and security, as well as data integrity') },
                                    { text: it.L('Document and administer database policies, procedures, and standards') },
                                    { text: it.L('Plan and execute data extraction for efficient loading in data warehouse, and ensure extracted data is useful and properly formatted') },
                                    { text: it.L('Troubleshoot and debug problems in existing database systems, and find new ways to improve their speed, functionality, and scalability') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    {
                                        type              : 'nested',
                                        text              : it.L('Experience as a Postgres DBA, with advanced hands-on knowledge of'),
                                        subitems_className: 'bullet',
                                        subitems          : [
                                            { text: it.L('Database Setup,') },
                                            { text: it.L('Security,') },
                                            { text: it.L('Replication,') },
                                            { text: it.L('Performance Tuning,') },
                                            { text: it.L('Disaster Recovery,') },
                                            { text: it.L('SQL,') },
                                            { text: it.L('Stored Procedures') },
                                        ],
                                    },
                                    { text: it.L('Experience with database testing tools such as pgTAP') },
                                    { text: it.L('Experience with data extraction and reporting for data warehouse/cube') },
                                    { text: it.L('Knowledge of Linux system administration, including configuration and automation tools such as Chef as well as Shell scripting is preferred') },
                                    { text: it.L('Knowledge of scripting language and Perl in particular is a plus') },
                                    { text: it.L('Experience with Multidimensional Expressions (MDX) is an advantage') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='ui_ux_designer'>
                            <h1>{it.L('UI/UX Designer')}</h1>

                            <p>{it.L('[_1]\'s UI/UX team explores the many ways that we can design better product experiences for our users. As our UI/UX Designer, you will play a key role in conceptualising and defining user experience and interaction across multiple websites and applications.', it.website_name)}</p>

                            <p>{it.L('You will solve complex user experience problems, and seamlessly communicate product features and functions to our users through meaningful design. You will play a key role in creating intuitive and functional products that give our users the best experience possible so we can keep growing our user base and revenue.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Conduct research using a variety of qualitative and quantitative methods') },
                                    { text: it.L('Create user personas; define user task flows and UI specifications; and run A/B tests to understand user behaviours and their most pressing needs') },
                                    { text: it.L('Be involved in every phase of product development, from concept to execution to launch to give the product a distinct and consistent visual identity, as well as ensure that it fully serves the needs of the end user') },
                                    { text: it.L('Create and update style guides to establish and maintain a consistent visual identity across our product ecosystem') },
                                    { text: it.L('Create visual elements for websites and applications, including icons and images') },
                                    { text: it.L('Create and maintain wireframes and mockups for new and existing products') },
                                    { text: it.L('Keep up with the latest trends and techniques in design, UI, and UX') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Proven UI and UX experience with a strong portfolio of work') },
                                    { text: it.L('Ability to conduct end-to-end UX research, including usability testing, and A/B testing') },
                                    { text: it.L('Experience in interpreting complex concepts and processes to develop intuitive and logical user flows and usage scenarios') },
                                    { text: it.L('Extensive experience in creating interactive UI elements for web and mobile apps') },
                                    { text: it.L('Proficiency in designing intuitive and cohesive screens, pages, and visual elements that work as intended') },
                                    { text: it.L('Proficiency in Photoshop, Illustrator, Sketch, and other design and wireframing software') },
                                    { text: it.L('Knowledge of HTML, CSS, and JavaScript for rapid prototyping of websites and apps') },
                                    { text: it.L('Bachelor\'s degree in graphic design, interaction design, visual communication, multimedia, or equivalent') },
                                ]}
                            />
                        </div>

                    </div>

                    <div className='quality_assurance'>
                        <div className='invisible' id='software_tester'>
                            <h1>{it.L('Software Tester')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our websites, applications, and high-traffic networks. As our Software Tester, we rely on you to run high-quality tests to ensure the stability, quality, and usability of our website and codebase with each software release.', it.website_name)}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Test the [_1] website, applications, backend, and back-office systems', it.website_name) },
                                    { text: it.L('Work closely with the rest of the QA and IT teams to plan, design, and execute several types of testing based on different objectives') },
                                    { text: it.L('Create, execute, and update manual and automated test plans') },
                                    { text: it.L('Plan and integrate various types of testing into our existing workflow') },
                                    { text: it.L('Ensure the integrity of releases by coordinating testing activities') },
                                    { text: it.L('Track and document thoroughly the bugs that you find') },
                                    { text: it.L('Investigate, reproduce, identify, document, and resolve issues reported by our clients and the customer support team') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Bachelor\'s degree in computer science, or an equivalent combination of technical education, training, and work experience') },
                                    { text: it.L('Ability to write high-quality, self-documenting code using test-driven development techniques') },
                                    { text: it.L('Minimum two years experience in a software or web application testing role') },
                                    { text: it.L('Experience designing and executing test plans (both automated and manual)') },
                                    { text: it.L('Extensive knowledge of JavaScript , AJAX, JSON, CSS') },
                                    { text: it.L('Proficiency with one or more scripting languages, such as Python, PHP or C/C++. Perl is preferred') },
                                    { text: it.L('Experience with agile development methods such as Scrum or Kanban') },
                                    { text: it.L('Experience with Postgres or another RDBMS is a plus') },
                                    { text: it.L('Familiarity with Git') },
                                    { text: it.L('Passion for Linux and other open-source platforms') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='quantitative_analysis'>
                        <div className='invisible' id='quantitative_analyst'>
                            <h1>{it.L('Quantitative Analyst')}</h1>

                            <p>{it.L('[_1]\'s Quantitative Analytics team is responsible for the pricing of our binary options. You will join them in managing the risk and profitability of the company\'s options book.', it.website_name)}</p>

                            <p>{it.L('The work that you do is complex, challenging, and essential to our future.')}</p>

                            <p>{it.L('We process over a million transactions each day, and manage a book of exotic options which exceeds the complexity of the typical derivatives desk.')}</p>

                            <p>{it.L('Since all transactions on the [_1] website are fully automated, our pricing and risk management algorithms must fully consider critical factors such as real-time pricing parameters, data feed irregularities, and latencies.', it.website_name)}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Develop derivatives pricing, risk management models, and algorithms using C/C++, R, MATLAB, Perl, Python, and Java') },
                                    { text: it.L('Review, develop, and enhance Perl, C++, and R codes used in options pricing, volatility forecasts, and risk management programs') },
                                    { text: it.L('Maintain accurate system pricing parameters') },
                                    { text: it.L('Perform data mining using SQL databases, R/S-Plus, OLAP, and other analytical tools') },
                                    { text: it.L('Monitor website trading activity and minimise abuse') },
                                    { text: it.L('Generate periodic and special reports that summarise client trading trends') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('An advanced university degree in Physics, Financial Engineering or Mathematics') },
                                    { text: it.L('Experience in exotic options pricing, volatility forecasts, high-frequency trading, and the analysis of market inefficiencies') },
                                    { text: it.L('Knowledge of probability theory, stochastic calculus, numerical methods, Monte-Carlo simulation, differential equations, econometrics, and statistical modelling') },
                                    { text: it.L('Expertise in the application of object-oriented programming languages (C++, Perl, and Java), coupled with the ability to produce high-quality code') },
                                    { text: it.L('Experience in using financial information sources such as Bloomberg and Reuters') },
                                    { text: it.L('Relevant experience in the use of quant programming libraries and frameworks (QuantLib, Pricing Partners, FINCAD, and Numerix), and quant pricing platforms (SuperDerivatives and FENICS) would be a plus') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='financial_markets_analyst'>
                            <h1>{it.L('Financial Markets Analyst')}</h1>

                            <p>{it.L('As our Senior Financial Markets Analyst, you will manage the day-to-day risk of our trading books, conduct complex quantitative analysis, carry out performance testing, develop advanced data analytics tools, and support other related operations that have a direct impact on the profitability and future growth of our company.')}</p>
                            <p>{it.L('This includes decisions on new markets to launch in, and the spreads and margins we might offer. You must also be able to analyse and interpret large volumes of data, and communicate your research and findings in a clear and concise manner - either in written reports or presentations.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Create mathematical/statistical models for pricing, analyse fat tails to assess margin requirements, and manage the risk for exotic options, Forex, and CFDs') },
                                    { text: it.L('Create data analytics tools for trading/quantitative analysis') },
                                    { text: it.L('Conduct performance testing including backtesting, stress testing analysis, and benchmarking') },
                                    { text: it.L('Develop risk management models and algorithms using MATLAB/Python/R/C++') },
                                    { text: it.L('Manage day-to-day risk of our trading books') },
                                    { text: it.L('Set up liquidity connections via bridges and gateways for MT4 and MT5 brokers') },
                                    { text: it.L('Conduct research on competitors and industry trends to identify new products and potential markets') },
                                    { text: it.L('Develop mathematical/statistical models for pricing and risk management for all products') },
                                    { text: it.L('Use advanced data analytics skills to study trends/pattern in financial markets') },
                                    { text: it.L('Help in developing advanced risk management tools for various markets (forex, equities, commodities)') },
                                    { text: it.L('Prepare daily, weekly, and monthly financial reports') },
                                    { text: it.L('Generate periodic and special reports on client trading activity and significant trends that impact our client behaviour') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('An advanced university degree in physics, financial engineering, or mathematics is preferred') },
                                    { text: it.L('Experience in Forex spot trading or exotic options pricing, volatility forecasts, high-frequency trading, and the analysis of market inefficiencies') },
                                    { text: it.L('Firm grasp of advanced risk management concepts, including hedging, Greeks (first and second generation), Value at Risk models, etc.') },
                                    { text: it.L('Experience in using financial information sources such as Bloomberg and Reuters') },
                                    { text: it.L('Strong analytical skills and the ability to communicate your findings in a clear, concise, and effective manner') },
                                    { text: it.L('Relevant experience in the use of quant programming libraries and frameworks (QuantLib, Pricing Partners, FINCAD, and Numerix), and quant pricing platforms (SuperDerivatives and FENICS) would be a plus') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='data_analytics'>
                        <div className='invisible' id='data_scientist'>
                            <h1>{it.L('Data Scientist')}</h1>

                            <p>{it.L('We need a talented Data Scientist with the technical skills and creative curiosity to explore and solve complex business problems.')}</p>

                            <UlText
                                text={it.L('You should be passionate about:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Focusing on customer\'s needs in everything that you do.') },
                                    { text: it.L('Approaching even the smallest task with an open mind and learning new skills.') },
                                    { text: it.L('Constant, open and honest communication.') },
                                    { text: it.L('Fixing problems and providing feedback for improvement.') },
                                    { text: it.L('Doing great work and inspiring others to do the same.') },
                                    { text: it.L('Being in touch with the latest tools and technology related to your role.') },
                                    { text: it.L('Solving complex business problems using data-driven techniques.') },
                                    { text: it.L('Converting data into actionable insights that contribute to business strategies.') },
                                ]}
                            />

                            <UlText
                                text={it.L('We need you to:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Conduct full lifecycle analysis that include requirements, activities, and design.') },
                                    { text: it.L('Ask the right questions to identify potential problems to be solved, the scope involved and the availability of relevant data.') },
                                    { text: it.L('Use data governance tools to ensure data is accurate and consistent for effective analysis.') },
                                    { text: it.L('Convert raw data into an easy-to-understand format for analysis and reporting purposes.') },
                                    { text: it.L('Translate data into consumable information and assist in making data-driven decisions across departments.') },
                                    { text: it.L('Develop and implement databases; collect, design, process, analyse, and present data in a meaningful way.') },
                                    { text: it.L('Communicate and collaborate effectively with members of different teams across the organisation.') },
                                ]}
                            />

                            <UlText
                                text={it.L('You must have:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Experience with reporting packages, SQL, programming (Python/R) and ETL frameworks.') },
                                    { text: it.L('Experience with machine learning algorithms, decision trees, neural networks, clustering, etc.') },
                                    { text: it.L('Experience with statistical and data mining techniques like GLM/Regression, Random Forest, Boosting, text mining, social media analysis, etc.') },
                                    { text: it.L('Strong analytical skills with the ability to transform data into optimal business decisions.') },
                                    { text: it.L('A strong background in statistics, mathematics or engineering.') },
                                    { text: it.L('Strong communication skills.') },
                                    { text: it.L('Ability to present data using various tools to help the team to make informed business decisions.') },
                                ]}
                            />

                            <UlText
                                text={it.L('Good to have:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Experience in data visualisation') },
                                    { text: it.L('Experience in cybersecurity and data protection') },
                                    { text: it.L('Experience with MDX query language') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='marketing'>
                        <div className='invisible' id='affiliate_country_manager'>
                            <h1>{it.L('Affiliate/Country Manager')}</h1>

                            <p>{it.L('The Country Manager is expected to acquire, service, manage, and expand our network of active affiliates in the countries where Binary Group targets to be represented. You will also contribute your energy, skills, and knowledge of the local business culture to increase our rapid growth rate worldwide.')}</p>
                            <p>{it.L('You are also expected to help us promote our cutting-edge trading platform that has been one of the most recognised in the binary options trading industry for over 18 years.')}</p>

                            <UlText
                                className='bullet'
                                items={[
                                    { text: it.L('Recruit, train, and nurture affiliates and IBs in countries where Binary Group is active, leveraging your direct knowledge and experience of the local market') },
                                    { text: it.L('Drive rapid growth and business development to support the company\'s sales and marketing objectives') },
                                    { text: it.L('Coordinate business development activities and generate high-quality partnership leads') },
                                    { text: it.L('Adapt affiliate marketing tactics and promotional materials as needed to localise all content for maximum effectiveness') },
                                    { text: it.L('Utilise a variety of tactics – both online and offline – to grow and support the company\'s network of partners in your designated market') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Bachelor\'s degree in marketing, business administration, or related discipline') },
                                    { text: it.L('At least 5 years of experience in affiliate marketing, growth hacking, business development, and other closely-related skills') },
                                    { text: it.L('An assertive, sales-driven personality, able to adapt quickly and achieve powerful results') },
                                    { text: it.L('Strong oral and written communication skills in both the regional language(s) and English') },
                                    { text: it.L('Knowledge and experience in the financial services industry and/or binary options trading') },
                                    { text: it.L('IT knowledge or experience is preferred') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='technical_marketing_executive'>
                            <h1>{it.L('Technical Marketing Executive')}</h1>

                            <p>{it.L('The Marketing team oversees all our marketing initiatives, such as our partnership programmes, social media presence, webinars, PPC, SEO, and email marketing. As our Technical Marketing Executive, you will act on data-driven information and assist in troubleshooting issues to further nurture and grow our client base.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Act as first and second level support for our traders by offering them solutions through basic coding and troubleshooting techniques') },
                                    { text: it.L('Engage in market development to grow the client base for existing products and platforms of the company') },
                                    { text: it.L('Perform market research and analysis to uncover trends, prospects, partners, and competitors for our client base') },
                                    { text: it.L('Support overall development, planning and execution of the team\'s digital marketing efforts in accordance to the marketing objectives of respective projects') },
                                    { text: it.L('Contribute creative ideas to further the company\'s dynamic branding effort') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Exceptional English communication skills (both oral and written)') },
                                    { text: it.L('Creative and analytical thinking that leads to actionable tactics and measurable results') },
                                    { text: it.L('An intermediate understanding of the interaction of information technology and client servicing aspects within the B2B and B2C environments') },
                                    { text: it.L('University degree in Marketing, Mathematics, IT/Programming or any related field') },
                                    { text: it.L('Considerable knowledge in creating meaningful analytics from raw data, with the goal of influencing clients to take action') },
                                    { text: it.L('A broad foundation in HTML, CSS, Websocket API or MQL programming to develop solutions and answer queries') },
                                    { text: it.L('A keen eye to identify new trends in marketing, evaluate new technologies and ensure the brand is at the forefront of industry developments') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='marketing_executive'>
                            <h1>{it.L('Marketing Executive')}</h1>

                            <p>{it.L('The Marketing team oversees all our marketing and advertising initiatives, such as our affiliate programme, social media presence, webinars, and emails. As our Marketing Executive, you will coordinate and execute marketing campaigns across a variety of channels, and continuously identify the best ways to reach current and prospective customers.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Plan, coordinate, and execute a wide range of promotional campaigns') },
                                    { text: it.L('Monitor campaigns using key metrics and submit reports on campaign performance') },
                                    { text: it.L('Perform market research and analysis to uncover trends, prospects, partners, and competitors') },
                                    { text: it.L('Produce content for websites, blogs, social media, and marketing materials') },
                                    { text: it.L('Maintain relationships with clients and partners to drive retention and loyalty') },
                                    { text: it.L('Contribute ideas, energy, and creativity to further the company\'s dynamic branding efforts') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Exceptional English communication skills (both oral and written)') },
                                    { text: it.L('Creative and analytical thinking that leads to actionable tactics and results') },
                                    { text: it.L('Knowledge of affiliate marketing, email marketing, and basic HTML') },
                                    { text: it.L('University degree in marketing, journalism, communication, or a business-related discipline') },
                                    { text: it.L('Passion for advertising and marketing') },
                                    { text: it.L('Experience in the financial services industry') },
                                    { text: it.L('Experience in content writing is welcome') },
                                    { text: it.L('Ability to speak multiple languages is preferred') },
                                    { text: it.L('Interest in IT or software development') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='graphics_designer'>
                            <h1>{it.L('Graphics Designer')}</h1>

                            <p>{it.L('[_1]\'s UI/UX team explores the many ways that we can design better product experiences for our users. As our Graphic Designer, you will develop high-impact graphics and visual elements such as images and icons for our websites and applications. You will play an essential role in creating user interface assets that bring our products and users closer together.', it.website_name)}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Design logos, icons, and other visuals for our websites and applications') },
                                    { text: it.L('Lay out mockups and wireframes for app screens and web pages') },
                                    { text: it.L('Come up with cohesive design solutions that can achieve our business/product goals and satisfy user needs') },
                                    { text: it.L('Communicate with a wide range of technical and non-technical teams to understand the unique selling points of our products, concepts, user flows, and usage scenarios') },
                                    { text: it.L('Incorporate our brand identity into new products, pages, and features') },
                                    { text: it.L('Keep up with the latest trends and techniques in design, UI, and UX') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Proven graphic design experience with a strong portfolio of work in branding, advertising, and marketing') },
                                    { text: it.L('Ability to communicate and present your ideas and work in a clear, descriptive manner') },
                                    { text: it.L('Experience in interpreting complex concepts and processes to create design solutions that help our users achieve their goals') },
                                    { text: it.L('Strong understanding of colours, typography, identity design, and branding') },
                                    { text: it.L('Creative flair and versatility in developing concepts, graphics, and layouts for a wide range of media') },
                                    { text: it.L('Proficiency in Photoshop, Illustrator, InDesign, Sketch, and other design and wireframing software') },
                                    { text: it.L('Bachelor\'s degree in graphic design, visual communication, multimedia, or equivalent') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='copywriter'>
                            <h1>{it.L('Copywriter')}</h1>

                            <p>{it.L('[_1]\'s Marketing team oversees all our marketing and advertising initiatives, such as our affiliate programme, social media presence, webinars, and emails. As our Copywriter, you will help us to craft copy and content that engages our audiences - both online and offline.', it.website_name)}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Create clear, concise, and engaging content for the company\'s website, email newsletters, blog, social media channels, and other marketing materials') },
                                    { text: it.L('Adapt brand messaging, voice, and tone of content as needed to suit specific audiences, business objectives, and the channel of delivery') },
                                    { text: it.L('Edit, proofread, and improve content from other team members') },
                                    { text: it.L('Follow established workflows for content deliverables') },
                                    { text: it.L('Work closely with other departments to create marketing communication materials such as ads, product announcements, guides, job descriptions, and more') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Accomplished writing and editing skills with at least five years editorial experience in digital advertising or online media') },
                                    { text: it.L('Thorough knowledge of web writing best practices') },
                                    { text: it.L('Experience in content strategy - i.e. planning, creating, publishing, and updating content for small and large websites') },
                                    { text: it.L('Meticulous English language skills, with keen eye for detail when it comes to punctuation, spelling, grammar, and syntax') },
                                    { text: it.L('Ability to translate complex, technical information into clear, attractive benefits') },
                                    { text: it.L('Capacity to multitask, balance deadlines, and reliably deliver high-quality content') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='accounting'>
                        <div className='invisible' id='accounts_and_payments_executive'>
                            <h1>{it.L('Accounts and Payments Executive')}</h1>

                            <p>{it.L('Our Accounting &amp; Payments team manages our wide range of bank accounts and e-currency systems, as well as the huge volume of transactions that take place every day.')}</p>

                            <p>{it.L('They also generate monthly management accounts, annual audited accounts, and reconcile all transactions. As our Accounts &amp; Payments Executive, you will be able to contribute to all these key areas and increase the efficiency of our financial operations.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Process client payments, as well as handle and resolve client payment queries') },
                                    { text: it.L('Track and manage transactions and accounts using proprietary and non-proprietary software and systems') },
                                    { text: it.L('Process transactions for clients who make deposits and withdrawals using a wide range of third-party payment services, including bank wire, credit card, and e-currency') },
                                    { text: it.L('Perform reconciliations of all transactions that take place through third-party payment services and banks') },
                                    { text: it.L('Assist in management accounting for all companies within the Binary Ltd. group') },
                                    { text: it.L('Work closely with the affiliate marketing team to process affiliate commission payments on a monthly basis') },
                                    { text: it.L('Constantly liaise with all internal departments such as Customer Support and Marketing on account and payment matters') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('A lifelong interest in accounting, and an aptitude for numbers') },
                                    { text: it.L('A university degree with a major in accounting, or other relevant professional qualifications') },
                                    { text: it.L('At least one year of work experience in a similar role') },
                                    { text: it.L('Proficiency with popular office applications such as Microsoft Excel, accounting software, and databases') },
                                    { text: it.L('In-depth knowledge of accounting principles, best practices, standards, and regulations') },
                                    { text: it.L('Ability to quickly learn new (proprietary) systems and procedures') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='compliance'>
                        <div className='invisible' id='compliance_executive'>
                            <h1>{it.L('Compliance Executive')}</h1>

                            <p>{it.L('As our Compliance Executive, you must ensure that our group of companies worldwide conduct their business operations in full compliance with relevant laws and regulations - both national and international.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Work with the Head of Compliance to ensure group of companies comply with AML, KYC, and Data Protection laws and regulations') },
                                    { text: it.L('Plan and direct internal programmes and policies to empower all departments with the knowledge, awareness, and practices of regulatory compliance') },
                                    { text: it.L('Track laws and regulations that may affect all group companies and implement necessary changes to internal policies in order to manage and mitigate our risk and exposure') },
                                    { text: it.L('Screen and approve website content and marketing promotions') },
                                    { text: it.L('Review and monitor business contracts and agreements entered into by group companies worldwide') },
                                    { text: it.L('Assist with regulatory audits and annual statutory audits of group companies worldwide') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('A bachelor\'s degree in commerce or any business-related field, law, or risk management') },
                                    { text: it.L('A good understanding of, and keen interest in corporate, legal or regulatory compliance') },
                                    { text: it.L('Thorough understanding of Anti-Money Laundering (AML) and Know Your Customer (KYC) processes') },
                                    { text: it.L('The ability to draft and review legal documents, and prepare licence applications') },
                                    { text: it.L('A proactive approach in problem-solving') },
                                    { text: it.L('The ability to absorb and understand varied compliance matters in a number of international jurisdictions') },
                                    { text: it.L('Excellent communication and interpersonal skills') },
                                    { text: it.L('Excellent proficiency in spoken and written English') },
                                    { text: it.L('A Diploma in Financial Crime, Risk Management and Compliance (ICA) will be an advantage') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='payments_and_compliance_analyst'>
                            <h1>{it.L('Payments and Compliance Analyst')}</h1>

                            <p>{it.L('You are responsible for mitigating the risks and abuse that we face from fraud and money laundering. To accomplish this, you must monitor, analyse, and conduct various anti-fraud and AML checks on client accounts and deposits. You will join us in Malta and report to our Head of Payments.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Monitor fraud and money laundering patterns in deposit and withdrawal behaviour') },
                                    { text: it.L('Work closely with the Head of Payments to proactively suggest improvements to cashier setup, including customer activity from an AML and anti-fraud perspective and overall fraud and payment performances (card success rates, chargebacks, etc.)') },
                                    { text: it.L('Work closely with customer support, compliance, and payment teams') },
                                    { text: it.L('Support the payments team in certain daily analysis where needed') },
                                    { text: it.L('Approve e-wallet payouts and withdrawal rules') },
                                    { text: it.L('Coordinate with Payment System Service Providers in offering cryptocurrencies and digital wallets as a payment method') },
                                    { text: it.L('Research new Payment Systems that are available in the market') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('A bachelor\'s degree in commerce or any business-related field, IT-related field or criminology') },
                                    { text: it.L('Good understanding of the link between payments functionality, as well as money laundering and fraud prevention') },
                                    { text: it.L('Aptitude for working in an international environment') },
                                    { text: it.L('Ability to acquire knowledge of varied AML matters in a multitude of international jurisdictions') },
                                    { text: it.L('Proactive approach in problem-solving and solution delivery') },
                                    { text: it.L('Proficiency in Microsoft Excel is required') },
                                    { text: it.L('Excellent proficiency in spoken and written English') },
                                    { text: it.L('Knowledge of payment transaction analysis, in particular e-wallets/cryptocurrencies will be considered an advantage') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='risk_management_executive'>
                            <h1>{it.L('Risk Management Executive')}</h1>

                            <p>{it.L('As our Risk Management Executive, we will depend on you to devise and execute effective analyses to identify potential risks to the Company and design and implement measures to eliminate such risks.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Investigate client accounts that have been flagged by existing fraud controls and processes') },
                                    { text: it.L('Scrutinise clients\' user behaviour on our trading platform') },
                                    { text: it.L('Review and analyse suspicious client activities') },
                                    { text: it.L('Review and approve KYC documents') },
                                    { text: it.L('Verify and approve clients\' deposit and withdrawal requests') },
                                    { text: it.L('Create strategies against potential risks that might arise due to disruptive innovation') },
                                    { text: it.L('Evaluate existing procedures and policies with respect to risk management and suggest improvements') },
                                    { text: it.L('Maintain trackable records of investigations in AML-CTF-related matters') },
                                    { text: it.L('Provide guidance to the Company\'s operational teams and act as internal second line support for AML-CTF, anti-fraud, and authentication purposes') },
                                    { text: it.L('Adhere to internal policies, procedures, and guidelines on all matters that concern risk management') },
                                    { text: it.L('Prepare reports on investigations and resolved issues') },
                                    { text: it.L('Handle chargeback disputes and review regulatory complaints') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Degree in Finance, Economics, Law, Risk Management, Criminology, Business Studies, or Management') },
                                    { text: it.L('A firm grasp of AML-CTF regulations, typologies, and red flags, as well as fraud processes and applications') },
                                    { text: it.L('Strong analytical capabilities that have been proven in a prior capacity or a keen interest to move into this area') },
                                    { text: it.L('An eagerness for robust risk management to keep up with the increasing pace of information exchange') },
                                    { text: it.L('Self-motivation and flexibility in task rotations') },
                                    { text: it.L('An aptitude to handle thrilling challenges as well as repetitive tasks as might be needed') },
                                    { text: it.L('The ability to make rational decisions even based on limited information') },
                                    { text: it.L('Organisational skills and the ability to work proactively') },
                                    { text: it.L('A high level of integrity, reliability, and work ethic') },
                                    { text: it.L('Proficiency in Excel and big data analysis') },
                                    { text: it.L('An excellent command of spoken and written English') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='internal_audit'>
                        <div className='invisible' id='internal_audit_executive'>
                            <h1>{it.L('Internal Audit Executive')}</h1>

                            <p>{it.L('The Internal Audit team is the catalyst for improving our organisation\'s governance, risk management, and internal controls by providing insights and recommendations based on the audits they perform.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Evaluate and improve the effectiveness of internal controls, risk management, regulatory compliance, financial and operational processes') },
                                    { text: it.L('Assist in preparing audit plans and programmes which includes functions, activities, objectives, scopes, and methodology') },
                                    { text: it.L('Perform audit assignments and identify control gaps and opportunities for improvement') },
                                    { text: it.L('Summarise audit findings and work with department heads on the proposed solutions') },
                                    { text: it.L('Prepare reports expressing audit opinions on the adequacy and effectiveness of the internal controls and operational efficiency') },
                                    { text: it.L('Follow up on the recommendations and timeline for corrective actions with department heads') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('A university degree in Accounting/Finance or its equivalent') },
                                    { text: it.L('Exceptional English communication skills (both oral and written)') },
                                    { text: it.L('A strong understanding of internal controls and business processes') },
                                    { text: it.L('Creative and analytical thinking that leads to actionable solutions and outcomes') },
                                    { text: it.L('Good reporting skills with a keen eye for detail') },
                                    { text: it.L('Ability to work independently') },
                                    { text: it.L('Advanced knowledge of Microsoft Office') },
                                    { text: it.L('Experience in IT auditing or in-depth knowledge of computer systems is an advantage') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='human_resources'>
                        <div className='invisible' id='hr_operations_executive'>
                            <h1>{it.L('HR Operations Executive')}</h1>

                            <p>{it.L('The Human Resource Operations team manages essential human resource functions such as managing expats, processing work permits, onboarding, managing payroll, compiling compensation studies, and overseeing performance appraisals.')}</p>

                            <p>{it.L('They also manage our suppliers and contractors, as well as general administrative duties and procedures. As our Human Resource Operations Executive, you will be counted on to lead, execute, and support a wide range of HR-related and administrative tasks to ensure the smooth operations of our offices worldwide.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Support our global recruitment and talent management needs, including onboarding, processing work permits, and expat management') },
                                    { text: it.L('Liaise with governmental authorities such as the Immigration Department, and Inland Revenue Board on a regular basis on behalf of the company and employees') },
                                    { text: it.L('Administer key human resource activities such as performance appraisals') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('An advanced/higher/graduate diploma or bachelor\'s degree') },
                                    { text: it.L('Extensive experience in Microsoft Office applications, as well as popular HR management and payroll systems') },
                                    { text: it.L('Well-honed organisational, administrative, and accounting skills') },
                                    { text: it.L('Excellent oral and written communication skills in English and Bahasa Malaysia') },
                                    { text: it.L('Relevant work experience in a related field, such as managing and onboarding expats, processing work permits, and dealing with Malaysian governmental authorities will be a plus') },
                                ]}
                            />

                        </div>

                        <div className='invisible' id='talent_acquisition_executive'>
                            <h1>{it.L('Talent Acquisition Executive')}</h1>

                            <p>{it.L('The Recruitment team plays a challenging role in the company by sourcing and selecting quality applicants that will contribute to the company growth.')}</p>

                            <UlText
                                className='bullet'
                                items={[
                                    { text: it.L('Support our global recruitment and talent management needs') },
                                    { text: it.L('Schedule and coordinate interviews with candidates') },
                                    { text: it.L('Develop and update job descriptions and specifications') },
                                    { text: it.L('Assist and participate in recruitment activities including career fairs and campus recruitment') },
                                    { text: it.L('Build our applicant database by researching and contacting various sources (eg: universities and job portals)') },
                                    { text: it.L('Work alongside the HR Operations team in coordinating with the government linked bodies') },
                                    { text: it.L('Assisting to prepare monthly/yearly recruitment analytics and hiring status report') },
                                    { text: it.L('Collaborate with the marketing and design team to create recruitment branding materials') },
                                    { text: it.L('Assist in organizing online technical tests') },
                                    { text: it.L('Provide additional assistance to team when needed') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('A university degree, or other relevant professional qualifications') },
                                    { text: it.L('Work experience as a Recruiter in the IT industry or similar role is an advantage') },
                                    { text: it.L('Excellent communication (both oral and written) and interpersonal skills') },
                                    { text: it.L('Strong decision-making skills') },
                                    { text: it.L('Ability to quickly learn new systems and procedures') },
                                    { text: it.L('Ability to work independently') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='customer_support'>
                        <div className='invisible' id='customer_support_executive'>
                            <h1>{it.L('Customer Support Executive')}</h1>

                            <p>{it.L('As our Customer Support Executive, you will serve as the voice of the company, and help our customers resolve and reduce the issues they\'re facing with our products and services. The frontline is essential to our business and you are expected to deliver world-class customer service that creates customer loyalty and promotes business growth.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Resolve complex customer care issues through careful investigation and in keeping with existing policies and procedures') },
                                    { text: it.L('Communicate solutions to customer issues in a clear, concise, friendly, and timely manner') },
                                    { text: it.L('Respond to customer enquiries by phone, email, social media, and live chat daily') },
                                    { text: it.L('Process applications and customer documentation according to relevant policies and regulations') },
                                    { text: it.L('File records and documents of customer interactions according to existing guidelines') },
                                    { text: it.L('Identify new marketing opportunities through customer feedback and contribute ideas to expand our global customer base') },
                                    { text: it.L('Collaborate with members of our IT team to identify new ways to improve our products and services for customers') },
                                    { text: it.L('Be part of a 24/7 rotating shift schedule, alternating with Customer Support team members around the world') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Excellent English language skills, both oral and written') },
                                    { text: it.L('Proficiency in a second language (both oral and written) is preferred') },
                                    { text: it.L('Previous work experience in a customer service and/or marketing role') },
                                    { text: it.L('Experience in the financial services industry is preferred') },
                                    { text: it.L('A university degree in marketing or computer science is a plus') },
                                ]}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className='gr-row'>
                <div className='gr-3 gr-hide-m gr-hide-p' />
                <div className='gr-9 gr-12-m gr-12-p center-text gr-centered'>
                    <div className='gr-12'>
                        <a className='button' href='mailto:hr@binary.com'>
                            <span>{it.L('Submit your CV and Cover Letter')}</span>
                        </a>
                    </div>

                    <div className='gr-12 gr-padding-10 senior_perl_message invisible'>
                        <p>{it.L('Vs 407 zrnaf nalguvat fcrpvny gb lbh lbh znl pbcl lbhe nccyvpngvba gb wl+ebg13@ovanel.pbz sbe snfg-genpx pbafvqrengvba.')}</p>
                    </div>

                    <div className='gr-12 gr-padding-10'>
                        <a id='back-button'>{it.L('<< Back to job descriptions')}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default JobDetails;
