import React from 'react';
import { FormRow, Fieldset, SubmitButton } from '../../../_common/components/forms.jsx';

const ChangePassword = () => (
    <React.Fragment>
        <h1>{it.L('Change Password')}</h1>
        <form className='gr-padding-10' id='frm_change_password'>
            <Fieldset>
                <FormRow type='password' id='old_password' label={it.L('Current password')} />
                <FormRow type='password' id='new_password' label={it.L('New password')} hint={it.L('Minimum of six lower and uppercase letters with numbers')} />
                <FormRow type='password' id='repeat_password' label={it.L('Verify new password')} />
                <SubmitButton type='submit' msg_id='form_error' text={it.L('Change password')} />
            </Fieldset>
        </form>

        <p className='invisible' id='msg_success'>{it.L('Your password has been changed. Please log in again.')}</p>
    </React.Fragment>
);

export default ChangePassword;
