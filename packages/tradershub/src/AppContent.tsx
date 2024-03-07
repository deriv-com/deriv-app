import React, { Fragment } from 'react';
import { AppContainer, EUDisclaimerMessage } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { Modals } from '@/modals';
import { Router } from '@/routes';

const AppContent = () => {
    const { isEU } = useRegulationFlags();

    return (
        <Fragment>
            <AppContainer>
                <div className='z-10' id='v2_modal_show_header_root' />
                <Router />
                {isEU && <EUDisclaimerMessage />}
            </AppContainer>
            <Modals />
        </Fragment>
    );
};

export default AppContent;
