import React from 'react';
import { FormRow } from '../../_common/components/forms.jsx';

const Warning = () => (
    <React.Fragment>
        <div id='warning_content' className='gr-padding-30 gr-gutter'>
            <div className='gr-gutter'>
                <div className='gr-gutter'>
                    <h1>{it.L('Alert')}</h1>
                    <p className='gr-padding-10 gr-child no-margin'>{it.L('You are now using your [_1]Bitcoin Cash[_2] account. Please fund your account in [_1]Bitcoin Cash[_2], and not Bitcoin.', '<a href="https://www.bitcoincash.org" target="_blank" rel="noopener noreferrer">', '</a>')}</p>
                    <form id='frm_warning'>
                        <FormRow type='checkbox' label={it.L('Yes, I understand')} id='chk_accept' />
                        <div className='center-text gr-centered'>
                            <button className='button' id='accept'>{it.L('Proceed')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Warning;
