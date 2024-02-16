import React, { Fragment } from 'react';
import { AppContainer, EUDisclaimerMessage } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { Router } from '@/routes';
import SignupWizard from './flows/RealAccountSIgnup/SignupWizard';

const AppContent = () => {
    const { isEU } = useRegulationFlags();

    return (
        <Fragment>
            <AppContainer>
                <div className='z-10' id='v2_modal_show_header_root' />
                <Router />
                {isEU && <EUDisclaimerMessage />}
            </AppContainer>
            <SignupWizard />
        </Fragment>
    );
};

export default AppContent;
