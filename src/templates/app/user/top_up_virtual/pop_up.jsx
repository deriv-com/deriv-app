import React from 'react';

const TopUpVirtualPopup = () => (
    <React.Fragment>
        <div id='top_up' className='gr-padding-10 gr-gutter'>
            <h1>{it.L('Top up Virtual Account')}</h1>
            <p id='top_up_message' />
            <p>{it.L('Do you want to top up for another [_1]? If not, you can do this later on the [_2]Cashier page[_3], too.', '$10,000.00', `<a id='top_up_cashier_redirect' href='${it.url_for('cashier')}'>`, '</a>')}</p>
            <form id='frm_confirm'>
                <div className='hint no-margin gr-padding-20 gr-parent'>
                    <input id='chk_hide_top_up' type='checkbox' />
                    &nbsp;
                    <label htmlFor='chk_hide_top_up'>{it.L('Don\'t show again')}</label>
                </div>
                <div className='gr-row'>
                    <div className='gr-6'>
                        <a className='button button-secondary' id='btn_cancel' href='javascript:;'><span>{it.L('Continue trading')}</span></a>
                    </div>
                    <div className='gr-6 gr-no-gutter-left'>
                        <button className='button' type='submit' id='btn_ok'>{it.L('Top up')}</button>
                    </div>
                </div>
            </form>
        </div>
    </React.Fragment>
);

export default TopUpVirtualPopup;
