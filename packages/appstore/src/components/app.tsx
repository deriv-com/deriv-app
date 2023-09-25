import React, { PropsWithChildren, useState } from 'react';
import CashierStoreProvider from '@deriv/cashier/src/cashier-providers';
import CFDStoreProvider from '@deriv/cfd/src/cfd-providers';
import { StoreProvider } from '@deriv/stores';
import { ModalContext, useModalContext } from '../wallets/context/modal-context';
import AppContent from './app-content';
import './app.scss';
import { MobileDialog, Button, DesktopWrapper, MobileWrapper, Modal, Text } from '@deriv/components';
import { ModalProvider } from 'src/wallets/context/ModalProvider';

type TProps = {
    passthrough: {
        root_store: React.ComponentProps<typeof StoreProvider>['store'];
    };
};

const WrapperWithModals = ({ children }: PropsWithChildren) => {
    const [show_test_modal, setShowTestModal] = useState(false);

    return (
        <ModalContext.Provider value={{ show_test_modal, setShowTestModal }}>
            {children}
            <ModalManager />
        </ModalContext.Provider>
    );
};

const TestModalForContext = () => {
    const { setShowTestModal, show_test_modal } = useModalContext();

    const ModalContent = () => (
        <React.Fragment>
            <Text as='p' size='xs' line_height='s' align='center'>
                TestModalForContext
            </Text>
        </React.Fragment>
    );

    const ModalFooter = () => (
        <Button.Group>
            <Button secondary onClick={() => setShowTestModal(false)}>
                Close
            </Button>
        </Button.Group>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='wallet-success-dialog'
                    is_open={show_test_modal}
                    toggleModal={setShowTestModal}
                    has_close_icon={false}
                    small
                    shouldCloseOnEscape={true}
                >
                    <Modal.Body>
                        <ModalContent />
                    </Modal.Body>
                    <Modal.Footer className='wallet-success-dialog__footer'>
                        <ModalFooter />
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    visible={show_test_modal}
                    onClose={() => setShowTestModal(false)}
                    has_full_height
                >
                    <div className='wallet-success-dialog__content'>
                        <ModalContent />
                        <div className='wallet-success-dialog__footer'>
                            <ModalFooter />
                        </div>
                    </div>
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

const ModalManager = () => {
    return <TestModalForContext />;
};

const App: React.FC<TProps> = ({ passthrough: { root_store } }) => (
    <CashierStoreProvider store={root_store}>
        <CFDStoreProvider store={root_store}>
            <StoreProvider store={root_store}>
                <WrapperWithModals>
                    <ModalProvider>
                        <AppContent />
                    </ModalProvider>
                </WrapperWithModals>
            </StoreProvider>
        </CFDStoreProvider>
    </CashierStoreProvider>
);

export default App;
