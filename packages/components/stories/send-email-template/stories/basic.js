import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import SendEmailTemplate from 'Components/send-email-template';
import Wrapper from '../../shared/wrapper';

const Basic = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <SendEmailTemplate
            onClickSendEmail={action('onClickSendEmail')}
            title={`We've sent you an email`}
            subtitle='Please click on the link in the email to reset your password.'
            lbl_no_receive={`Didn't receive the email?`}
            txt_resend='Resend email'
            txt_resend_in='Resend email in'
        >
            <div className='send-email-storybook-error'>
                We can’t deliver the email to this address (Usually because of firewalls or filtering).
            </div>
        </SendEmailTemplate>
    </Wrapper>
);

export default Basic;
