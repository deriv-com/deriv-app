import React             from 'react';
import { SeparatorLine } from '../_common/components/separator_line.jsx';

const Box = ({
    className,
    text,
    icon,
}) => (
    <div className={`gr-6 gr-12-p gr-12-m box-container gr-padding-10 ${className || ''}`}>
        <div className='box bordered'>
            <div>
                <div><img src={it.url_for(`images/pages/keep_safe/${icon}.svg`)} /></div>
                <p className='no-margin'>{text}</p>
            </div>
        </div>
    </div>
);

const KeepSafe = () => (
    <div className='keep-safe-container'>
        <div className='static_full'>
            <div className='container'>
                <h1>{it.L('Keep safe')}</h1>
                <p>{it.L('Explore ways to enhance your account security and manage your trading risk.')}</p>
                <SeparatorLine className='gr-padding-20' show_mobile />
                <div className='center-text'>
                    <h2 className='primary-color'>{it.L('Account security')}</h2>
                    <p>{it.L('Your account security is of paramount importance to us. Please consider the following initiatives and tools to enhance your account security:')}</p>
                </div>
                <div className='gr-row'>
                    <Box icon='desktop_app'      text={it.L('Download the [_1]desktop app[_2] for the most secure way to access the [_3] website.', `<a href="${it.url_for('platforms')}">`, '</a>', it.website_name)} className='desktop-app invisible' />
                    <Box icon='two_factor'       text={it.L('Enable [_1]two-factor authentication[_2] on your account.', `<a href="${it.url_for('user/security/two_factor_authentication')}">`, '</a>')} />
                    <Box icon='cashier_lock'     text={it.L('Set a [_1]cashier lock password[_2] to prevent unauthorised access to your cashier.', `<a href="${it.url_for('user/security/cashier_passwordws')}">`, '</a>')} />
                    <Box icon='cloudfare'        text={it.L('Configure your PC and mobile phone to use the Cloudflare DNS by following the instructions at [_1].', `<a href="${it.url_for('user/security/cloudflare_dns')}">https://1.1.1.1/</a>`)} />
                    <Box icon='login_history'    text={it.L('Monitor recent logins to your account using the [_1]login history[_2] facility.', `<a href="${it.url_for('user/security/iphistoryws')}">`, '</a>')} />
                    <Box icon='account_password' text={it.L('Use different passwords for your email and [_1] account and set a [_2]strong password[_3].', it.website_name, `<a href="${it.url_for('user/security/change_passwordws')}">`, '</a>')} />
                    <Box icon='browser'          text={it.L('Always keep your web browser up-to-date. We recommend using the latest version of [_1]Google Chrome[_2].', '<a href="https://www.google.com/chrome/" target="_blank">', '</a>')} />
                    <Box icon='no_share'         text={it.L('Don\'t share your [_1] account or payment methods with any other person.', it.website_name)} />
                    <Box icon='antivirus'        text={it.L('Install antivirus software (such as Avast Free Antivirus for [_1]Windows[_2] and [_3]Mac[_4]) on your computer.', '<a href="https://www.avast.com/en-gb/free-antivirus-download" target="_blank">', '</a>', '<a href="https://www.avast.com/en-gb/free-mac-security" target="_blank">', '</a>')} />
                </div>
            </div>

            <SeparatorLine className='gr-padding-20' show_mobile invisible />

            <div className='fill-bg-color'>
                <div className='container'>
                    <div className='gr-row gr-padding-20 gr-child'>
                        <div className='gr-6 gr-12-m align-self-center'>
                            <h2 className='primary-color'>{it.L('Practise with virtual funds')}</h2>
                            <p>{it.L('[_1] provides virtual-money facilities to practise your trading strategy with virtual funds. Switch to your virtual-money account using the drop-down box in the top-right corner of the screen.', it.website_name)}</p>
                        </div>
                        <div className='gr-4 gr-push-1 gr-8-m gr-push-0-m gr-centered-m gr-no-gutter gr-padding-10 gr-parent'>
                            <img className='responsive' src={it.url_for('images/pages/keep_safe/virtual_funds.png')} />
                        </div>
                    </div>
                </div>
            </div>

            <SeparatorLine className='gr-padding-20' show_mobile invisible />

            <div className='container'>
                <div className='center-text'>
                    <h2 className='primary-color'>{it.L('Understand the risks')}</h2>
                    <div className='gr-padding-20'>
                        <img src={it.url_for('images/pages/keep_safe/risk.svg')} />
                    </div>
                </div>
                <p>{it.L('Trading binary options and CFDs can involve substantial risks. Do not trade with money you cannot afford to lose, and never trade with borrowed money. Learn about [_1]Responsible Trading[_2].', `<a href="${it.url_for('responsible-trading')}">`, '</a>')}</p>
                <p>{it.L('Trading on [_1] can become addictive. If you feel the need to exclude yourself from the website, please use the [_2]self-exclusion facilities[_3].', it.website_name, `<a href="${it.url_for('user/security/self_exclusionws')}">`, '</a>')}</p>
            </div>

            <SeparatorLine className='gr-padding-30' show_mobile invisible />
        </div>
    </div>
);

export default KeepSafe;
