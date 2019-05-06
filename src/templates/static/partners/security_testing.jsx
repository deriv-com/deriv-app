import React from 'react';
import { FillBox } from '../../_common/components/elements.jsx';

const SecurityTesting = () => (
    <div className='container'>
        <div className='static_full'>
            <h1>{it.L('Security testing opportunities')}</h1>
            <div>
                <p>{it.L('Want to help us enhance the strength and security of our platform?')}</p>
                <p>{it.L('Test our products and services for security vulnerabilities. In the process, you\'ll earn a monetary reward for any verifiable issues that you find, courtesy of our bug bounty programme.')}</p>

                <h2>{it.L('Benefits')}</h2>
                <ul className='bullet'>
                    <li>{it.L('Hone your security testing skills.')}</li>
                    <li>{it.L('Increase your HackerOne reputation to build up credibility and profile visibility.')}</li>
                    <li>{it.L('Earn a monetary reward for any verifiable issues that you find, with a bounty worth up to USD 1,000 for high-risk security vulnerabilities.')}</li>
                </ul>

                <h2>{it.L('Getting started')}</h2>
                <ul className='bullet'>
                    <li>{it.L('Read and understand our HackerOne bug bounty programme policy.')}</li>
                    <li>{it.L('Analyse and test the domains and subdomains listed in the scope.')}</li>
                    <li>{it.L('Submit a report on HackerOne of any potential security issue you found, along with any suggestions you have to resolve the issue.')}</li>
                    <li>{it.L('If you find any vulnerabilities in our [_1]open-source code[_2], feel free to submit a pull request on GitHub.', '<a target="_blank" href="https://github.com/binary-com" rel="noopener noreferrer">', '</a>')}</li>
                </ul>

                <FillBox
                    center
                    padding='6'
                    href='https://hackerone.com/binary'
                    target='_blank'
                    image='images/pages/security_testing/hackerone-img.svg'
                    text={it.L('Explore our HackerOne bounty programme')}
                />
            </div>
        </div>
    </div>
);

export default SecurityTesting;
