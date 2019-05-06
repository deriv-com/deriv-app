import React from 'react';
import FormVerifyEmail from '../_common/includes/form_verify_email.jsx';

const style = () =>
    `body {
        background: transparent !important;
        display: flex;
        flex-direction: column;
    }
    .home-content {
        margin-top: auto;
        margin-bottom: auto;
    }`;

const Head = () => (
    <head>
        {it.css_files.map((css_file, inx) => <link key={inx} rel='stylesheet' href={css_file} />)}
        <style type='text/css'>
            {style()}
        </style>
        <script src={it.url_for(`js/landing_pages/common.js?${it.static_hash}`)} />
        <script src={it.url_for(`js/landing_pages/signup_frame.js?${it.static_hash}`)} />
    </head>
);

const FormVerifyEmailChildren = () => (
    <div className='invisible' id='success'>
        <div className='gr-padding-10 center-text hint gr-12 align-self-center'>
            {it.L('Thank you for signing up! Please check your email to complete the registration process.')}
        </div>
    </div>
);

const SignUpFrame = () => (
    <html>
        <Head />
        <body>
            <div className='home-content'>
                <FormVerifyEmail text='Create free account' className='secondary-bg-color' dark_button='1'>
                    <FormVerifyEmailChildren />
                </FormVerifyEmail>
            </div>
        </body>
    </html>
);

export default SignUpFrame;
