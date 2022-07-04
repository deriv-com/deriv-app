import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import RootStore from 'Stores/index';

import { connect } from 'Stores/connect';
import { ResidenceList, GetSettings, GetAccountStatus } from '@deriv/api-types';
import CFDFinancialStpRealAccountSignup from './cfd-financial-stp-real-account-signup'

type TVerificationModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_cfd_verification_modal_visible: boolean;
    toggleCFDVerificationModal: () => void;
};

const CFDDbViOnBoarding = ({
    disableApp,
    enableApp,
    is_cfd_verification_modal_visible,
    toggleCFDVerificationModal,
}: TVerificationModalProps) =>

    <React.Suspense fallback={<UILoader />}>
        <Modal
            className='cfd-verification-modal'
            disableApp={disableApp}
            enableApp={enableApp}
            is_open={is_cfd_verification_modal_visible}
            title={localize('Submit your proof of identity and address')}
            toggleModal={toggleCFDVerificationModal}
            height='700px'
            width='996px'
        >
            <CFDFinancialStpRealAccountSignup toggleModal={toggleCFDVerificationModal}></CFDFinancialStpRealAccountSignup>
        </Modal>
    </React.Suspense>









export default connect(({ modules, ui, client, notifications }: RootStore) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_cfd_verification_modal_visible: modules.cfd.is_cfd_verification_modal_visible,
    toggleCFDVerificationModal: modules.cfd.toggleCFDVerificationModal,
    // residence_list: client.residence_list,
    // account_settings: client.account_settings,
    // account_status: client.account_status,
    // residence: client.residence,
    // refreshNotifications: notifications.refreshNotifications,

}))(CFDDbViOnBoarding); 