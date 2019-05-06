import React from 'react';

const Column = ({
    className,
    header,
    id,
    image,
    text,
    url,
}) => (
    <div className={`gr-3 gr-6-m gr-no-gutter gr-parent ${className}`} id={id}>
        <div className='gr-8 gr-padding-10'>
            <a href={it.url_for(`user/security/${url}`)}>
                <img className='responsive' src={it.url_for(`images/pages/settings/${image}.svg`)} />
            </a>
        </div>
        <div className='gr-12'>
            <h4><a href={it.url_for(`user/security/${url}`)}>{header}</a></h4>
            <p>{text}</p>
        </div>
    </div>
);

const Security = () => (
    <React.Fragment>
        <div className='invisible' id='settings_container'>
            <h1>{it.L('Security')}</h1>
            <div className='gr-12 gr-padding-10 fill-bg-color primary-color round-box'>
                <div className='gr-row'>
                    <div className='align-self-center'>
                        <div className='notice-circle'>i</div>
                    </div>
                    <div className='gr-11 gr-9-m gr-no-gutter'>
                        <p className='no-margin'>
                            {it.L('Explore ways to enhance your account security and manage your trading risk.')}&nbsp;<a href={it.url_for('keep-safe')}>{it.L('Learn more')}</a>
                        </p>
                    </div>
                </div>
            </div>

            <div className='gr-row gr-padding-30'>
                <Column className='invisible' id='change_password' url='change_passwordws' image='account_password' header={it.L('Account Password')} text={it.L('Change your main login password.')} />

                <Column className='real invisible' url='cashier_passwordws' image='cashier_password' header={it.L('Cashier Password')} text={it.L('Change the password used for deposits and withdrawals.')} />

                <Column className='real invisible' url='self_exclusionws' image='self-exclusion' header={it.L('Self Exclusion')} text={it.L('Facility that allows you to set limits on your account.')} />

                <Column className='real invisible' url='limitsws' image='limits' header={it.L('Limits')} text={it.L('View your trading and withdrawal limits.')} />

                <Column url='iphistoryws' image='iphistory' header={it.L('Login History')} text={it.L('View your login history.')} />

                <Column url='api_tokenws' image='api-token' header={it.L('API Token')} text={it.L('API token for third party applications.')} />

                <Column url='authorised_appsws' image='applications' header={it.L('Authorised Applications')} text={it.L('Manage your authorised applications.')} />

                <Column url='two_factor_authentication' image='2fa' header={it.L('Two-Factor Authentication')} text={it.L('Enable two-factor authentication for an extra layer of security.')} />

                <Column url='vpn_app' image='vpn' header={it.L('VPN App')} text={it.L('Establish a secure Internet connection and protect your privacy.')} />
            </div>
        </div>
    </React.Fragment>
);

export default Security;
