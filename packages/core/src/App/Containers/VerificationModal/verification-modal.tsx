import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader, AutoHeightWrapper } from '@deriv/components';
import { ProofOfIdentityContainer } from '@deriv/account';
import { observer, useStore } from '@deriv/stores';
import './verification-modal.scss';

const VerificationModal = observer(({ is_from_external, onStateChange }: any) => {
    const { client, common, notifications, ui } = useStore();
    const {
        account_status,
        account_settings,
        fetchResidenceList,
        getChangeableFields,
        is_switching,
        is_high_risk,
        is_withdrawal_lock,
        should_allow_authentication,
        is_virtual,
        updateAccountStatus,
    } = client;
    const { refreshNotifications } = notifications;
    const { app_routing_history, routeBackInApp } = common;
    const { is_verification_modal_visible, setIsVerificationModalVisible } = ui;
    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    className='verification-modal'
                    is_open={is_verification_modal_visible}
                    title='Submit your proof of identity and address'
                    toggleModal={() => setIsVerificationModalVisible(false)}
                    height='700px'
                    width='996px'
                    exit_classname='verification-modal--custom-exit'
                >
                    <AutoHeightWrapper default_height={200}>
                        {({ setRef }) => (
                            <div ref={setRef} className='proof-of-identity'>
                                <div className='proof-of-identity__main-container'>
                                    <ProofOfIdentityContainer
                                        height='620px'
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
                                </div>
                            </div>
                        )}
                    </AutoHeightWrapper>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title='Submit your proof of identity and address'
                    wrapper_classname='verification-modal'
                    visible={is_verification_modal_visible}
                    onClose={() => setIsVerificationModalVisible(false)}
                >
                    <AutoHeightWrapper default_height={200}>
                        {({ setRef }) => (
                            <div ref={setRef} className='proof-of-identity'>
                                <div className='proof-of-identity__main-container'>
                                    <ProofOfIdentityContainer
                                        height='620px'
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
                                </div>
                            </div>
                        )}
                    </AutoHeightWrapper>
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
});

export default withRouter(VerificationModal);
