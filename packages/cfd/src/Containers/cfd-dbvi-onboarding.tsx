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
    has_created_account_for_selected_jurisdiction: boolean;
    openPasswordModal: () => void;
    has_submitted_cfd_personal_details: boolean;
    fetchAccountSettings: () => void;
};

const CFDDbViOnBoarding = ({
    disableApp,
    enableApp,
    is_cfd_verification_modal_visible,
    toggleCFDVerificationModal,
    jurisdiction_selected_shortcode,
    updateAccountStatus,
    account_status,
    has_created_account_for_selected_jurisdiction,
    openPasswordModal,
    has_submitted_cfd_personal_details,
    fetchAccountSettings,
}: TVerificationModalProps) => {
    const [showSubmittedModal, setShowSubmittedModal] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(false);

    const getAccountStatusFromAPI = () => {
        WS.authorized.getAccountStatus().then((response: AccountStatusResponse) => {
            const { get_account_status } = response;

            if (get_account_status?.authentication) {
                const { need_poi_for_vanuatu, poi_acknowledged_for_bvi_labuan_maltainvest, poa_acknowledged } =
                    getAuthenticationStatusInfo(get_account_status);
                if (
                    jurisdiction_selected_shortcode === 'vanuatu' &&
                    need_poi_for_vanuatu &&
                    has_submitted_cfd_personal_details
                ) {
                    setShowSubmittedModal(false);
                } else if (
                    poi_acknowledged_for_bvi_labuan_maltainvest &&
                    poa_acknowledged &&
                    has_submitted_cfd_personal_details
                ) {
                    setShowSubmittedModal(true);
                } else {
                    setShowSubmittedModal(false);
                }
            }
            setIsLoading(false);
        });
        setIsLoading(false);
    };
    React.useEffect(() => {
        if (is_cfd_verification_modal_visible) {
            setIsLoading(true);
            getAccountStatusFromAPI();
            fetchAccountSettings();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_cfd_verification_modal_visible]);

    const getModalContent = () => {
        return showSubmittedModal ? (
            <PoiPoaDocsSubmitted
                onClickOK={toggleCFDVerificationModal}
                updateAccountStatus={updateAccountStatus}
                account_status={account_status}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                has_created_account_for_selected_jurisdiction={has_created_account_for_selected_jurisdiction}
                openPasswordModal={openPasswordModal}
            />
        ) : (
            <CFDFinancialStpRealAccountSignup
                onFinish={() => {
                    toggleCFDVerificationModal();
                    if (has_created_account_for_selected_jurisdiction) {
                        setShowSubmittedModal(true);
                    } else {
                        openPasswordModal();
                    }
                }}
            />
        );
    };

    return is_loading ? (
        <Loading is_fullscreen={false} />
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
    has_created_account_for_selected_jurisdiction: modules.cfd.has_created_account_for_selected_jurisdiction,
    openPasswordModal: modules.cfd.enableCFDPasswordModal,
    has_submitted_cfd_personal_details: modules.cfd.has_submitted_cfd_personal_details,
    fetchAccountSettings: client.fetchAccountSettings,
}))(CFDDbViOnBoarding);
