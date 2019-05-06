import React from 'react';

const Column = ({
    id,
    header,
    text,
    url,
    image,
    className = '',
}) => (
    <div className={`gr-3 gr-6-m gr-parent ${className}`} id={id}>
        <div className='gr-8 gr-padding-10'>
            <a href={it.url_for(`user/settings/${url}`)}>
                <img className='responsive' src={it.url_for(`images/pages/settings/${image}.svg`)} />
            </a>
        </div>
        <div className='gr-12'>
            <h4><a href={it.url_for(`user/settings/${url}`)}>{header}</a></h4>
            <p>{text}</p>
        </div>
    </div>
);

const Settings = () => (
    <React.Fragment>
        <div className='invisible' id='settings_container'>
            <h1>{it.L('Profile')}</h1>

            <div className='gr-row'>
                <Column url='detailsws' image='detail' header={it.L('Personal Details')} text={it.L('View your personal information.')} />
                <Column className='real invisible' url='assessmentws' image='financial-assessment' header={it.L('Financial Assessment')} text={it.L('View your financial assessment settings.')} />
                <Column className='real invisible' url='../authenticate' id='authenticate' image='authenticate' header={it.L('Authentication')} text={it.L('View your account\'s authentication status.')} />
                <Column className='invisible' id='professional_client' url='professional' image='professional' header={it.L('Account Categorisation')} />
            </div>
        </div>
    </React.Fragment>
);

export default Settings;
