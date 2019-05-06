import React from 'react';
import { FormRow, SubmitButton, Fieldset } from '../../_common/components/forms.jsx';

const FormVerificationCode = () => (
    <div id='verification_code_wrapper' className='invisible'>
        <p>{it.L('Please check your email for the verification code to complete the process.')}</p>
        <form id='frm_verify'>
            <Fieldset legend={it.L('Verification')}>
                <FormRow type='text' label={it.L('Verification code')} id='txt_verification_code' attributes={{ autoComplete: 'off' }} />
            </Fieldset>

            <SubmitButton id='btn_submit' msg_id='formMessage' type='submit' text={it.L('Submit')} />
        </form>
    </div>
);

export default FormVerificationCode;
