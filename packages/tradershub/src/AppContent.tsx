import React from 'react';
import { Router } from './routes';

const AppContent = () => (
    <div className='font-sans max-w-[1232px] mx-auto pt-400 lg:pt-2500 lg:px-50 relative'>
        <div className='absolute bottom-2500 z-10' id='v2_modal_show_header_root' />
        <Router />
    </div>
);

export default AppContent;
