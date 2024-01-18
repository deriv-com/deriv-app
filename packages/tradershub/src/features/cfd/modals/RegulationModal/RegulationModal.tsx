import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { Modal } from '../../../../components/Modal';

const RegulationModal = () => {
    return (
        <Modal className='w-full md:max-w-[743px]'>
            <Modal.Header title='Non-eu and eu regulations' />
            <Modal.Content className='p-800 md:p-1200'>
                <Text className='text-center' size='sm'>
                    TEST TEXT
                </Text>
            </Modal.Content>
        </Modal>
    );
};

export default RegulationModal;
