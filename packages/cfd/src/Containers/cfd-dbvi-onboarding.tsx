import React from 'react';
import { Modal, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import RootStore from 'Stores/index';
import { PoiPoaSubmitted } from '@deriv/account';
import { connect } from 'Stores/connect';
import { WS } from '@deriv/shared';
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
}: TVerificationModalProps) => {
    const [showSubmitted, setShowSubmitted] = React.useState(false);

    React.useEffect(() => {
        WS.authorized.getAccountStatus().then((response) => {
            const { get_account_status } = response;
            const identity_status = get_account_status.authentication.identity.status;
            const document_status = get_account_status.authentication.document.status;
            console.log(identity_status, document_status);
            if ((identity_status !== 'none') && (document_status !== 'none')) {
                setShowSubmitted(true)
            }
        })
    }, []);

    return (
        <React.Suspense fallback={<UILoader />}>
            <Modal
                className='cfd-financial-stp-modal'
                disableApp={disableApp}
                enableApp={enableApp}
                is_open={is_cfd_verification_modal_visible}
                title={localize('Submit your proof of identity and address')}
                toggleModal={toggleCFDVerificationModal}
                height='700px'
                width='996px'
            >
                {showSubmitted ?
                    <PoiPoaSubmitted onClick={toggleCFDVerificationModal} /> :
                    <CFDFinancialStpRealAccountSignup toggleModal={toggleCFDVerificationModal} onFinish={() => { setShowSubmitted(true) }}></CFDFinancialStpRealAccountSignup>
                }
            </Modal>
        </React.Suspense>

    )
}








export default connect(({ modules, ui, client, notifications }: RootStore) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_cfd_verification_modal_visible: modules.cfd.is_cfd_verification_modal_visible,
    toggleCFDVerificationModal: modules.cfd.toggleCFDVerificationModal,

}))(CFDDbViOnBoarding); 