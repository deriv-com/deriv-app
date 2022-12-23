import React from 'react';
import {
    Button,
    DesktopWrapper,
    Icon,
    Loading,
    MobileDialog,
    MobileWrapper,
    Modal,
    Text,
    UILoader,
} from '@deriv/components';
import { localize } from '@deriv/translations';
import RootStore from '../Stores/index';
import { PoiPoaDocsSubmitted } from '@deriv/account';
import { connect } from '../Stores/connect';
import { getAuthenticationStatusInfo, isMobile, WS } from '@deriv/shared';
import { AccountStatusResponse } from '@deriv/api-types';
import { TCFDDbviOnboardingProps } from './props.types';
import CFDFinancialStpRealAccountSignup from './cfd-financial-stp-real-account-signup';

const SwitchToRealAccountMessage = ({ onClickOk }: { onClickOk: () => void }) => (
    <div className='da-icon-with-message'>
        <Icon icon={'IcPoaLock'} size={128} />
        <Text className='da-icon-with-message__text' as='p' size={isMobile() ? 'xs' : 's'} weight='bold'>
            {localize('Switch to your real account to submit your documents')}
        </Text>
        <Button
            has_effect
            text={localize('Ok')}
            onClick={() => {
                onClickOk();
            }}
            className='da-icon-with-message__button'
            primary
        />
    </div>
);

const CFDDbviOnboarding = ({
    account_status,
    context,
    disableApp,
    enableApp,
    fetchAccountSettings,
    has_created_account_for_selected_jurisdiction,
    has_submitted_cfd_personal_details,
    is_cfd_verification_modal_visible,
    is_virtual,
    jurisdiction_selected_shortcode,
    openPasswordModal,
    toggleCFDVerificationModal,
    updateAccountStatus,
    updateMT5Status,
}: TCFDDbviOnboardingProps) => {
    const [showSubmittedModal, setShowSubmittedModal] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(false);

    const getAccountStatusFromAPI = () => {
        WS.authorized.getAccountStatus().then((response: AccountStatusResponse) => {
            const { get_account_status } = response;

            if (get_account_status?.authentication) {
                const { poi_acknowledged_for_vanuatu_maltainvest, poi_acknowledged_for_bvi_labuan, poa_acknowledged } =
                    getAuthenticationStatusInfo(get_account_status);
                if (jurisdiction_selected_shortcode === 'vanuatu') {
                    setShowSubmittedModal(
                        poi_acknowledged_for_vanuatu_maltainvest &&
                            poa_acknowledged &&
                            has_submitted_cfd_personal_details
                    );
                } else if (jurisdiction_selected_shortcode === 'maltainvest') {
                    setShowSubmittedModal(poi_acknowledged_for_vanuatu_maltainvest && poa_acknowledged);
                } else
                    setShowSubmittedModal(
                        poi_acknowledged_for_bvi_labuan && poa_acknowledged && has_submitted_cfd_personal_details
                    );
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
        if (is_loading) {
            return <Loading is_fullscreen={false} />;
        } else if (is_virtual) {
            return <SwitchToRealAccountMessage onClickOk={toggleCFDVerificationModal} />;
        }
        return showSubmittedModal ? (
            <PoiPoaDocsSubmitted
                onClickOK={toggleCFDVerificationModal}
                updateAccountStatus={updateAccountStatus}
                account_status={account_status}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                has_created_account_for_selected_jurisdiction={has_created_account_for_selected_jurisdiction}
                openPasswordModal={openPasswordModal}
                context={context}
            />
        ) : (
            <CFDFinancialStpRealAccountSignup
                onFinish={() => {
                    updateMT5Status();
                    if (has_created_account_for_selected_jurisdiction) {
                        setShowSubmittedModal(true);
                    } else {
                        toggleCFDVerificationModal();
                        openPasswordModal();
                    }
                }}
                context={context}
            />
        );
    };

    const getModalTitle = () =>
        has_created_account_for_selected_jurisdiction
            ? localize('Submit your proof of identity and address')
            : localize('Add a real MT5 account');

    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    className='cfd-financial-stp-modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={is_cfd_verification_modal_visible}
                    title={getModalTitle()}
                    toggleModal={toggleCFDVerificationModal}
                    height='700px'
                    width='996px'
                    context={context}
                    onMount={() => getAccountStatusFromAPI()}
                    exit_classname='cfd-modal--custom-exit'
                >
                    {getModalContent()}
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={getModalTitle()}
                    wrapper_classname='cfd-financial-stp-modal'
                    visible={is_cfd_verification_modal_visible}
                    onClose={toggleCFDVerificationModal}
                    context={context}
                >
                    {getModalContent()}
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default connect(({ client, modules: { cfd }, ui }: RootStore) => ({
    account_status: client.account_status,
    account_type: cfd.account_type,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    fetchAccountSettings: client.fetchAccountSettings,
    has_created_account_for_selected_jurisdiction: cfd.has_created_account_for_selected_jurisdiction,
    has_submitted_cfd_personal_details: cfd.has_submitted_cfd_personal_details,
    is_cfd_verification_modal_visible: cfd.is_cfd_verification_modal_visible,
    is_virtual: client.is_virtual,
    jurisdiction_selected_shortcode: cfd.jurisdiction_selected_shortcode,
    mt5_login_list: client.mt5_login_list,
    openPasswordModal: cfd.enableCFDPasswordModal,
    toggleCFDVerificationModal: cfd.toggleCFDVerificationModal,
    updateAccountStatus: client.updateAccountStatus,
    updateMT5Status: client.updateMT5Status,
}))(CFDDbviOnboarding);
