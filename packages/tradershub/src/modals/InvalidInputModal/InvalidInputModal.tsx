import React from 'react';
import { useQueryParams } from '@/hooks';
import { InvalidInput } from '@/screens';
import { Modal } from '@deriv-com/ui';

/**
 * @name InvalidInputModal
 * @description The InvalidInputModal component is used to display the invalid input error message.
 * @example <InvalidInputModal />
 * @returns {React.ReactNode}
 */

const InvalidInputModal = () => {
    const { isModalOpen, closeModal } = useQueryParams();
    return (
        <Modal isOpen={isModalOpen('InvalidInputModal')} onRequestClose={closeModal}>
            <Modal.Body>
                <InvalidInput />
            </Modal.Body>
        </Modal>
    );
};

export default InvalidInputModal;
