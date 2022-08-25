import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import RootStore from 'Stores/index';
import { PoiPoaDocsSubmitted } from '@deriv/account';
import { connect } from 'Stores/connect';
import { WS, getAuthenticationStatusInfo } from '@deriv/shared';
import { AccountStatusResponse } from '@deriv/api-types';
import CFDFinancialStpRealAccountSignup from './cfd-financial-stp-real-account-signup';

type TVerificationModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_cfd_verification_modal_visible: boolean;
    toggleCFDVerificationModal: () => void;
    jurisdiction_selected_shortcode: string;
};

const CFDDbViOnBoarding = ({
    disableApp,
    enableApp,
    is_cfd_verification_modal_visible,
    toggleCFDVerificationModal,
    jurisdiction_selected_shortcode,
}: TVerificationModalProps) => {
    const [showSubmittedModal, setShowSubmittedModal] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(false);

    const getAccountStatusFromAPI = () => {
        WS.authorized.getAccountStatus().then((response: AccountStatusResponse) => {
            const { get_account_status } = response;
            setIsLoading(false);
            if (get_account_status?.authentication) {
                const identity_status = get_account_status?.authentication?.identity?.status;
                const document_status = get_account_status?.authentication?.document?.status;
                const { need_poi_for_vanuatu } = getAuthenticationStatusInfo(get_account_status);
                if (jurisdiction_selected_shortcode === 'vanuatu' && need_poi_for_vanuatu) {
                    setShowSubmittedModal(false);
                } else if (
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
            setIsLoading(true);
            setShowSubmittedModal(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_cfd_verification_modal_visible]);

    return is_loading ? (
        <Loading />
    ) : (
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
                        <PoiPoaDocsSubmitted onClickOK={toggleCFDVerificationModal} />
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
                        <PoiPoaDocsSubmitted onClickOK={toggleCFDVerificationModal} />
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
    jurisdiction_selected_shortcode: modules.cfd.jurisdiction_selected_shortcode,
}))(CFDDbViOnBoarding);
