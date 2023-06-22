import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import ProofOfIdentityContainer from '@deriv/account';
import { connect } from 'Stores/connect';

const VerificationModal = ({
    account_settings,
    account_status,
    app_routing_history,
    fetchResidenceList,
    getChangeableFields,
    is_from_external,
    is_switching,
    is_virtual,
    is_high_risk,
    is_verification_modal_visible,
    is_withdrawal_lock,
    onStateChange,
    refreshNotifications,
    routeBackInApp,
    setIsVerificationModalVisible,
    should_allow_authentication,
    updateAccountStatus,
}: any) => {
    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    className='cfd-financial-stp-modal'
                    is_open={true}
                    title='Submit your proof of identity and address'
                    toggleModal={() => setIsVerificationModalVisible(false)}
                    height='700px'
                    width='996px'
                    exit_classname='cfd-modal--custom-exit'
                >
                    <ProofOfIdentityContainer
                        account_settings={account_settings}
                        account_status={account_status}
                        app_routing_history={app_routing_history}
                        fetchResidenceList={fetchResidenceList}
                        getChangeableFields={getChangeableFields}
                        is_from_external={true}
                        is_switching={is_switching}
                        is_virtual={is_virtual}
                        is_high_risk={is_high_risk}
                        is_withdrawal_lock={is_withdrawal_lock}
                        onStateChange={onStateChange}
                        refreshNotifications={refreshNotifications}
                        routeBackInApp={routeBackInApp}
                        should_allow_authentication={should_allow_authentication}
                        is_description_enabled
                        updateAccountStatus={updateAccountStatus}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title='Submit your proof of identity and address'
                    wrapper_classname='cfd-financial-stp-modal'
                    visible={is_verification_modal_visible}
                    onClose={() => setIsVerificationModalVisible(false)}
                >
                    <ProofOfIdentityContainer
                        account_settings={account_settings}
                        account_status={account_status}
                        app_routing_history={app_routing_history}
                        fetchResidenceList={fetchResidenceList}
                        getChangeableFields={getChangeableFields}
                        is_from_external={is_from_external}
                        is_switching={is_switching}
                        is_virtual={is_virtual}
                        is_high_risk={is_high_risk}
                        is_withdrawal_lock={is_withdrawal_lock}
                        onStateChange={onStateChange}
                        refreshNotifications={refreshNotifications}
                        routeBackInApp={routeBackInApp}
                        should_allow_authentication={should_allow_authentication}
                        is_description_enabled
                        updateAccountStatus={updateAccountStatus}
                    />
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default connect(({ client, common, notifications, ui }: any) => ({
    account_settings: client.account_settings,
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    fetchResidenceList: client.fetchResidenceList,
    getChangeableFields: client.getChangeableFields,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    is_high_risk: client.is_high_risk,
    is_withdrawal_lock: client.is_withdrawal_lock,
    is_verification_modal_visible: ui.is_verification_modal_visible,
    refreshNotifications: notifications.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    setIsVerificationModalVisible: ui.setIsVerificationModalVisible,
    should_allow_authentication: client.should_allow_authentication,
    updateAccountStatus: client.updateAccountStatus,
}))(withRouter(VerificationModal));
