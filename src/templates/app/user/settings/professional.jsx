import React from 'react';
import ProfessionalClient from '../../_includes/professional_client.jsx';
import Loading from '../../../_common/components/loading.jsx';
import { SubmitButton } from '../../../_common/components/forms.jsx';

const Professional = () => (
    <div className='container'>
        <div className='static_full'>
            <h1>{it.L('Account Categorisation')}</h1>

            <div id='loading'>
                <Loading />
            </div>

            <div className='invisible' id='processing'>
                <p>{it.L('Your application to be treated as a professional client is being processed.')}</p>
            </div>
            <div className='invisible' id='professional'>
                <p>{it.L('You are categorised as a professional client.')}</p>
            </div>
            <div className='invisible' id='rejected'>
                <p>{it.L('Your request to be treated as a professional client is [_1]not approved[_2].', '<strong>', '</strong>')}</p>
                <p>{it.L('Please check your inbox for details.')}</p>
                <p>{`${it.L('Your account remains under the retail client category.')} ${it.L('Please reapply once the required criteria has been fulfilled.')}`}</p>
            </div>

            <form className='form gr-padding-10 invisible' id='frm_professional'>
                <ProfessionalClient />

                <SubmitButton is_centered msg_id='form_message' type='submit' text={it.L('Submit')} />
            </form>
        </div>
    </div>
);

export default Professional;
