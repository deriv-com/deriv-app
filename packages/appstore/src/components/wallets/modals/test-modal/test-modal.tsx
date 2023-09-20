import React from 'react';
import { Button, Modal, Text, DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import './test-modal.scss';

export const TestModalWithUsualProps = ({
    is_open,
    setIsOpen,
    value,
}: {
    is_open: boolean;
    setIsOpen: (value: boolean) => void;
    value?: string;
}) => {
    const ModalContent = () => (
        <React.Fragment>
            <Text as='p' size='xs' line_height='s' align='center' className='wallet-success-dialog__description'>
                TestModalWithUsualProps TEXT: {value}
            </Text>
        </React.Fragment>
    );

    const ModalFooter = () => (
        <Button.Group>
            <Button secondary onClick={() => setIsOpen(false)}>
                Close
            </Button>
        </Button.Group>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='wallet-success-dialog'
                    is_open={is_open}
                    toggleModal={setIsOpen}
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
                    visible={is_open}
                    onClose={() => setIsOpen(false)}
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

export const TestModalForHook = ({
    is_open,
    setIsOpen,
    value,
}: {
    is_open: boolean;
    setIsOpen: (value: boolean) => void;
    value?: string;
}) => {
    const ModalContent = () => (
        <React.Fragment>
            <Text as='p' size='xs' line_height='s' align='center' className='wallet-success-dialog__description'>
                FROM HOOK TEXT: {value}
            </Text>
        </React.Fragment>
    );

    const ModalFooter = () => (
        <Button.Group>
            <Button secondary onClick={() => setIsOpen(false)}>
                Close
            </Button>
        </Button.Group>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='wallet-success-dialog'
                    is_open={is_open}
                    toggleModal={setIsOpen}
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
                    visible={is_open}
                    onClose={() => setIsOpen(false)}
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

export const TestModal = ({
    is_open,
    setIsOpen,
    value,
}: {
    is_open: boolean;
    setIsOpen: (value: boolean) => void;
    value?: string;
}) => {
    const ModalContent = () => (
        <React.Fragment>
            <Text as='p' size='xs' line_height='s' align='center' className='wallet-success-dialog__description'>
                TEXT: {value}
            </Text>
        </React.Fragment>
    );

    const ModalFooter = () => (
        <Button.Group>
            <Button secondary onClick={() => setIsOpen(false)}>
                Close
            </Button>
        </Button.Group>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='wallet-success-dialog'
                    is_open={is_open}
                    toggleModal={setIsOpen}
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
                    visible={is_open}
                    onClose={() => setIsOpen(false)}
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

const useTestModal = (value = '') => {
    const [is_open, setIsOpen] = React.useState(false);

    const modal = <TestModal is_open={is_open} setIsOpen={setIsOpen} value={value} />;

    return {
        is_open,
        setIsOpen,
        modal,
    };
};

export default useTestModal;
