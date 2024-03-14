import React from 'react';
import { DummyComponent } from '@/features/cfd/components';
import { useQueryParams } from '@/hooks';
import { Modal } from '@deriv-com/ui';

const DummyComponentModal = () => {
    const { isModalOpen, closeModal } = useQueryParams();

    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('DummyComponentModal')} onRequestClose={closeModal}>
            <Modal.Body className='max-w-[330px] '>
                <DummyComponent />
            </Modal.Body>
        </Modal>
    );
};

export default DummyComponentModal;
