import React                from 'react';
import FormVerificationCode from '../_includes/form_verification_code.jsx';
import {
    FormRow,
    Fieldset,
    SubmitButton }          from '../../_common/components/forms.jsx';
import { SeparatorLine }    from '../../_common/components/separator_line.jsx';

const PaymentAgentWithdraw = () => (
    <React.Fragment>
        <h1>{it.L('Payment Agent Withdrawal')}</h1>

        <div id='paymentagent_withdrawal'>
            <div id='viewError' className='viewItem invisible'>
                <p id='custom-error' className='notice-msg center-text invisible' />
                <p id='withdrawal-locked-error' className='notice-msg center-text invisible'>
                    {it.L('Withdrawal for your account is not allowed at this moment.')}
                </p>
            </div>

            <div id='viewNotice' className='viewItem invisible'>
                {it.L('Please check your email for the verification link to complete the process.')}
            </div>

            <div id='viewSuccess' className='viewItem invisible'>
                <p id='successMessage' />
                <p>
                    <a className='button' href={it.url_for('user/statementws')}>
                        <span className='button'>{it.L('View your statement')}</span>
                    </a>
                </p>
            </div>

            <FormVerificationCode />

            <form id='viewConfirm' className='viewItem invisible'>
                <p>{it.L('Please confirm the transaction details in order to complete the transfer:')} </p>

                <p>{it.L('Transfer to')}: <span id='lblAgentName' /><br />{it.L('Amount')}: <span id='lblCurrency' /> <span id='lblAmount' /></p>

                <SubmitButton
                    custom_btn_id='btnBack'
                    custom_btn_href='javascript:;'
                    custom_btn_text={it.L('Back')}
                    type='submit'
                    text={it.L('Confirm')}
                    is_left_align
                />
            </form>

            <div id='viewForm' className='viewItem invisible'>
                <p>{it.L('Please provide us with the following information:')}</p>

                <form className='form gr-padding-10' id='frmWithdrawal'>
                    <Fieldset>
                        <FormRow label={it.L('Transfer funds to a payment agent')} type='custom' row_class='wrapper-row-agent'>
                            <div className='row-agent'>
                                <div>
                                    <select id='ddlAgents' className='form_input' />
                                </div>
                                <div>{it.L('or')}</div>
                                <div>
                                    <input id='txtAgents' type='text' className='form_input' maxLength='12' placeholder={it.L('Enter payment agent ID')} data-lpignore='true' />
                                    <div className='hint'>
                                        {it.L('If the payment agent is not listed, type in the payment agent ID. For example: CR000000.')}
                                    </div>
                                </div>
                                <p className='error-msg no-margin invisible'>This field is required.</p>
                            </div>
                        </FormRow>
                        <div className='gr-9 gr-centered'>
                            <SeparatorLine className='gr-padding-10' show_mobile />
                        </div>
                        <FormRow label={it.L('Amount')} id='txtAmount' type='text' />
                        <FormRow
                            label={it.L('Further instructions')}
                            id='txtDescription'
                            type='textarea'
                            attributes={{ rows: 4, cols: 19, maxLength: 250 }}
                        />
                        <SubmitButton msg_id='withdrawFormMessage' type='submit' text={it.L('Submit')} />
                    </Fieldset>
                </form>

                <div id='paymentagent_withdrawal_notes'>
                    <div>{it.L('Notes:')}</div>
                    <ul>
                        <li>{it.L('[_1] does not charge any transfer fees.', it.website_name)}</li>
                        <li>{it.L('In the \'Further Instructions\' field please specify the payment method and account number to which the Agent will send the funds to.')} {it.L('Please make sure that you first agree with the Agent on the terms of payment before submitting your request.')}</li>
                        <li>{it.L('Once you click the \'Submit\' button the funds will be withdrawn from your account and will be sent to the Payment Agent you have chosen.')}</li>
                        <li>{it.L('The Agent will send you the withdrawal amount (minus the commission) via your preferred payment method.')}</li>
                    </ul>
                </div>

                <p className='comment'><strong>{it.L('IMPORTANT DISCLAIMER')}</strong> - {it.L('[_1] is not affiliated with any of the Payment Agents listed above. Each Payment Agent operates as an independent service provider and is not endorsed, guaranteed or otherwise approved by [_1]. CUSTOMERS DEAL WITH PAYMENT AGENTS AT THEIR SOLE RISK AND PERIL. Customers are advised to check the credentials of Payment Agents before sending them any money. [_1] shall not in any circumstance be held responsible for transactions made between customers and Payment Agents.', it.website_name)}</p>
            </div>
        </div>
    </React.Fragment>
);

export default PaymentAgentWithdraw;
