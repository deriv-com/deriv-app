import React from 'react';

const Register = () => (
    <React.Fragment>
        <div className='gr-padding-10 gr-gutter fill-bg-color'>
            <h4><strong>{it.L('Register')}</strong></h4>
        </div>

        <div className='center-text gr-padding-10'>
            <a className='button' href={it.affiliate_signup_url}>
                <span>{it.L('Sign me up')}</span>
            </a>
        </div>
    </React.Fragment>
);

export default Register;
