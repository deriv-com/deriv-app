import React, { Fragment } from 'react';
import { AppContainer, EUDisclaimerMessage } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { Router } from '@/routes';
import { Provider } from '@deriv/library';
import FirstSignup from './flows/FirstSignup';
import SignupWizard from './flows/RealAccountSIgnup/SignupWizard';

const AppContent = () => {
    const { isEU } = useRegulationFlags();
    const { show } = Provider.useModal();

    return (
        <Fragment>
            <AppContainer>
                <div className='z-10' id='v2_modal_show_header_root' />
                <Router />
                {isEU && <EUDisclaimerMessage />}
                {/* <button onClick={() => show(<FirstSignup />, { defaultRootId: 'v2_modal_root' })}>TEST</button> */}
                <FirstSignup />
            </AppContainer>
            <SignupWizard />
        </Fragment>
    );
};

export default AppContent;
