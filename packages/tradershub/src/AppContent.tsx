import React, { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContainer, EUDisclaimerMessage } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { Modals } from '@/modals';
import { Router } from '@/routes';

const AppContent = () => {
    const { isEU } = useRegulationFlags();
    const location = useLocation();
    const compareAccountsRoute = location.pathname === '/traders-hub/compare-accounts';

    return (
        <Fragment>
            <div className='z-10' id='v2_modal_show_header_root' />
            <AppContainer className={compareAccountsRoute ? 'max-w-[800px] lg:pt-0 lg:pb-20' : ''}>
                <Router />
            </AppContainer>
            {isEU && <EUDisclaimerMessage />}
            <Modals />
        </Fragment>
    );
};

export default AppContent;
