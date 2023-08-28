import React from 'react';
import DesktopWrapper from '../desktop-wrapper';
import MobileWrapper from '../mobile-wrapper';
import Modal from '../modal';
import MobileDialog from '../mobile-dialog';
import ErrorModalContent from './error-modal-content';

type TMessageObject = {
    message: string;
    toString: () => string;
};

type TErrorModalProps = {
    messages: Array<TMessageObject | React.ReactNode>;
};

const ErrorModal = ({ messages }: TErrorModalProps) => {
    const [is_error_modal_open, setErrorModalOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        setErrorModalOpen(true);
    }, []);

    const toggleErrorModal = () => {
        setErrorModalOpen(!is_error_modal_open);
    };

    const error_message_description = messages.map(message => {
        if (typeof message === 'string') {
            return message;
        }
        return message?.toString();
    });

    return (
        <Modal has_close_icon width='440px' height='284px' is_open={is_error_modal_open} toggleModal={toggleErrorModal}>
            <DesktopWrapper>
                <Modal.Body>
                    <ErrorModalContent error_message={error_message_description} />
                </Modal.Body>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    has_close_icon
                    visible={is_error_modal_open}
                    onClose={toggleErrorModal}
                >
                    <Modal.Body>
                        <ErrorModalContent error_message={error_message_description} />
                    </Modal.Body>
                </MobileDialog>
            </MobileWrapper>
        </Modal>
    );
};

export default ErrorModal;
