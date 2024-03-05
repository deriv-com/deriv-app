import React, { Fragment } from 'react';
import { EUDisclaimerMessage } from '@/components';
import { RealAccountCreation } from '@/flows';
import { useRegulationFlags } from '@/hooks';
import { Router } from '@/routes';

const AppContent = () => {
    const { isEU } = useRegulationFlags();

    return (
        <Fragment>
            <div className='z-10' id='v2_modal_show_header_root' />
            <Router />
            {isEU && <EUDisclaimerMessage />}
            <RealAccountCreation />
        </Fragment>
    );
};

export default AppContent;
