import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { useStores } from 'Stores/index';

const ModalContent = () => {
    return <div>Abcd</div>;
};

const AccountTypeModal = () => {
    const { tradinghub, ui } = useStores();
    const { is_account_type_modal_visible, toggleAccountTypeModalVisibility } = tradinghub;
    const { enableApp, disableApp } = ui;
    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='account-type-modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        exit_classname='cfd-modal--custom-exit'
                        is_open={is_account_type_modal_visible}
                        // is_open={true}
                        title={'Abcd'}
                        toggleModal={toggleAccountTypeModalVisibility}
                        type='button'
                        height='664px'
                        width={'1200px'}
                    >
                        <ModalContent />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='deriv_app'
                        title={'Abcd'}
                        visible={is_account_type_modal_visible}
                        onClose={toggleAccountTypeModalVisibility}
                    >
                        <ModalContent />
                    </MobileDialog>
                </MobileWrapper>
            </React.Suspense>
        </div>
    );
};
export default AccountTypeModal;
