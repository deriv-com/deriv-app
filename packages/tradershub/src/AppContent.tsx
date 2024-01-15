import React from 'react';
import { Router } from './routes';

const AppContent = () => (
    <div className='font-sans max-w-[1232px] mx-auto lg:pt-2500 lg:px-50'>
        <div className='z-10' id='v2_modal_show_header_root' />
        <Router />
    </div>
);

export default AppContent;
