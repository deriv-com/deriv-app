import React from 'react';
import Form from './form.jsx';

const Wrapper = ({ children }) => (
    <React.Fragment>
        <div id='reality_check_content' className='gr-padding-10 gr-gutter'>
            <h1>{it.L('Reality Check')}</h1>
            {children}
            <Form />
        </div>
    </React.Fragment>
);

export default Wrapper;
