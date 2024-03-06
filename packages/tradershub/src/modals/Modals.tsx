import React, { Fragment } from 'react';
import { JurisdictionModal } from '@/features/cfd/modals';
import { RealAccountCreation } from '@/flows';
import { AccountSelector } from './AccountSelector';
import { AddOrManageAccount } from './AddOrManageAccount';

/**
 * @description The place to import and export all modals
 * @returns  {React.ReactElement}
 */
const Modals = () => {
    return (
        <Fragment>
            <AccountSelector />
            <JurisdictionModal />
            <RealAccountCreation />
            <AddOrManageAccount />
        </Fragment>
    );
};

export default Modals;
