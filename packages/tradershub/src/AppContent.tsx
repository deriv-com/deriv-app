import React, { Fragment } from 'react';
import { Router } from '@/routes';

const AppContent = () => {
    return (
        <Fragment>
            <div className='z-10' id='v2_modal_show_header_root' />
            <Router />
        </Fragment>
    );
};

export default AppContent;
