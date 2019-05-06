import React from 'react';

const Dialog = () => (
    <React.Fragment>
        <div id='dialog_content' className='gr-padding-20 gr-gutter'>
            <div className='gr-gutter'>
                <div className='gr-gutter'>
                    <h1 id='dialog_title' className='invisible' />
                    <p id='dialog_message' className='gr-padding-10 no-margin' />
                    <div className='gr-row gr-row-align-right gr-padding-10'>
                        <form id='frm_confirm'>
                            <a className='button button-secondary' id='btn_cancel' href='javascript:;'><span>{it.L('Cancel')}</span></a>
                            <a className='button' id='btn_ok' href='javascript:;'><span>{it.L('OK')}</span></a>
                        </form>
                    </div>
                    <p id='dialog_footnote' className='invisible hint' />
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Dialog;
