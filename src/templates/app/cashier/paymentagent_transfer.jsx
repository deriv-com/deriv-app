import React       from 'react';
import {
    Fieldset,
    FormRow,
    SubmitButton } from '../../_common/components/forms.jsx';
import Loading     from '../../_common/components/loading.jsx';

const StrongLabel = ({ id }) => (
    <strong><label id={id} /></strong>
);

const PaymentagentTransfer = () => (
    <React.Fragment>
        <h1>{it.L('Payment Agent transfer')}</h1>

        <div id='pa_transfer_loading' className='center-text'>
            <Loading />
        </div>

        <form id='frm_confirm_transfer' className='invisible'>
            <p>{it.L('Please confirm the transaction details in order to complete the transfer:')}</p>

            <Fieldset legend={it.L('Details')}>
                <FormRow label={it.L('Transfer to')} id='user_name' type='custom'>
                    <StrongLabel id='user_name' />
                </FormRow>
                <FormRow label={it.L('Login ID')} id='loginid' type='custom'>
                    <StrongLabel id='loginid' />
                </FormRow>
                <FormRow label={it.L('Amount')} id='confirm_amount' type='custom'>
                    <StrongLabel id='confirm_amount' />
                </FormRow>
            </Fieldset>

            <SubmitButton custom_btn_href='javascript:;' custom_btn_id='back_transfer' custom_btn_text={it.L('Back')} type='submit' text={it.L('Confirm')} />
        </form>

        <div id='pa_transfer_done' className='invisible'>
            <p id='confirm_msg' className='invisible' />
            <p>
                <a className='button' href={it.url_for('user/statementws')}>
                    <span className='button'>{it.L('View your statement')}</span>
                </a>
            </p>
        </div>

        <div id='no_balance_error' className='invisible'>
            <p className='center-text notice-msg'>{it.L('Please [_1]deposit[_2] before transferring to client.', `<a href="${it.url_for('cashier/forwardws?action=deposit')}">`, '</a>')}</p>
        </div>

        <div id='not_pa_error' className='invisible'>
            <p className='center-text notice-msg'>{it.L('This feature is only relevant to payment agent accounts.')}</p>
        </div>

        <form id='frm_paymentagent_transfer' className='invisible'>
            <p>{it.L('Please fill in the Login ID and Amount you wish to transfer to your Client in the form below:')}</p>

            <Fieldset legend={it.L('Details')}>
                <FormRow label={it.L('Transfer to Login ID')} id='client_id' type='text' />
                <FormRow label={it.L('Amount')} id='amount' type='text' />
                <FormRow
                    label={it.L('Description')}
                    id='description'
                    type='textarea'
                    className='paymentagent_description'
                    attributes={{ rows: 4, cols: 19, maxLength: 250 }}
                />
            </Fieldset>

            <SubmitButton msg_id='form_error' type='submit' text={it.L('Submit')} />
        </form>

        <div id='paymentagent_transfer_notes' className='invisible'>
            <div>{it.L('Notes:')}</div>
            <ul>
                <li>{it.L('Our site does not charge any transfer fees.')}</li>
                <li>{it.L('Once you click the \'Submit\' button, the funds will be withdrawn from your account and transferred to your Client\'s account.')}</li>
                <li>{it.L('Your Client will receive an email notification informing him/her that the transfer has been processed.')}</li>
            </ul>
        </div>
    </React.Fragment>
);

export default PaymentagentTransfer;
