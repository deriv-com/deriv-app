import React, { Fragment } from 'react';
import {
    CTraderSuccessModal,
    DxtradePasswordModal,
    JurisdictionModal,
    MT5AccountTypeModal,
    MT5PasswordModal,
    TopUpModal,
    TradeModal,
} from '@/features/cfd/modals';
import { ChangePassword } from '@/features/cfd/screens';
import { RealAccountCreation } from '@/flows';
import { AccountSelector } from './AccountSelector';
import { AddOrManageAccount } from './AddOrManageAccount';
import { DummyComponentModal } from './DummyComponentModal';
import { InvalidInputModal } from './InvalidInputModal';
import { RegulationModal } from './RegulationModal';

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
            <DummyComponentModal />
            <DxtradePasswordModal />
            <InvalidInputModal />
            <JurisdictionModal />
            <RealAccountCreation />
            <TradeModal />
            <TopUpModal />
            <ChangePassword />
            <MT5AccountTypeModal />
            <RegulationModal />
            <CTraderSuccessModal />
            <MT5PasswordModal />
        </Fragment>
    );
};

export default Modals;
