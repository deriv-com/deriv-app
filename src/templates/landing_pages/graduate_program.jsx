import React  from 'react';
import Layout from './_common/layout.jsx';

const GraduateProgram = () => {
    const steps = [
        { icon: 'one',    title: 'Send us your resume',                                       description: 'Kickstart the application process by uploading your resume. Be sure to emphasise awards, achievements, projects, and open-source contributions that will make you stand out.' },
        { icon: 'two',    title: 'Phone interview',                                           description: 'If your resume makes the cut, we\'ll arrange a phone interview to get a better idea of who you are and what you\'re interested in.' },
        { icon: 'three',  title: 'Technical test',                                            description: 'If you pass our phone interview, we\'ll invite you to a technical test either on-site or online. You\'ll be asked technical questions which may require you to write code.' },
        { icon: 'four',   title: 'Self-Assessment Topgrading Interview (SATI) Questionnaire', description: 'Once you pass our technical test, we\'ll send you a SATI questionnaire to understand you better.' },
        { icon: 'five',   title: 'Job offer',                                                 description: 'If you ace your interviews and make a real impression on us, we\'ll contact you with an official offer to join our graduate programme.' },
    ];

    return (
        <Layout
            meta_description={it.L('[_1] Graduate Programme', it.broker_name)}
            css_files={[
                it.url_for('css/graduate_program.css'),
                'https://style.binary.com/binary.css',
            ]}
            js_files={[
                it.url_for('js/landing_pages/common.js'),
                it.url_for('js/landing_pages/graduate_program.js'),
            ]}
        >
            <div className='navbar-fixed-top' role='navigation' id='navigation'>
                <div className='container'>
                    <div className='navbar-header'>
                        <span id='toggle-menu' href='button' className='navbar-toggle' />
                        <a className='navbar-brand logo' href={it.url_for('home')} />
                    </div>
                    <div className='navbar-collapse'>
                        <ul className='nav navbar-nav'>
                            <li className='invisible'>
                                <a href='#page-top' />
                            </li>
                            <li>
                                <a className='page-scroll' href='#who-we-are'>{('Who we are')}</a>
                            </li>
                            <li>
                                <a className='page-scroll' href='#application-process'>{('Application process')}</a>
                            </li>
                            <li>
                                <a className='page-scroll' href='#teams'>{('Teams')}</a>
                            </li>
                            <li>
                                <a className='page-scroll' href='#programs'>{('Programs')}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <section id='page-top' className='intro'>
                <div className='intro-body'>
                    <h1 className='intro-text'>{(`${it.website_name} Graduate Programme`)}</h1>
                    <p className='intro-subtext'>{('Build a successful career at the cutting-edge of finance and technology')}</p>
                </div>
                <div className='intro-bg' />
                <div id='register' className='primary-bg-color-dark section-title-inverse'>
                    <a href='mailto:hr@binary.com' target='_blank' rel='noopener noreferrer' className='button'><span>Apply now</span></a>
                </div>
            </section>

            <section id='who-we-are' className='container'>
                <div className='section-title'>
                    <h2>Who we are</h2>
                </div>
                <p>{(`Looking for an exciting, challenging, and highly-rewarding graduate role in software development? ${it.website_name} is looking for A players who want to make a difference and impact the way thousands of people trade online.`)}</p>
                <p>{('As the pioneer in binary options trading, we\'re no strangers to big ideas and innovation. Here, you\'ll be given the opportunity to break the norm with support from some of the top talents in your field.')}</p>
                <p>{('Our graduate developers take on responsibilities from Day 1. We\'ve designed a world-class training programme to help you enhance the skills you have and master new ones, even as you\'re pushing the boundaries of what\'s possible at the intersection of finance and technology.')}</p>
            </section>

            <section className='container'>
                <div className='section-title'>
                    <h2>{('Who we\'re looking for')}</h2>
                </div>
                <div className='gr-row'>
                    <div className='gr-6 gr-12-m'>
                        <div className='box fill-bg-color'>
                            <p>{('We\'re looking for talented graduates who are passionate about software development and can get things done.')}</p>
                            <p>{('You must possess a natural curiosity and determination to solve complex problems and challenges.')}</p>
                            <p>{('You must also be a fast learner eager to adopt new tools and technology, and a  dynamic team player who values open and honest communication.')}</p>
                        </div>
                    </div>
                    <div className='separator gr-padding-30 gr-12-m' />
                    <div className='gr-6 gr-12-m'>
                        <h4 className='center-text'><span className='text-bold'>{('Education and experience requirements')}</span></h4>
                        <div className='inline-flex'>
                            <img className='icon-md margin-30' src={it.url_for('images/graduate_program/education_icon.svg')} />
                            <p>{('A bachelor\'s degree, master\'s degree, or PhD in computer science, IT, mathematics, physics, or engineering')}</p>
                        </div>
                        <div className='inline-flex'>
                            <img className='icon-md margin-30' src={it.url_for('images/graduate_program/coding_icon.svg')} />
                            <p>{('Experience with any of the following technologies: C, C++, Java, Perl, HTML, CSS, JavaScript, Amazon Web Services, and Google Cloud Platform')}</p>
                        </div>
                        <div className='inline-flex'>
                            <img className='icon-md margin-30' src={it.url_for('images/graduate_program/experience_icon.svg')} />
                            <p>{('If currently employed, you must have less than one year\'s worth of working experience')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id='application-process'>
                <div className='section-title-inverse primary-bg-color'>
                    <h2>{('Application process')}</h2>
                </div>
                <div className='container'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            {steps.map((step, idx) => (
                                <div key={idx} className='boxed-steps'>
                                    <span className={`${step.icon}_icon icon`} />
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id='teams'>
                <div className='section-title-inverse primary-bg-color'>
                    <h2>{('Product development teams')}</h2>
                </div>
                <div id='teams-tab' className='container tab-with-indicator'>
                    <ul className='tab-menu'>
                        <li className='tab'><a href='#frontend'>{('Front-end')}</a></li>
                        <li className='tab'><a href='#backend'>{('Back-end')}</a></li>
                        <li className='tab'><a href='#quants'>{('Quants')}</a></li>
                        <span className='active-tab-indicator' />
                    </ul>
                    <div className='tab-content-wrapper'>
                        <div id='frontend' className='tab-content'>
                            <div className='gr-row inline-flex'>
                                <div className='gr-7 gr-12-m'>
                                    <h2>{('Front-End')}</h2>
                                    <div className='box fill-bg-color'>
                                        <p>{('Develop and maintain user-facing websites and applications.')}</p>
                                        <p>{('Integrate new features into existing user interfaces.')}</p>
                                        <p>{('Resolve complex technical challenges faced by our suite of platforms.')}</p>
                                        <p>{('Software development stack: HTML, CSS, JavaScript')}</p>
                                    </div>
                                </div>
                                <div className='gr-5 gr-12-m'>
                                    <img className='gr-padding-30 responsive' src={it.url_for('images/graduate_program/frontend_icon.svg')} />
                                </div>
                            </div>
                        </div>
                        <div id='backend' className='tab-content'>
                            <div className='gr-row inline-flex'>
                                <div className='gr-7 gr-12-m'>
                                    <h2>{('Back-End')}</h2>
                                    <div className='box fill-bg-color'>
                                        <p>{('Build and manage APIs and product features.')}</p>
                                        <p>{('Scale up data architecture.')}</p>
                                        <p>{('Integrate third-party financial systems.')}</p>
                                        <p>{('Software development stack: Perl, Linux, C++, Chef, Postgres, Redis, Amazon Web Services, Google Cloud Engine')}</p>
                                    </div>
                                </div>
                                <div className='gr-5 gr-12-m'>
                                    <img className='gr-padding-30 responsive' src={it.url_for('images/graduate_program/backend_icon.svg')} />
                                </div>
                            </div>
                        </div>
                        <div id='quants' className='tab-content'>
                            <div className='gr-row inline-flex'>
                                <div className='gr-7 gr-12-m'>
                                    <h2>{('Quants')}</h2>
                                    <div className='box fill-bg-color'>
                                        <p>{('Manage and optimise pricing and risk management software for exotic options, Forex, and CFDs.')}</p>
                                        <p>{('Develop risk management models and algorithms.')}</p>
                                        <p>{('Develop software to study market microstructure and manage financial data feeds.')}</p>
                                        <p>{('Software development stack: Perl, R, Python, MATLAB')}</p>
                                    </div>
                                </div>
                                <div className='gr-5 gr-12-m'>
                                    <img className='gr-padding-30 responsive' src={it.url_for('images/graduate_program/quants_icon.svg')} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id='programs'>
                <div className='section-title-inverse primary-bg-color'>
                    <h2>{('What\'s in the programme?')}</h2>
                </div>
                <div className='container'>
                    <p>{('Our graduate programme is designed to tap into your true potential, give you deep insights into our business, and provide you with a platform to do amazing work.')}</p>
                    <div className='inline-flex'>
                        <img className='icon-lg margin-left-0' src={it.url_for('images/graduate_program/program1_icon.svg')} />
                        <p>{(`We\'ll kick things off with orientation week ${String.fromCharCode(8212)} a week spent away from the office that\'s all about learning and having fun. You\'ll participate in team building exercises, learn how to navigate your new workplace, and join a mini hackathon where you\'ll get the chance to make pull requests and contribute to our codebase.`)}</p>
                    </div>
                    <div className='inline-flex'>
                        <img className='icon-lg margin-left-0' src={it.url_for('images/graduate_program/program2_icon.svg')} />
                        <p>{('A buddy and mentor will be assigned to guide you throughout the programme. This will give you the opportunity to take part in pair coding sessions. You\'ll also have a friend to guide you throughout the programme.')}</p>
                    </div>
                    <div className='inline-flex'>
                        <img className='icon-lg margin-left-0' src={it.url_for('images/graduate_program/program3_icon.svg')} />
                        <p>{('Experience what your team does on a day-to-day basis while contributing to our codebase. Tasks will be assigned to you in increasing complexity and responsibility to gradually build your confidence.')}</p>
                    </div>
                    <div className='inline-flex'>
                        <img className='icon-lg margin-left-0' src={it.url_for('images/graduate_program/program4_icon.svg')} />
                        <p>{(`Attend our Software Craftsmanship Workshops ${String.fromCharCode(8212)} interactive lessons on a wide range of software development topics that will give you a better understanding of our codebase.`)}</p>
                    </div>
                </div>
            </section>

            <footer className='center-text primary-bg-color content-inverse-color'>
                <p>{('Browse all career opportunities at')} <a className='link' href={it.url_for('careers')} >{it.website_name}</a></p>
            </footer>
        </Layout>
    );
};

export default GraduateProgram;
