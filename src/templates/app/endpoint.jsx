import React from 'react';
import { Fieldset, FormRow } from '../_common/components/forms.jsx';

const Endpoint = () => (
    <div className='endpoint-config static_full'>
        <h1>{it.L('Change API Endpoint')}</h1>
        <div className='gr-padding-10'>
            <form id='frm_endpoint'>
                <Fieldset legend={it.L('Details')}>
                    <FormRow
                        id='server_url'
                        type='text'
                        label={it.L('Server')}
                        attributes={{ maxLength: 30 }}
                        hint={it.L('e.g. frontend.binaryws.com')}
                    />
                    <FormRow
                        id='app_id'
                        type='text'
                        label={it.L('OAuth App ID')}
                        attributes={{ maxLength: 5 }}
                        hint={it.L('You have to register and get App ID before you can use different OAuth server for authentication. For more information refer to OAuth details on https://developers.binary.com/.')}
                    />
                </Fieldset>
                <div className='center-text'>
                    <button className='button' id='new_endpoint' type='submit'>{it.L('Submit')}</button>
                    <a className='button' id='reset_endpoint'>
                        <span className='button'>{it.L('Reset to original settings')}</span>
                    </a>
                </div>
            </form>
        </div>
    </div>
);

export default Endpoint;
