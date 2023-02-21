import React from 'react';
import { connect } from 'Stores/connect';
import { Modal, DesktopWrapper, MobileWrapper, FormSubmitButton, Text } from '@deriv/components';
import { withRouter } from 'react-router';
import { localize } from '@deriv/translations';
import './warning-close-create-real-account-modal.scss';

const WarningMessageModal = ({ setIsClosingCreateRealAccountModal, closeRealAccountSignup }) => {
    return (
        <div className='warning-close-create-real-account-modal'>
            <Text line_height='x' weight='bold' className='warning-close-create-real-account-modal__warning-message'>
                {localize("You haven't finished creating your account")}
            </Text>
            <div className='warning-close-create-real-account-modal__content-wrapper'>
                <Text size='xs' as='p' align='left' className='warning-close-create-real-account-modal__content'>
                    {localize('If you leave close this window, you will lose any information you have entered.')}
                </Text>
            </div>
            <FormSubmitButton
                is_disabled={false}
                label={localize('Continue creating account')}
                className='warning-close-create-real-account-modal__close-account-button'
                has_cancel
                cancel_label={localize('Close this window')}
                onClick={() => setIsClosingCreateRealAccountModal(false)}
                onCancel={() => {
                    setIsClosingCreateRealAccountModal(false);
                    closeRealAccountSignup();
                }}
            />
        </div>
    );
};

const WarningCloseCreateRealAccountModal = ({
    is_closing_create_real_account_modal,
    setIsClosingCreateRealAccountModal,
    closeRealAccountSignup,
}) => {
    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    id='warning_close_create_real_account_modal'
                    portalId='modal_root_absolute'
                    is_open={is_closing_create_real_account_modal}
                    has_close_icon={false}
                >
                    <WarningMessageModal
                        setIsClosingCreateRealAccountModal={setIsClosingCreateRealAccountModal}
                        closeRealAccountSignup={closeRealAccountSignup}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <Modal
                    id='warning_close_create_real_account'
                    portalId='modal_root_absolute'
                    is_open={is_closing_create_real_account_modal}
                    has_close_icon={false}
                >
                    <WarningMessageModal
                        setIsClosingCreateRealAccountModal={setIsClosingCreateRealAccountModal}
                        closeRealAccountSignup={closeRealAccountSignup}
                    />
                </Modal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ ui }) => ({
    is_closing_create_real_account_modal: ui.is_closing_create_real_account_modal,
    setIsClosingCreateRealAccountModal: ui.setIsClosingCreateRealAccountModal,
    closeRealAccountSignup: ui.closeRealAccountSignup,
}))(withRouter(WarningCloseCreateRealAccountModal));
