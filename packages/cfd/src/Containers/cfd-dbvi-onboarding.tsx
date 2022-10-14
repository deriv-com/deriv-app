import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import RootStore from 'Stores/index';
import { PoiPoaDocsSubmitted } from '@deriv/account';
import { connect } from 'Stores/connect';
import { WS, getAuthenticationStatusInfo } from '@deriv/shared';
import { AccountStatusResponse, GetAccountStatus } from '@deriv/api-types';
import CFDFinancialStpRealAccountSignup from './cfd-financial-stp-real-account-signup';

type TVerificationModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_cfd_verification_modal_visible: boolean;
    toggleCFDVerificationModal: () => void;
    jurisdiction_selected_shortcode: string;
    updateAccountStatus: () => void;
    account_status: GetAccountStatus;
    hasCreatedAccountForSelectedJurisdiction: () => boolean;
    openPasswordModal: () => void;
};

const CFDDbViOnBoarding = ({
    disableApp,
    enableApp,
    is_cfd_verification_modal_visible,
    toggleCFDVerificationModal,
    jurisdiction_selected_shortcode,
    updateAccountStatus,
    account_status,
    hasCreatedAccountForSelectedJurisdiction,
    openPasswordModal,
}: TVerificationModalProps) => {
    const [showSubmittedModal, setShowSubmittedModal] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(false);

    const getAccountStatusFromAPI = () => {
        WS.authorized.getAccountStatus().then((response: AccountStatusResponse) => {
            const { get_account_status } = response;

            if (get_account_status?.authentication) {
                const { need_poi_for_vanuatu, poi_acknowledged_for_bvi_labuan_maltainvest, poa_acknowledged } =
                    getAuthenticationStatusInfo(get_account_status);
                if (jurisdiction_selected_shortcode === 'vanuatu' && need_poi_for_vanuatu) {
                    setShowSubmittedModal(false);
                } else if (poi_acknowledged_for_bvi_labuan_maltainvest && poa_acknowledged) {
                    setShowSubmittedModal(true);
                } else {
                    setShowSubmittedModal(false);
                }
            }
            setIsLoading(false);
        });
    };
    React.useEffect(() => {
        if (is_cfd_verification_modal_visible) {
            setIsLoading(true);
            console.log('is_cfd_verification_modal_visible');
            getAccountStatusFromAPI();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_cfd_verification_modal_visible]);

    const getModalContent = () =>
        showSubmittedModal ? (
            <PoiPoaDocsSubmitted
                onClickOK={toggleCFDVerificationModal}
                updateAccountStatus={updateAccountStatus}
                account_status={account_status}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                hasCreatedAccountForSelectedJurisdiction={hasCreatedAccountForSelectedJurisdiction}
                openPasswordModal={openPasswordModal}
            />
        ) : (
            <CFDFinancialStpRealAccountSignup
                onFinish={() => {
                    setShowSubmittedModal(true);
                }}
            />
            // <div> Amn</div>
        );

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
                    title={localize('Add a real MT5 account')}
                    toggleModal={toggleCFDVerificationModal}
                    height='700px'
                    width='996px'
                    onMount={() => getAccountStatusFromAPI()}
                    exit_classname='cfd-modal--custom-exit'
                >
                    {getModalContent()}
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={localize('Add a real MT5 account')}
                    wrapper_classname='cfd-financial-stp-modal'
                    visible={is_cfd_verification_modal_visible}
                    onClose={toggleCFDVerificationModal}
                >
                    {getModalContent()}
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
    updateAccountStatus: client.updateAccountStatus,
    account_status: client.account_status,
    hasCreatedAccountForSelectedJurisdiction: modules.cfd.hasCreatedAccountForSelectedJurisdiction,
    openPasswordModal: modules.cfd.enableCFDPasswordModal,
}))(CFDDbViOnBoarding);
