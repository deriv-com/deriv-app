import React from 'react';

const CloudflareDNS = () => (
    <React.Fragment>
        <h1>1.1.1.1</h1>
        <p>{it.L('Cloudflare\'s public DNS service gives you more secure and faster web browsing.')}</p>
        <div className='gr-row gr-row-align-center gr-padding-10'>
            <div className='gr-7 gr-12-m'>
                <img className='responsive' src={it.url_for('images/pages/settings/connect-1111.svg')} />
            </div>
        </div>
        <div className='gr-row'>
            <div className='gr-12 gr-padding-10'>
                <h2>{it.L('What is DNS')}</h2>
                <p>{it.L('The Domain Name System (DNS) allows you to access a website through a user-friendly web address such as [_1], instead of a complicated IP address.', `<a href="${it.url_for('/')}">www.binary.com</a>`)}</p>
            </div>
            <div className='gr-12 gr-padding-10'>
                <h2>{it.L('Why you should use [_1] instead of your ISP\'s default DNS service', '1.1.1.1')}</h2>
                <p>{it.L('The default DNS services provided by your ISP can be slow and insecure. [_1] recommends using Cloudflare\'s [_2] DNS service that gives you a faster and more private way to browse the Internet.', it.website_name, '1.1.1.1')}</p>
            </div>
        </div>
        <div className='gr-row gr-row-align-center gr-padding-10'>
            <a className='button gr-12-m' href='https://1.1.1.1' target='_blank' rel='noopener noreferrer'>
                <span className='no-capitalize'>{it.L('Set up [_1] on your device now', '1.1.1.1')}</span>
            </a>
        </div>
    </React.Fragment>
);

export default CloudflareDNS;
