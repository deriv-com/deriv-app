import React, { Fragment } from 'react';
import { JurisdictionModal } from '@/features/cfd/modals';
import { RealAccountCreation } from '@/flows';

/**
 * @description The place to import and export all modals
 * @returns  {React.ReactElement}
 */
const Modals = () => {
    return (
        <Fragment>
            <JurisdictionModal />
            <RealAccountCreation />
        </Fragment>
    );
};

export default Modals;
