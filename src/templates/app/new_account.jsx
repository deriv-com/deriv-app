import React                     from 'react';
import { SocialButton }          from '../_common/components/elements.jsx';
import { SeparatorLineWithText } from '../_common/components/separator_line.jsx';
import MFSA                      from '../_common/includes/mfsa.jsx';

const NewAccount = () => (
    <React.Fragment>
        <MFSA />
        <div id='signup_form'className='center-text gr-padding-20'>
            <h1 className='dark gr-padding-20 gr-child'>{it.L('Start Trading with [_1]', `<strong>${it.website_name}</strong>`)}</h1>
            <div>
                <div className='gr-4 gr-5-t gr-8-p gr-10-m gr-no-gutter gr-centered'>
                    <form>
                        <div className='gr-padding-10'>
                            <input autoComplete='off' autoFocus={true} name='email' id='email' maxLength='50' placeholder={it.L('Email')}  data-lpignore='true' />
                        </div>
                        <div>
                            <button type='submit' className='no-margin'>{it.L('Create free account')}</button>
                        </div>
                    </form>
                    <SeparatorLineWithText text={it.L('or')} className='gr-padding-20 no-margin full-width' />
                </div>
                <p className='no-margin gr-padding-10 gr-parent'>{it.L('Create free account with')}</p>
                <div className='gr-row gr-row-align-center'>
                    <SocialButton provider='google' />
                    <SocialButton provider='facebook' />
                </div>
            </div>
            <p>{it.L('Already have an account? [_1]Log in[_2] here', '<a id="login" href="javascript:;">', '</a>')}</p>
        </div>

        <div id='verify_email' className='center-text invisible gr-padding-20'>
            <img className='gr-padding-20' src={it.url_for('images/common/email_sent.svg')} />
            <h1>{it.L('We\'re almost there')}</h1>
            <p>{it.L('Please check your email for the verification link to complete the process.')}</p>
        </div>
    </React.Fragment>
);

export default NewAccount;
