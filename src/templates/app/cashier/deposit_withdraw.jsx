import React from 'react';
import Loading from '../../_common/components/loading.jsx';
import FormVerificationCode from '../_includes/form_verification_code.jsx';

const gambling_link = '<a href=\'%\' target=\'_blank\' rel=\'noopener noreferrer\'>%</a>'.replace(/%/g, 'http://www.gamblingcommission.gov.uk/for-the-public/Your-rights/Protection-of-customer-funds.aspx');

const DepositWithdraw = () => (
    <div id='deposit_withdraw'>
        <h1 id='heading' />

        <div id='loading_cashier'>
            <Loading />
        </div>

        <div id='messages' className='invisible'>
            <p id='cashier_locked_message'>{it.L('Your cashier is locked as per your request - to unlock it, please click [_1]here[_2].', `<a href="${it.url_for('user/security/cashier_passwordws')}">`, '</a>')}</p>
            <p id='check_email_message'>{it.L('Please check your email for the verification link to complete the process.')}</p>
            <p id='personal_details_message'>
                {it.L('There was a problem validating your personal details. Please update your [_1] [_2]here[_3].', '[_1]', `<a href="${it.url_for('user/settings/detailsws')}">`, '</a>')}
                <br /> {it.L('If you need assistance feel free to contact our [_1]Customer Support[_2].', `<a href="${it.url_for('contact')}">`, '</a>')}
            </p>
            <p id='not_authenticated_message'>{it.L('Please [_1]authenticate[_2] your account.',  `<a href="${it.url_for('user/authenticate')}">`, '</a>')}</p>
        </div>

        <div id='errors' className='invisible'>
            <p className='center-text notice-msg'>
                <span id='financial_risk_error'>{it.L('Financial Risk approval is required. Please contact [_1]customer support[_2] for more information.', `<a href="${it.url_for('contact')}">`, '</a>')}</span>
                <span id='age_error'>{it.L('Account needs age verification, please contact [_1]customer support[_2] for more information.', `<a href="${it.url_for('contact')}">`, '</a>')}</span>
                <span id='tnc_error'>{it.L('Please [_1]accept the updated Terms and Conditions[_2].', `<a href="${it.url_for('user/tnc_approvalws')}">`, '</a>')}</span>
                <span id='limits_error'>{it.L('Please set your [_1]30-day turnover limit[_2] to access the cashier.', `<a href="${it.url_for('user/security/self_exclusionws')}">`, '</a>')}</span>
                <span id='token_error'>{it.L('Verification code is wrong. Please use the link sent to your email.')}</span>
                <span id='custom_error'>{it.L('Sorry, an error occurred while processing your request.')}</span>
            </p>
        </div>

        <div className='invisible'>
            <div className='gr-padding-10 gr-parent invisible' id='message_bitcoin_cash'>
                <div className='notice-msg center-text'>
                    <div className='gr-padding-10'>{it.L('Please note that you are currently using your [_1]Bitcoin Cash[_2] account. You can only fund your account in [_1]Bitcoin Cash[_2], and not Bitcoin.', '<a href="https://www.bitcoincash.org" target="_blank" rel="noopener noreferrer">', '</a>')}</div>
                </div>
            </div>
            <iframe id='cashier_iframe' src='' frameBorder='0' width='100%' scrolling='auto' />
        </div>

        <FormVerificationCode />

        <form id='frm_ukgc' className='gr-row gr-parent invisible'>
            <div className='gr-2 gr-6-m gr-centered-m'>
                <p><img className='responsive' src={it.url_for('images/pages/cashier/protection-icon.svg')} /></p>
            </div>

            <div className='gr-10 gr-12-m'>
                <p>{it.L('We are required by our license to inform you about what happens to funds which we hold on account for you, and the extent to which funds are protected in the event of insolvency [_1].', gambling_link)}</p>
                <p>{it.L('The company holds customer funds in separate bank accounts to the operational accounts which would not, in the event of insolvency, form part of the Company\'s assets. This meets the Gambling Commission\'s requirements for the segregation of customer funds at the level: <strong>medium protection</strong>.')}</p>
                <div className='gr-3 gr-6-m gr-centered'>
                    <button className='button' type='submit'>{it.L('Proceed')}</button>
                </div>
            </div>
        </form>
    </div>
);

export default DepositWithdraw;
