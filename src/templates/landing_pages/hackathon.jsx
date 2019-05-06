import React from 'react';
import Layout from './_common/layout.jsx';

const Hackathon = () => (
    <Layout
        meta_description={it.L('[_1] Hackathon Competition', it.broker_name)}
        css_files={[
            it.url_for('css/hackathon.css'),
        ]}
        js_files={[
            it.url_for('js/landing_pages/common.js'),
            it.url_for('js/landing_pages/hackathon.js'),
        ]}
    >
        <div className='navbar' id='navigation'>
            <div className='container'>
                <div className='navbar-header'>
                    <a className='navbar-brand page-scroll logo' href='#page-top' />
                </div>
                <div className='navbar-collapse'>
                    <ul className='nav navbar-nav'>
                        <li className='invisible'>
                            <a href='#page-top' />
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <section id='page-top' className='intro'>
            <h1 className='text-uppercase'>
                <span className='text-bold'>Hackathon </span><span className='text-thin'>Competition</span>
            </h1>
            <div className='intro-bg' />
            <div id='register' className='white-bg'>
                <div className='container'>
                    <h1>Thank you for all those who participated.</h1>
                    <h3>Stay tuned for updates on our next Hackathon competition!</h3>
                </div>
            </div>
        </section>

        <footer className='text-center'>
            <div className='container'>
                <p>
                    Visit our
                    <a className='text-bold' target='_blank' rel='noopener noreferrer' href='https://www.binary.com/en/careers.html'>career page</a>
                     for more opportunities at Binary!
                </p>
            </div>
        </footer>
    </Layout>
);

export default Hackathon;
