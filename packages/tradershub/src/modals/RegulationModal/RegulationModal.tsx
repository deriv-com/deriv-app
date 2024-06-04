import React from 'react';
import { RegulationTableContent } from '@/components';
import { useQueryParams } from '@/hooks';
import { Modal, Text } from '@deriv-com/ui';

const RegulationModal = () => {
    const { isModalOpen, closeModal } = useQueryParams();
    return (
        <Modal
            ariaHideApp={false}
            className='w-full'
            isOpen={isModalOpen('RegulationModal')}
            onRequestClose={closeModal}
        >
            <Modal.Header onRequestClose={closeModal}>
                <Text size='sm' weight='bold'>
                    Non-EU and EU regulations
                </Text>
            </Modal.Header>
            <Modal.Body className='p-16 lg:p-24 lg:max-h-[750px]'>
                <RegulationTableContent />
            </Modal.Body>
        </Modal>
    );
};

export default RegulationModal;
