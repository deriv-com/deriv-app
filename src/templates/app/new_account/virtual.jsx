import React from 'react';
import { FormRow, Fieldset } from '../../_common/components/forms.jsx';
import FormVerificationCode from '../_includes/form_verification_code.jsx';

const Virtual = () => (
    <div className='gr-12 static_full'>
        <h1>{it.L('Create New Virtual-money Account')}</h1>

        <FormVerificationCode />

        <form id='virtual-form' className='gr-padding-10 invisible'>
            <Fieldset legend={it.L('Details')}>
                <FormRow
                    type='password'
                    id='client_password'
                    label={it.L('Choose a password')}
                    hint={it.L('Minimum of six lower and uppercase letters with numbers')}
                />

                <FormRow type='password' id='repeat_password' label={it.L('Re-enter password')} />

                <FormRow type='select' id='residence' className='invisible' label={it.L('Country of residence')} attributes={{ single: 'single' }}  />

                <FormRow
                    type='checkbox'
                    checked
                    id='email_consent'
                    row_class='invisible'
                    label_row_id='email_consent_label'
                    label={it.L('Receive news and special offers')}
                />
            </Fieldset>

            <div className='center-text'>
                <button className='button' type='submit'>{it.L('Create new virtual-money account')}</button>
                <p className='errorfield invisible' id='error-account-opening' />
            </div>
        </form>
    </div>
);

export default Virtual;
