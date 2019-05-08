import React from 'react';
import { FormRow } from '../../_common/components/forms.jsx';

const Confirmation = () => (
    <div id='confirm_content' className='gr-padding-30 gr-gutter'>
        <div className='gr-gutter'>
            <div className='gr-gutter'>
                <h1>{it.L('Alert')}</h1>
                <p className='gr-padding-10 gr-child no-margin'>{it.L('Do not send Bitcoin to a Bitcoin Cash account (or Bitcoin Cash to a Bitcoin account). Doing so may lead to the loss of your funds.')}</p>
                <form id='frm_confirm'>
                    <FormRow type='checkbox' label={it.L('Yes, I understand')} id='chk_confirm' />
                    <div className='center-text gr-centered'>
                        <button className='button' type='submit'>{it.L('Proceed')}</button>
                        <a className='button button-secondary' id='cancel' href='javascript:;'><span>{it.L('Cancel')}</span></a>
                    </div>
                </form>
            </div>
        </div>
    </div>
);

export default Confirmation;
