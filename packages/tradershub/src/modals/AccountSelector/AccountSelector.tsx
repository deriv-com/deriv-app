import React from 'react';
import { TradingAccountsList } from '@/components';
import { useQueryParams } from '@/hooks';
import { Button, Modal, Text } from '@deriv-com/ui';

const AccountSelector = () => {
    const { isModalOpen, openModal, closeModal } = useQueryParams();
    return (
        <Modal isOpen={isModalOpen('AccountSelector')}>
            <Modal.Header onRequestClose={closeModal}>
                <Text weight='bold'>Select an account</Text>
            </Modal.Header>
            <Modal.Body>
                <TradingAccountsList />
            </Modal.Body>
            <Modal.Footer className='grid-cols-1'>
                <Button
                    isFullWidth
                    onClick={() => {
                        openModal('AddOrManageAccount');
                    }}
                    variant='outlined'
                >
                    Add or manage account
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AccountSelector;
