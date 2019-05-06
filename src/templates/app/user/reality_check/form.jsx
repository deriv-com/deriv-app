import React from 'react';

const Form = () => (
    <React.Fragment>
        <form id='frm_reality_check'>
            <div className='gr-padding-10'>
                <label htmlFor='num_reality_duration' className='gr-gutter-right'>{it.L('Please specify your preferred reality-check interval in minutes')}</label>
                &nbsp;
                <input id='num_reality_duration' step='1' min='1' size='6' type='number' />
            </div>
            <div className='center-text gr-centered gr-padding-20 gr-child' id='reality_check_nav'>
                <button className='button' type='submit'>{it.L('Continue trading')}</button>
                <a className='button button-secondary' id='statement' href='javascript:;'><span>{it.L('View statement')}</span></a>
                <a className='button button-secondary' id='logout' href='javascript:;'><span>{it.L('Log out')}</span></a>
            </div>
        </form>
    </React.Fragment>
);

export default Form;
