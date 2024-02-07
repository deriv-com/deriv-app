import React from 'react';
import { EUDisclaimerMessage, useUIContext } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { Router } from '@/routes';
import SignupWizard from './flows/RealAccountSIgnup/SignupWizard';

const AppContent = () => {
    const { uiState } = useUIContext();
    const activeRegulation = uiState.regulation;
    const { isEU } = useRegulationFlags(activeRegulation);

    return (
        <div className='h-full-mobile lg:h-full-desktop'>
            <div className='font-sans max-w-[1232px] mx-auto lg:py-2500 lg:px-50'>
                <div className='z-10' id='v2_modal_show_header_root' />
                <Router />
            </div>
            {isEU && <EUDisclaimerMessage />}
            <SignupWizard />
        </div>
    );
};

export default AppContent;
