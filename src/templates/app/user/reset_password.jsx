import React from 'react';
import { FormRow, Fieldset, SubmitButton } from '../../_common/components/forms.jsx';

const ResetPassword = () => (
    <React.Fragment>
        <div className='static_full'>
            <h1>{it.L('Password Reset')}</h1>
            <p className='notice-msg invisible' id='msg_reset_password' />

            <div className='invisible' id='form_error'>
                <p id='form_error_msg' />
                <a href={it.url_for('user/lost_passwordws')}>{it.L('Click here to retry')}</a>
            </div>

            <div className='gr-parent gr-padding-10' id='container_reset_password'>
                <form id='frm_reset_password'>
                    <Fieldset legend={it.L('Details')}>
                        <FormRow type='radio' id='have_real_account' options={ [{ value: 'yes', label: it.L('Yes') }, { value: 'no', label: it.L('No') }] } default_option={'no'} label={it.L('Do you have a real money account?')} />
                        <FormRow type='text' id='date_of_birth' label={it.L('Date of Birth')} row_class='invisible' row_id='dob_field' attributes={{ size: 12, readOnly: 'readonly' }} />
                        <FormRow type='password' id='new_password' label={it.L('New Password')} hint={it.L('Minimum of six lower and uppercase letters with numbers')} />
                        <FormRow type='password' id='repeat_password' label={it.L('Confirm New Password')} />
                        <SubmitButton type='submit' no_error text={it.L('Reset password')} />
                    </Fieldset>
                </form>
            </div>
        </div>
    </React.Fragment>
);

export default ResetPassword;
