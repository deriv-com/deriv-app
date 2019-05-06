import React from 'react';
import Loading from '../../../_common/components/loading.jsx';
import { FormRow, SubmitButton, Fieldset } from '../../../_common/components/forms.jsx';

const ApiToken = () => (
    <React.Fragment>
        <div id='api_token' className='api_token'>
            <h1>{it.L('API Token')}</h1>

            <p>{it.L('In order to access our mobile apps and other third-party applications, you\'ll first need to generate an API Token.')}</p>
            <ul className='bullet'>
                <li>{it.L('Simply click on "Create" to generate your token; then copy and paste it into the app.')}</li>
                <li>{it.L('Choose the specific type of API token that you need, based on the capabilities that you wish to make available.')}</li>
            </ul>

            <div id='token_form' className='gr-12 gr-padding-10'>
                <form>
                    <Fieldset legend={it.L('Create new token')}>
                        <FormRow type='text' id='txt_name' label={it.L('Token name')} attributes={{ maxLength: 32 }} />

                        <FormRow row_class='scope-list' sub_row_class='scope-types' type='custom' label={it.L('Choose scopes:')}>
                            <input id='chk_scopes_read' type='checkbox' value='read' checked='checked' readOnly='readonly' />
                            <label htmlFor='chk_scopes_read'><span data-balloon={it.L('Can be used to view account activity, including settings, limits, balance sheets, trade purchase history, and more.')} data-balloon-length='xlarge'>{it.L('Read')}</span></label>

                            <input id='chk_scopes_trade' type='checkbox' value='trade' />
                            <label htmlFor='chk_scopes_trade'><span data-balloon={it.L('Can be used to buy and sell contracts, renew expired purchases, and top-up virtual-money accounts.')} data-balloon-length='xlarge'>{it.L('Trade')}</span></label>

                            <input id='chk_scopes_payments' type='checkbox' value='payments' />
                            <label htmlFor='chk_scopes_payments'><span data-balloon={it.L('Can be used to withdraw to payment agents, transfer funds between accounts, and set / clear cashier passwords.')} data-balloon-length='xlarge'>{it.L('Payments')}</span></label>

                            <input id='chk_scopes_admin' type='checkbox' value='admin' />
                            <label htmlFor='chk_scopes_admin'><span data-balloon={it.L('Can be used to open accounts, set settings, manage token usage, and more.')} data-balloon-length='xlarge'>{it.L('Admin')}</span></label>
                        </FormRow>

                        <SubmitButton text={it.L('Create')} type='submit' />
                    </Fieldset>
                </form>
            </div>

            <div id='token_message' className='gr-12 gr-padding-10 center-text invisible'>
                <p />
            </div>

            <div id='tokens_list' className='gr-12 gr-parent gr-padding-10'><Loading /></div>
        </div>
    </React.Fragment>
);

export default ApiToken;
