import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import RootStore from 'Stores/index';
import { PoiPoaSubmitted } from '@deriv/account';
import { connect } from 'Stores/connect';
import { WS } from '@deriv/shared';
import { AccountStatusResponse, DetailsOfEachMT5Loginid } from '@deriv/api-types';
import CFDFinancialStpRealAccountSignup from './cfd-financial-stp-real-account-signup';

type TExtendedDetailsOfEachMT5Loginid = Omit<DetailsOfEachMT5Loginid, 'market_type'> & {
    market_type?: 'financial' | 'gaming';
};
type TVerificationModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_cfd_verification_modal_visible: boolean;
    toggleCFDVerificationModal: () => void;
    account_type: {
        type: string;
        category: string;
    };
    mt5_login_list: TExtendedDetailsOfEachMT5Loginid[];
    toggleJurisdictionModal: () => void;
};

const CFDDbViOnBoarding = ({
    disableApp,
    enableApp,
    is_cfd_verification_modal_visible,
    toggleCFDVerificationModal,
    account_type,
    mt5_login_list,
    toggleJurisdictionModal,
}: TVerificationModalProps) => {
    const [showSubmittedModal, setShowSubmittedModal] = React.useState(false);
    const handleOpenJurisditionModal = () => {
        toggleCFDVerificationModal();
        toggleJurisdictionModal();
    };
    const getAccountStatusFromAPI = () => {
        WS.authorized.getAccountStatus().then((response: AccountStatusResponse) => {
            const { get_account_status } = response;
            if (get_account_status?.authentication) {
                const identity_status = get_account_status?.authentication?.identity?.status;
                const document_status = get_account_status?.authentication?.document?.status;
                if (
                    (identity_status === 'pending' || identity_status === 'verified') &&
                    (document_status === 'pending' || document_status === 'verified')
                ) {
                    setShowSubmittedModal(true);
                } else {
                    setShowSubmittedModal(false);
                }
            }
        });
    };
    React.useEffect(() => {
        if (is_cfd_verification_modal_visible) {
            getAccountStatusFromAPI();
        }
    }, [is_cfd_verification_modal_visible]);

    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    className='cfd-financial-stp-modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={is_cfd_verification_modal_visible}
                    title={localize('Submit your proof of identity and address')}
                    toggleModal={toggleCFDVerificationModal}
                    height='700px'
                    width='996px'
                    onMount={() => getAccountStatusFromAPI()}
                    exit_classname='cfd-modal--custom-exit'
                >
                    {showSubmittedModal ? (
                        <PoiPoaSubmitted
                            onClickOK={toggleCFDVerificationModal}
                            account_type={account_type}
                            mt5_login_list={mt5_login_list}
                            onClickYes={handleOpenJurisditionModal}
                        />
                    ) : (
                        <CFDFinancialStpRealAccountSignup
                            onFinish={() => {
                                setShowSubmittedModal(true);
                            }}
                        />
                    )}
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={localize('Submit your proof of identity and address')}
                    wrapper_classname='cfd-financial-stp-modal'
                    visible={is_cfd_verification_modal_visible}
                    onClose={toggleCFDVerificationModal}
                >
                    {showSubmittedModal ? (
                        <PoiPoaSubmitted
                            onClickOK={toggleCFDVerificationModal}
                            account_type={account_type}
                            mt5_login_list={mt5_login_list}
                            onClickYes={handleOpenJurisditionModal}
                        />
                    ) : (
                        <CFDFinancialStpRealAccountSignup
                            onFinish={() => {
                                setShowSubmittedModal(true);
                            }}
                        />
                    )}
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default connect(({ client, modules, ui }: RootStore) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_cfd_verification_modal_visible: modules.cfd.is_cfd_verification_modal_visible,
    toggleCFDVerificationModal: modules.cfd.toggleCFDVerificationModal,
    account_type: modules.cfd.account_type,
    mt5_login_list: client.mt5_login_list,
    toggleJurisdictionModal: modules.cfd.toggleJurisdictionModal,
}))(CFDDbViOnBoarding);
