import React from 'react';
import { FormRow, SubmitButton, Fieldset } from '../../../_common/components/forms.jsx';

const CashierPassword = () => (
    <React.Fragment>
        <h1>{it.L('Cashier Password')}</h1>
        <p id='form_message' />
        <form className='gr-padding-10 invisible' id='frm_cashier_password'>
            <Fieldset legend=' '>
                <div className='gr-12'>
                    <p id='lockInfo' />
                </div>
                <FormRow type='password' id='cashier_password' label={it.L('Cashier password')} hint={it.L('Minimum of six lower and uppercase letters with numbers')} />
                <FormRow type='password' id='repeat_cashier_password' label={it.L('Re-enter your password')} row_id='repeat_password_row' />
            </Fieldset>

            <SubmitButton is_centered type='submit' msg_id='form_error' />
        </form>
    </React.Fragment>
);

export default CashierPassword;
