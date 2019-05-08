import React from 'react';
import Loading from '../../../_common/components/loading.jsx';

const AuthorisedApps = () => (
    <React.Fragment>
        <div id='applications-container'>
            <div className='page-title' id='applications-title'>
                <h1>{it.L('Applications')}</h1>
                <p id='description'>{it.L('Keep track of your authorised applications.')}</p>
                <p className='error-msg' id='applications_error' />
            </div>
            <div id='applications_loading'><Loading /></div>
        </div>
    </React.Fragment>
);

export default AuthorisedApps;
