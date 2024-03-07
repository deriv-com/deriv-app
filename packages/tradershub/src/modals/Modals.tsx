import React, { Fragment } from 'react';
import { DxtradePasswordModal, JurisdictionModal } from '@/features/cfd/modals';
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
            {/* PLS DO NOT ADD ANY PROPS TO ANY MODALS HERE.💥 */}
            <AccountSelector />
            <AddOrManageAccount />
            <DxtradePasswordModal />
            <JurisdictionModal />
            <RealAccountCreation />
        </Fragment>
    );
};

export default Modals;
