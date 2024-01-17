import React from 'react';
import { useIsEuRegion } from '@deriv/api';
import { EUDisclaimerMessage } from './components';
import { Router } from './routes';

const AppContent = () => {
    const { isEU } = useIsEuRegion();

    return (
        <div className='h-full-mobile lg:h-full-desktop'>
            <div className='font-sans max-w-[1232px] mx-auto lg:pt-2500 lg:px-50'>
                <div className='z-10' id='v2_modal_show_header_root' />
                <Router />
            </div>
            {isEU && <EUDisclaimerMessage />}
        </div>
    );
};

export default AppContent;
